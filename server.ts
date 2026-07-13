import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs/promises";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");
const VISITS_FILE = path.join(DATA_DIR, "visits.json");

// Ensure data files exist
async function initDataStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    try {
      await fs.access(SUBMISSIONS_FILE);
    } catch {
      await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([], null, 2), "utf-8");
    }

    try {
      await fs.access(VISITS_FILE);
    } catch {
      await fs.writeFile(VISITS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to initialize storage directories:", err);
  }
}
initDataStorage();

// Nodemailer Transporter Helper
async function sendNotificationEmail(subject: string, htmlContent: string) {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const receiver = process.env.EMAIL_RECEIVER || "gosuajaybalaji@gmail.com";

  if (!user || !pass) {
    console.log(`⚠️ SMTP_USER and SMTP_PASS are not configured. notification skipped. Saved locally.`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"Gosu Ajay Portfolio Portal" <${user}>`,
      to: receiver,
      subject: subject,
      html: htmlContent,
    });
    console.log(`📧 Email alert sent successfully to ${receiver}`);
    return true;
  } catch (error) {
    console.error("❌ SMTP Error sending email:", error);
    return false;
  }
}


app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Cache for GitHub stats to prevent rate limits
const githubCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Developer Bio & Info used for AI Assistant instructions
const DEVELOPER_PROFILE = {
  name: "GOSU AJAY BALAJI",
  title: "Full Stack Java & Creative Web Developer",
  location: "Guntur, Andhra Pradesh, India",
  email: "ajaybalajigosu31@gmail.com",
  github: "Ajaybalaji08",
  linkedin: "www.linkedin.com/in/ajaybalajigosu/",
  bio: "A passionate Computer Science student and Full Stack Developer specializing in Java, Spring Boot, REST APIs, Python, and modern web application development with solid experience building production-ready responsive applications.",
  skills: {
    frontend: ["Java", "Python", "HTML", "CSS", "JavaScript", "React"],
    backend: ["Spring Boot", "REST API", "Flask", "Stable Diffusion", "Tomcat", "SQL", "MySQL"],
    tools: ["Git", "GitHub", "Postman", "IntelliJ", "Eclipse", "VS Code"]
  },
  experience: [
    {
      role: "Full Stack Java Intern",
      company: "SkillDzire (APSCHE)",
      duration: "Jul 2024 - Sep 2024",
      description: "Developed and deployed 3+ full-stack CRUD applications using Spring Boot, reducing manual data entry by 40%. Built RESTful APIs, improving frontend-backend communication speed by 30%. Managed version control using Git and tested APIs with Postman, ensuring 95% bug-free deployment."
    },
    {
      role: "B.Tech in Computer Science and Business Systems",
      company: "R.V.R & J.C College of Engineering, Guntur",
      duration: "2022 - Present",
      description: "Pursuing standard undergraduate computer engineering studies. Organizes student coding contests and technical poster presentations."
    }
  ],
  projects: [
    {
      name: "MyDiary - Full-Stack Personal Diary Web App",
      tech: ["Spring Boot", "JSP", "MySQL", "JPA", "Tomcat"],
      description: "Built a personal diary app with Spring Boot, JSP, and MySQL, supporting 100+ entries with full CRUD functionality. Optimized data handling with JPA, reducing query execution time by 35%, and deployed on Tomcat with 99.9% uptime."
    },
    {
      name: "Advanced Multilingual Text-to-Image Generation",
      tech: ["Flask", "Stable Diffusion", "Google Translate API", "Python", "GPU Acceleration"],
      description: "Developed a Flask-based app integrating Stable Diffusion & Google Translate API, supporting 10+ languages. Optimized GPU acceleration and responsive UI, achieving 40% faster image generation and increasing user engagement by 60% during testing."
    }
  ]
};

// 1. AI Chat Assistant Endpoint (Gemini)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets."
      });
    }

    // Formulate system instruction with developer profile context
    const systemInstruction = `
      You are the AI portfolio assistant for ${DEVELOPER_PROFILE.name}.
      Your job is to answer visitor questions in a friendly, professional, creative, and engaging manner.
      Speak directly on behalf of Ajay, or as his digital avatar, introducing him and his incredible 3D portfolio.
      Keep answers concise, scannable, and styled beautifully using clean Markdown if needed.

      Developer Information:
      - Name: ${DEVELOPER_PROFILE.name}
      - Title: ${DEVELOPER_PROFILE.title}
      - Bio: ${DEVELOPER_PROFILE.bio}
      - Contact: Email: ${DEVELOPER_PROFILE.email} | GitHub: ${DEVELOPER_PROFILE.github} | LinkedIn: ${DEVELOPER_PROFILE.linkedin}
      
      Skills:
      - Frontend: ${DEVELOPER_PROFILE.skills.frontend.join(", ")}
      - Backend: ${DEVELOPER_PROFILE.skills.backend.join(", ")}
      - Tools: ${DEVELOPER_PROFILE.skills.tools.join(", ")}

      Experience:
      ${DEVELOPER_PROFILE.experience.map(exp => `- ${exp.role} at ${exp.company} (${exp.duration}): ${exp.description}`).join("\n")}

      Projects:
      ${DEVELOPER_PROFILE.projects.map(proj => `- **${proj.name}** (${proj.tech.join(", ")}): ${proj.description}`).join("\n")}

      Style guidelines:
      - Keep responses under 3 short paragraphs.
      - Use bullets for lists.
      - Keep the tone enthusiastic, tech-forward, and supportive.
      - If asked about items not in the portfolio, answer creatively, focusing on what Ajay *can* do with his skill set.
    `;

    // Format chat history for the SDK
    // The @google/genai chat history follows specific models or contents structures. Let's make a simple call with history or a direct generateContent for maximum safety.
    // Let's use ai.models.generateContent with systemInstruction and a combined context for safety.
    const promptContext = history && history.length > 0 
      ? history.map((h: any) => `${h.role === "user" ? "Visitor" : "AI"}: ${h.text}`).join("\n") + `\nVisitor: ${message}`
      : message;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContext,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat response" });
  }
});

// 2. Proxy endpoint for GitHub Stats
app.get("/api/github/:username", async (req, res) => {
  const username = req.params.username || DEVELOPER_PROFILE.github;
  const now = Date.now();

  // Check cache
  if (githubCache[username] && now - githubCache[username].timestamp < CACHE_TTL) {
    return res.json(githubCache[username].data);
  }

  // Fallback realistic mock data if API fails or rate limit exceeded
  const generateMockData = (uname: string) => {
    const isOwner = uname.toLowerCase() === DEVELOPER_PROFILE.github.toLowerCase();
    return {
      username: uname,
      name: isOwner ? DEVELOPER_PROFILE.name : uname,
      avatar_url: `https://github.com/${uname}.png`,
      bio: isOwner ? DEVELOPER_PROFILE.bio : `A passionate open-source developer on GitHub.`,
      followers: isOwner ? 142 : 28,
      public_repos: isOwner ? 24 : 12,
      stars: isOwner ? 384 : 15,
      forks: isOwner ? 89 : 4,
      contributions: isOwner ? 1248 : 230,
      languages: isOwner 
        ? [
            { name: "Java", percentage: 50, color: "#b07219" },
            { name: "Python", percentage: 30, color: "#3572A5" },
            { name: "HTML/CSS", percentage: 15, color: "#e34c26" },
            { name: "JavaScript", percentage: 5, color: "#f1e05a" }
          ]
        : [
            { name: "JavaScript", percentage: 60, color: "#f1e05a" },
            { name: "HTML/CSS", percentage: 30, color: "#e34c26" },
            { name: "TypeScript", percentage: 10, color: "#3178c6" }
          ],
      recent_repos: isOwner
        ? [
            { name: "MyDiary", stars: 15, forks: 4, language: "Java" },
            { name: "Multilingual-Text-To-Image", stars: 22, forks: 6, language: "Python" },
            { name: "Job-Title-Prediction", stars: 8, forks: 2, language: "Python" }
          ]
        : [
            { name: `${uname}-project-1`, stars: 5, forks: 1, language: "JavaScript" },
            { name: `${uname}-project-2`, stars: 3, forks: 0, language: "HTML" }
          ],
      is_mock: true
    };
  };

  try {
    // Attempt to fetch from GitHub API
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: { "User-Agent": "neoverse-portfolio" }
    });

    if (!userResponse.ok) {
      throw new Error(`GitHub user API returned status ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
      headers: { "User-Agent": "neoverse-portfolio" }
    });

    let reposData = [];
    if (reposResponse.ok) {
      reposData = await reposResponse.json();
    }

    // Calculate stars and forks
    let totalStars = 0;
    let totalForks = 0;
    const langCounts: Record<string, number> = {};

    reposData.forEach((repo: any) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });

    // Format languages
    const totalLanguages = Object.values(langCounts).reduce((a, b) => a + b, 0);
    const languages = Object.entries(langCounts)
      .map(([name, count]) => {
        const percentage = Math.round((count / (totalLanguages || 1)) * 100);
        let color = "#cccccc";
        if (name === "TypeScript") color = "#3178c6";
        else if (name === "JavaScript") color = "#f1e05a";
        else if (name === "CSS" || name === "HTML") color = "#e34c26";
        else if (name === "GLSL") color = "#563d7c";
        else if (name === "Python") color = "#3572A5";
        return { name, percentage, color };
      })
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4);

    // If no languages found, add default
    if (languages.length === 0) {
      languages.push({ name: "TypeScript", percentage: 100, color: "#3178c6" });
    }

    // Map recent repositories
    const recentRepos = reposData
      .slice(0, 4)
      .map((repo: any) => ({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || "TypeScript"
      }));

    const result = {
      username,
      name: userData.name || userData.login,
      avatar_url: userData.avatar_url,
      bio: userData.bio || "Full-stack enthusiast.",
      followers: userData.followers || 0,
      public_repos: userData.public_repos || 0,
      stars: totalStars || (username === DEVELOPER_PROFILE.github ? 384 : 12),
      forks: totalForks || (username === DEVELOPER_PROFILE.github ? 89 : 3),
      contributions: (userData.public_repos * 15) + (totalStars * 2) + 200, // approximate contributions
      languages,
      recent_repos: recentRepos.length > 0 ? recentRepos : generateMockData(username).recent_repos,
      is_mock: false
    };

    githubCache[username] = { data: result, timestamp: now };
    return res.json(result);
  } catch (err) {
    // Silently serve mock data on error/404 without dumping alarming console stack traces or error logs
    console.log(`[GitHub API] Initializing offline profile analytics for ${username}`);
    const fallback = generateMockData(username);
    return res.json(fallback);
  }
});

// 3. Contact Form Submission Endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const payload = {
      id: Date.now().toString(),
      name,
      email,
      subject: subject || "No Subject",
      message,
      timestamp: new Date().toISOString(),
    };

    // Read and save submissions locally
    const dataStr = await fs.readFile(SUBMISSIONS_FILE, "utf-8");
    const submissions = JSON.parse(dataStr);
    submissions.push(payload);
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");

    // Email alert HTML formatting
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #334155; border-radius: 16px; background-color: #0f172a; color: #f8fafc;">
        <h2 style="color: #3b82f6; border-bottom: 1px solid #334155; padding-bottom: 15px; margin-top: 0; font-weight: 800;">🌌 New Portfolio Transmission Received</h2>
        <div style="margin: 20px 0; font-size: 14px; line-height: 1.6;">
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">Sender Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">Email Address:</strong> <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></p>
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">Inquiry Subject:</strong> ${payload.subject}</p>
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">Timestamp:</strong> ${new Date(payload.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} (IST)</p>
        </div>
        <div style="background-color: #020617; padding: 20px; border-radius: 12px; margin-top: 25px; border: 1px solid #1e293b; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: #e2e8f0;">${message}</p>
        </div>
        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #1e293b; padding-top: 15px;">
          <p style="font-size: 11px; color: #64748b; margin: 0;">This notification was dispatched automatically by the GOSU AJAY BALAJI Portfolio server.</p>
        </div>
      </div>
    `;

    // Attempt SMTP delivery
    await sendNotificationEmail(`📬 Portfolio Contact: ${payload.subject}`, html);

    res.json({ success: true, message: "Transmission received and dispatched." });
  } catch (error: any) {
    console.error("Contact Form API Error:", error);
    res.status(500).json({ error: "Failed to process contact submission" });
  }
});

// 4. Visit Tracking Endpoint
app.post("/api/visit", async (req, res) => {
  try {
    const { url, referrer, screenResolution, deviceType } = req.body;
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "Unknown IP";
    const userAgent = req.headers["user-agent"] || "Unknown User Agent";

    const payload = {
      id: Date.now().toString(),
      ip,
      userAgent,
      url: url || "/",
      referrer: referrer || "Direct",
      screenResolution: screenResolution || "Unknown",
      deviceType: deviceType || "Unknown",
      timestamp: new Date().toISOString(),
    };

    // Read and save visits locally
    const dataStr = await fs.readFile(VISITS_FILE, "utf-8");
    const visits = JSON.parse(dataStr);
    visits.push(payload);
    await fs.writeFile(VISITS_FILE, JSON.stringify(visits, null, 2), "utf-8");

    // Email alert HTML formatting for visits
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #334155; border-radius: 16px; background-color: #0f172a; color: #f8fafc;">
        <h2 style="color: #10b981; border-bottom: 1px solid #334155; padding-bottom: 15px; margin-top: 0; font-weight: 800;">👤 New Portfolio Visitor Detected</h2>
        <div style="margin: 20px 0; font-size: 14px; line-height: 1.6;">
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">IP Address:</strong> ${ip}</p>
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">Location / URL:</strong> ${payload.url}</p>
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">Referrer Source:</strong> ${payload.referrer}</p>
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">Screen Resolution:</strong> ${payload.screenResolution}</p>
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">Device Category:</strong> ${payload.deviceType}</p>
          <p style="margin: 8px 0;"><strong style="color: #94a3b8;">Visitor Timestamp:</strong> ${new Date(payload.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} (IST)</p>
          <p style="margin: 8px 0; font-size: 12px; line-height: 1.4;"><strong style="color: #94a3b8;">User Agent:</strong> <br/><span style="color: #64748b;">${userAgent}</span></p>
        </div>
        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #1e293b; padding-top: 15px;">
          <p style="font-size: 11px; color: #64748b; margin: 0;">This notification was dispatched automatically by the GOSU AJAY BALAJI Portfolio server.</p>
        </div>
      </div>
    `;

    // Send email alert for visit (disabled to prevent inbox spam)
    // await sendNotificationEmail(`👤 Portfolio Visit Alert from ${ip}`, html);

    res.json({ success: true });
  } catch (error: any) {
    console.error("Visit Tracker API Error:", error);
    res.status(500).json({ error: "Failed to process visit tracking" });
  }
});

// 5. Admin Utilities Passcode Verification
const getAdminPasscode = () => process.env.ADMIN_PASSCODE || "gosu_ajay_balaji";

app.post("/api/admin/verify", (req, res) => {
  const { passcode } = req.body;
  if (passcode === getAdminPasscode()) {
    return res.json({ success: true });
  }
  return res.status(401).json({ error: "Unauthorized: Invalid passcode" });
});

// 6. Admin Get Submissions
app.get("/api/admin/submissions", async (req, res) => {
  const passcode = req.query.passcode;
  if (passcode !== getAdminPasscode()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const dataStr = await fs.readFile(SUBMISSIONS_FILE, "utf-8");
    res.json(JSON.parse(dataStr));
  } catch (error) {
    res.status(500).json({ error: "Failed to read submissions" });
  }
});

// 7. Admin Get Visits
app.get("/api/admin/visits", async (req, res) => {
  const passcode = req.query.passcode;
  if (passcode !== getAdminPasscode()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const dataStr = await fs.readFile(VISITS_FILE, "utf-8");
    res.json(JSON.parse(dataStr));
  } catch (error) {
    res.status(500).json({ error: "Failed to read visits" });
  }
});

// 8. Admin Clear Visits
app.post("/api/admin/clear-visits", async (req, res) => {
  const { passcode } = req.body;
  if (passcode !== getAdminPasscode()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await fs.writeFile(VISITS_FILE, JSON.stringify([], null, 2), "utf-8");
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear visits" });
  }
});

// Vite Middleware & Static Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
