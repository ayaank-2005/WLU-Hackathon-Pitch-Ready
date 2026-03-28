# Pitch Ready

A browser-based presentation rehearsal platform that helps students improve eye contact, pacing, clarity, and verbal delivery before graded presentations, interviews, and public speaking events.

Practice once inside a clean teleprompter environment, and immediately receive actionable feedback on how you spoke, where you looked, how fast you talked, and how often you relied on filler words.

## Features

- **Teleprompter** — Auto-scrolling script display with adjustable font size and speed
- **Speech Recognition** — Real-time transcription via the Web Speech API with rolling WPM calculation
- **Filler Word Detection** — Live tracking of "um," "uh," "like," "so," "basically," "literally," "you know," and "actually"
- **Eye Tracking** — Browser-based gaze estimation using WebGazer.js to measure camera engagement
- **Live HUD** — Real-time sidebar showing eye contact %, speech pace, filler word badges, and session timer
- **Post-Session Report** — Score circles, WPM timeline chart, filler breakdown, personalized tips, and full transcript
- **Attempt Comparison** — Each session is compared against the previous one with delta badges

## Tech Stack

- **React 19** with TypeScript
- **Vite 6** for builds and dev server
- **Tailwind CSS v4** for styling
- **Motion** (Framer Motion) for animations
- **Recharts** for data visualization
- **React Router** for client-side routing
- **Web Speech API** for speech recognition
- **WebGazer.js** for browser eye tracking
- **Lucide React** for icons

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:3000`.

## Project Structure

```
src/
├── App.tsx                    # Router setup
├── main.tsx                   # Entry point
├── index.css                  # Global styles + Tailwind
├── context/
│   └── SessionContext.tsx      # Session state management
├── hooks/
│   ├── useTimer.ts            # Session timer with pause/resume
│   ├── useSpeechRecognition.ts # Web Speech API wrapper
│   └── useEyeTracking.ts      # WebGazer.js wrapper
├── lib/
│   └── analytics.ts           # Score computation and tip generation
└── pages/
    ├── Landing.tsx             # Marketing landing page
    ├── Setup.tsx               # Script input, templates, settings
    ├── Session.tsx             # Live practice with teleprompter + HUD
    └── Report.tsx              # Post-session analytics
```

## User Flow

1. Land on the homepage and click **Start Practicing**
2. Paste a script or choose a template, configure font size and scroll speed
3. Grant camera and microphone permissions
4. Practice your presentation with live feedback
5. End the session and review your report
6. Practice again and see how you improved

## Browser Support

Speech recognition requires **Chrome** or **Edge**. Eye tracking uses WebGazer.js which works best in Chrome. The app degrades gracefully when features are unavailable — speech analytics still function without a camera, and the teleprompter works without speech recognition.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type checking |
| `npm run clean` | Remove `dist/` folder |
