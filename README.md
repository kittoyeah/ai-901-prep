# AI-901 Prep

A practice-question app for the **Microsoft Azure AI Fundamentals (AI-901)** exam.
Pick a topic, answer one question at a time, and read why every option is right or
wrong. Includes a timed mock exam and a terminology flashcard deck.

**Live:** https://ai-901-prep.vercel.app

## Features

- **Practise by topic** — 5 sections, 231 questions with full per-option explanations
  (single, multi-select, and case-study formats).
- **Mock exam** — a timed, exam-weighted random draw of 40 questions (~42% concepts /
  58% Foundry), scored out of 1000 against the 700 pass mark, with end-of-exam review.
  Every attempt is a fresh draw.
- **Flashcards** — 48 terminology cards, tap to flip, shuffle to drill.
- **Light / dark mode** with a no-flash toggle.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind v4 + a hand-built OKLCH design system (`app/globals.css`, portable
  `tokens.css`)
- TypeScript, statically prerendered, deployed on Vercel

## Question bank

Questions live as static JSON in [`data/`](./data) — one file per section plus
`flashcards.json`. They are loaded and typed through [`lib/bank.ts`](./lib/bank.ts).
All answers are grounded in the official AI-901 skills-measured blueprint and the
Microsoft Learn AI-901T00 modules.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Deploy

Connected to Vercel's Git integration: pushes to `main` deploy to production,
pull requests get preview deployments. CI (type-check + build) runs via GitHub
Actions on every push and PR.
