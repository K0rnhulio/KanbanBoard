# Team Kanban Board

A shared Kanban board for small teams. No login required — just deploy and start organizing.

## Features

- 🗂️ **Drag & drop** cards between columns
- ✅ **Toggle done** — checkbox with visual strikethrough
- 📝 **Notes** — click any card to add details
- ➕ **Add columns** — customize your workflow
- 💾 **Auto-save** — changes persist automatically
- 🌙 **Dark theme** — premium glassmorphism design

## Deploy to Vercel

1. Push this repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add a **KV Store** from the Vercel dashboard:
   - Go to **Storage** → **Create** → **KV**
   - Link it to your project
4. **Redeploy** — done!

> Without KV configured, the app uses in-memory storage (data resets on server restart). This is fine for local development.

## Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 15** (App Router)
- **Vercel KV** (Upstash Redis)
- **@hello-pangea/dnd** (drag & drop)
- Vanilla CSS with glassmorphism
