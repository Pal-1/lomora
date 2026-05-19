# LUMORA Studio — AI 4K Video Generator

A full React + TypeScript + Vite project. Runs locally, calls the Anthropic API through a local proxy (no CORS issues).

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18 or newer
- An [Anthropic API key](https://console.anthropic.com/keys)

### 2. Install & Run

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open your browser at **http://localhost:5173**

### 3. Enter your API Key
Paste your Anthropic API key (`sk-ant-...`) into the key field at the top of the studio. It's saved locally in your browser — never sent anywhere except directly to the Anthropic API.

---

## 📁 Project Structure

```
lumora/
├── index.html              # Entry HTML
├── vite.config.ts          # Vite + API proxy config (fixes CORS)
├── tsconfig.json
├── package.json
└── src/
    ├── main.tsx            # React root
    ├── App.tsx             # Main studio UI
    ├── App.module.css      # Studio styles
    ├── api.ts              # Anthropic API calls (via proxy)
    ├── types.ts            # TypeScript interfaces
    ├── index.css           # Global styles + CSS variables
    └── components/
        ├── Output.tsx      # Generated video display
        └── Output.module.css
```

---

## ⚙️ How the API Proxy Works

The `vite.config.ts` sets up a local proxy:

```
Browser → /api/anthropic/v1/messages
       → Vite Dev Server (localhost:5173)
       → https://api.anthropic.com/v1/messages
```

This sidesteps the browser CORS restriction entirely. Your API key is sent in the request header, never exposed in source code.

---

## 🎬 What It Generates

Enter any story idea and the AI produces a full cinematic production package:

- **Video title & logline**
- **Character profiles** — appearance, personality, consistency-locked
- **Scene breakdown** — 6–8 scenes with timestamps, locations, mood
- **Opening script** — scene headings, action lines, narration, dialogue
- **Shot list** — 8–10 camera shots with descriptions
- **Monetization strategy** — CPM estimate, mid-roll placements, SEO title, upload timing

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/`. For production use, you'll need a backend proxy (Node/Express/serverless) to forward API requests — don't expose your API key in a deployed frontend.
