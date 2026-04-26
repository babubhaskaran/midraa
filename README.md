# 📚 Midraa — English Tutor App

A gamified English learning app for teens — pick a novel, read an AI summary, take a 20-question quiz, get personalized feedback, and track progress over time.

## ✅ Current Status (Clean Start)

- ✅ Next.js project initialized (TypeScript + Tailwind)
- 🔄 Convex backend ready (AI functions scaffolded)
- 🔄 Frontend page created (landing → novel select → quiz → results)
- 🔄 OpenRouter AI integrated (tencent/hy3-preview:free)

## 🏗️ Milestones

### M1: Landing & Auth ✅
- Warm, teen-friendly theme
- Novel selection interface
- Basic dashboard shell

### M2: AI Summaries 🔄
- Curated novel list (~15 books)
- 500-word AI summaries via OpenRouter
- Clean summary display

### M3: Quiz & Gameplay 🔄
- 20 questions per novel (MCQ + subjective)
- Progress bar, interactive UI
- Submit flow

### M4: Evaluation & Feedback 🔄
- AI evaluates answers (auto-score MCQ, analyze written)
- Per-question feedback
- Overall score + strengths/weaknesses

### M5: Progress & Adaptive Learning 🔄
- Dashboard with session history
- AI adapts difficulty based on performance
- Visual progress indicators

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js + TypeScript + Tailwind |
| Backend | Convex (real-time DB) |
| AI | OpenRouter (tencent/hy3-preview:free) |
| Auth | Clerk/NextAuth (ready) |
| Hosting | Vercel |

## 🚀 Getting Started

```bash
cd /Users/babu/.openclaw/workspace/midraa
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📝 Next Steps

1. Add authentication (Clerk/NextAuth)
2. Complete M2–M5 (AI summaries, quiz, evaluation, progress)
3. Deploy to Vercel
4. Add more novels to the curated list
5. Polish UI/UX based on feedback

## 🔗 GitHub

- Repo: [babubhaskaran/midraa](https://github.com/babubhaskaran/midraa)

---

Built with ❤️ for Midra'a English learning journey.
