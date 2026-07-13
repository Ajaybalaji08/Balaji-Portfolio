export interface Project {
  name: string;
  tech: string[];
  description: string;
  link?: string;
  linkLabel?: string;
  github?: string;
  highlights?: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface SkillCategory {
  title: string;
  items: { name: string; level: number }[];
}

export interface GitHubLanguage {
  name: string;
  percentage: number;
  color: string;
}

export interface GitHubRepo {
  name: string;
  stars: number;
  forks: number;
  language: string;
}

export interface GitHubStats {
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  followers: number;
  public_repos: number;
  stars: number;
  forks: number;
  contributions: number;
  languages: GitHubLanguage[];
  recent_repos: GitHubRepo[];
  is_mock?: boolean;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}
