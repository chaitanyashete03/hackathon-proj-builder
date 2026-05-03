# HackForge 🚀

The Ultimate Project Builder running entirely on free tiers.

## Quick Start (Google Antigravity)

1. Run the setup script:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
2. Generate boilerplate files:
   ```bash
   node generate-remaining.js
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables
Copy `.env.example` to `.env.local`. 
- The project is configured to use mock data automatically if API keys are missing or invalid, ensuring the demo **never crashes**.
- To use real APIs, replace the placeholders with your actual keys (Supabase, Tavily, Gemini).

## Architecture & Wow Factors
- **3D Preview:** Live rotating cube using Three.js and React Three Fiber.
- **Voice Control:** Navigate the app hands-free using the Web Speech API.
- **Real-time Collaboration:** Yjs + WebRTC enables peer-to-peer live text editing.
- **Self-Healing:** All external API calls (Gemini/Tavily) use a custom `retry()` wrapper with exponential backoff and safe fallbacks.
- **Gamified Flow:** Progress bar, animated badges, and confetti to delight judges.

## Deployment
This project is Next.js App Router ready. Push to GitHub and import into Vercel for a zero-config deployment.
