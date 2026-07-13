Run instructions for the Neoverse project

Local (recommended)
1. Install Node.js v18+ (https://nodejs.org/)
2. From the project root run:

```powershell
npm install
npm run dev
```

Open http://localhost:3000

Production with Docker (alternative)
1. Install Docker Desktop for Windows.
2. From the project root build and run the container:

```powershell
docker build -t neoverse:latest .
docker run --rm -p 3000:3000 neoverse:latest
```

Or with docker-compose:

```powershell
docker-compose up --build
```

Diagnostics
- Check Node/npm:
```powershell
node -v
npm -v
```
- Check port 3000 usage:
```powershell
netstat -ano | findstr :3000
Get-NetTCPConnection -LocalPort 3000
```

Environment variables
- To enable Gemini or email features set the following in a `.env` file or your environment:
  - `GEMINI_API_KEY`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `EMAIL_RECEIVER`
  - `ADMIN_PASSCODE` (optional)

If you want, I can also try running the server here after you install Node, or help debug any startup errors you encounter—tell me which you'd like next.