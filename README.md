# TNA Reschedule Message Generator

Internal admin tool for The Nuggets Academy ops team.

## What it does
Generates all WhatsApp messages needed for a student reschedule:
- Part 1: Available make-up slots offer to parent
- Part 2: Parent confirmation, original teacher notification, make-up teacher notification, SleekFlow reminder

## Local development
```bash
npm install
npm run dev
```

## Deploy to Vercel (one-time setup)
1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import from GitHub
3. Select this repo — Vercel auto-detects Vite
4. Click Deploy
5. Done — you get a live URL like `tna-reschedule.vercel.app`

## Embed in Notion
1. In Notion, type `/embed`
2. Paste your Vercel URL
3. Resize to full width

## Updating class data
1. Export new CSV from Edulabs
2. Upload CSV in this Claude conversation
3. Say "update the class data"
4. Download new App.jsx → replace `src/App.jsx`
5. Push to GitHub → Vercel auto-redeploys

## Teacher list (current)
Rachel, Deslyn, Rui En, Jeremy, Jerlyn, Charmaine, Emily, Belize, Shannon, Melody, Aaron, Vivienne, Yun Zhen, Amanda, Gaby, Sandra, Humphrey, Heather, Eleanor
