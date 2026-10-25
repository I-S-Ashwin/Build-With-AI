---
doc: spec
status: approved
---

# MediSense — Technical Spec

## How This Works, In Plain Language

MediSense is a web app — a page you open in your laptop's browser, like Chrome. It lives entirely on your laptop; nothing gets sent to a company's server except your symptom text, which goes to Google's Gemini AI to get a response.

Here's how the pieces fit together:

- **The browser is the app.** Everything you see — the Mondrian layout, the animations, the chat — is built from HTML (the structure), CSS (the colours and style), and JavaScript (what happens when you click or speak). These are the three languages every website uses.
- **Your microphone → the browser's built-in speech tool.** When you tap the record button, the browser listens to your voice and turns it into text. This is a free feature built into modern browsers — no extra service needed.
- **Your symptom text → Google Gemini.** That text gets sent to Gemini (Google's AI), which understands what you described, asks a follow-up, and eventually gives a response. You need a free Gemini API key to do this — it's like a password that lets your app talk to Google's AI.
- **Your chat history → your browser's memory (localStorage).** When a session is saved, it goes into a small storage area your browser keeps just for this site — like a sticky note that stays on your laptop. It survives closing and reopening the browser.
- **PDF export → a small JS library (html2pdf.js).** When you export a session, this library takes the conversation text and turns it into a downloadable PDF file, all inside the browser.

Why this shape? Because everything runs locally in your browser — no server to set up, no hosting required, no ongoing costs beyond the Gemini API (which has a generous free tier). You can record a demo just by screen-recording the browser tab.

---

## The Core Journey Through the System

*PRD ref: `prd.md > The Core Journey`*

1. **You open the app** → browser loads `index.html` → JavaScript plays the opening animation (a CSS drop animation with the Mondrian palette) for 2 seconds → a sound plays → the preview page appears.
2. **You click Log In** → you type a username → JavaScript saves it to `localStorage` → app loads the main chat screen.
3. **First time only** → JavaScript checks localStorage for a "tutorial seen" flag. If it's not there, the tutorial overlay plays — an animated cursor moves to the settings button, the history panel, and the export button.
4. **You tap the record button** → the browser asks permission to use your microphone (first time only) → Web Speech API starts listening → your words appear as text on screen in real time.
5. **You stop recording** → the transcribed text is sent to the Gemini API with a system prompt that says "You are a calm healthcare triage assistant. Ask one follow-up question at a time. For minor issues, suggest a home remedy. For serious or unknown symptoms, advise the user to see a doctor."
6. **Gemini responds** → the response appears as the next message in the conversation → this continues until Gemini gives a final diagnosis or referral.
7. **Final response** → JavaScript shows the response full-screen with a CSS transition → you read it → you dismiss it.
8. **Session saved** → a CSS animation moves the session toward the history panel (the paper-throw effect) → the session object is saved to `localStorage` under a list of past sessions.
9. **Chat history** → the history panel reads from `localStorage` and lists sessions → clicking one shows the full conversation → the export button calls `html2pdf.js` to generate a PDF.

---

## Stack

| Piece | What it is | Why |
|---|---|---|
| HTML / CSS / JavaScript | The language of web pages | No install needed; runs directly in the browser. The right size for this PoC. |
| Web Speech API | Browser's built-in voice-to-text | Free, no API key, works in Chrome. Handles `prd.md > Triage Conversation` voice input. |
| Google Gemini API (`gemini-1.5-flash`) | AI that understands symptoms and responds | Free tier is generous enough for a PoC. Learner agreed to this choice. |
| localStorage | Browser's built-in data storage | Keeps chat history and settings across sessions with no database setup. |
| html2pdf.js (CDN) | Turns HTML content into a PDF | Simplest way to export sessions; no install needed, loaded from a CDN link. Docs: https://github.com/eKoopmans/html2pdf.js |
| CSS custom properties (variables) | Controls the light/dark theme | Pure CSS solution — no library needed for theme switching. |

**Gemini API note:** The learner will need a free Google Gemini API key. Steps: go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey), sign in with a Google account, create a key, and paste it into the app's config file. The key is stored locally in a `config.js` file — not committed to GitHub (added to `.gitignore`). ⚠️ *Verify current free-tier limits at setup time — rate limits may have changed.*

**Web Speech API note:** Works best in Google Chrome. Firefox has partial support. Safari may not support it. The build will note this in the app UI.

---

## Where It Runs and How Someone Tries It

- **Runs in:** Google Chrome on your laptop (no install, no server)
- **To start:** Open `index.html` directly in Chrome, or use a simple local server (`npx serve .` or VS Code's Live Server extension — `5-build` will set this up)
- **API key needed:** A free Google Gemini API key, pasted into `config.js`
- **Demo recording:** Screen-record the Chrome tab using your OS's built-in recorder (Windows: Win+G, or OBS)
- **Submission:** Short demo video + public GitHub repository (no deployment required)
- **Optional deployment:** Could be hosted on GitHub Pages or Netlify with a minor config change — not needed for the PoC

---

## Look and Feel

*From `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`*

- **Palette:** CSS custom properties define four primary colors — Mondrian red (`#D40000`), yellow (`#F5C400`), blue (`#003DA5`), black (`#000000`) — on a white (`#FFFFFF`) or near-black (`#111111`) background. Color is used structurally: panels are framed by thick black borders, accent blocks use the primaries.
- **Grid:** CSS Grid with thick black border-lines divides the layout into Mondrian-style rectangular regions. The main chat area, history sidebar, and settings bar are each a named grid region.
- **Typography:** A modern geometric sans-serif font (e.g. `Inter` or `DM Sans` from Google Fonts) — clean, architectural, highly legible at large sizes. The full-screen response uses a large type size (48px+).
- **Animations:** CSS `@keyframes` for the opening drop, the full-screen response reveal, and the paper-throw transition. Kept under 600ms except the 2-second opening.
- **Sound:** A single short audio file (`open.mp3`) played on app load via the HTML `Audio` API.
- **Light/dark theme:** CSS custom properties swap on a `data-theme` attribute on the `<body>` element. Dark mode uses near-black backgrounds with the same primary accents.
- **Skeleton screens:** CSS placeholder blocks (grey rectangles) that mimic the layout of each page — shown while the page JS initialises.
- **Tone of copy:** Calm, confident, direct. "I didn't catch that — try again or type below." Never clinical, never alarming.

---

## Components

### Opening Animation
Plays on page load. A CSS drop animation reveals the MediSense logo and name. A short sound plays via the `Audio` API. After 2 seconds, transitions to the Preview page.
*PRD ref: `prd.md > Opening and Onboarding`*

### Preview / Landing Page
Static HTML section shown before login. App name, one-line description, Log In button. Mondrian grid layout.
*PRD ref: `prd.md > Screens and Layout > 2. Preview / Landing Page`*

### Login
A username input and submit button. On submit: saves username to `localStorage`, checks for "tutorial seen" flag, routes to Main Chat or Tutorial.
*PRD ref: `prd.md > Login`*

### Tutorial Overlay
Shown on first login only. A full-screen overlay with an animated CSS cursor that moves to three UI elements (settings toggle, history panel, export button) in sequence, with a short description at each stop. Has a "Skip" button. On complete or skip: sets a `tutorialSeen: true` flag in `localStorage`.
*PRD ref: `prd.md > Opening and Onboarding > First-time tutorial`*

### Main Chat Interface
The primary screen. CSS Grid layout: top bar (app name, settings), main chat area (center), history sidebar (right), recording button (bottom center).
*PRD ref: `prd.md > Screens and Layout > 4. Main Chat Interface`*

### Recording Button and Voice Input
A microphone button at the bottom center. On click: calls `SpeechRecognition` (Web Speech API), displays transcribed text in real time in the chat area. On stop: sends the full transcribed text to the Gemini service.
*PRD ref: `prd.md > Triage Conversation`*

### Text Fallback Input
A text field visible below the recording button. Always available. On submit: sends text directly to the Gemini service. Shown with the message "Prefer to type? Use this instead."
*PRD ref: `prd.md > Triage Conversation`*

### Gemini Service (JavaScript module)
A JS module (`gemini.js`) that handles all communication with the Gemini API. Takes the conversation history and the user's latest message, sends them to Gemini with the triage system prompt, and returns the response text. Handles API errors and returns a safe fallback message.
*PRD ref: `prd.md > Triage Conversation`, `prd.md > Full-Screen Response`*

**System prompt (baked in):**
> "You are MediSense, a calm and helpful personal healthcare triage assistant. Your job is to help users understand what might be causing their symptoms and what they should do. Ask one follow-up question at a time. When you have enough information, give a short, calm response: either a practical home-remedy suggestion for minor issues, or a clear recommendation to see a doctor for anything serious or uncertain. Never diagnose. Never prescribe specific prescription medication. Always recommend a doctor when in doubt."

### Full-Screen Response
When Gemini signals its final response (detected by absence of a question mark or a "see a doctor" phrase), the response is displayed full-screen via a CSS overlay. Large text, cinematic reveal animation. A "Save Session" button dismisses it and triggers the paper-throw animation.
*PRD ref: `prd.md > Full-Screen Response`*

### Paper-Throw Animation and Session Save
On "Save Session": a CSS animation moves a visual representation of the session toward the history panel. Simultaneously, the session object is written to `localStorage`.
*PRD ref: `prd.md > Session Save — Paper Throw Animation`*

### Chat History Panel
Reads from `localStorage` on load. Lists sessions (date + one-line summary) newest first. Clicking a session opens the full conversation view. Empty state: "No sessions yet — tap the mic to get started."
*PRD ref: `prd.md > Chat History`*

### PDF Export
Uses `html2pdf.js` (loaded from CDN). When "Export PDF" is clicked on a session, it converts the session's HTML conversation view into a downloadable PDF.
*PRD ref: `prd.md > Export / PDF`*

### Settings / Theme Toggle
A toggle button in the top bar. Switches `data-theme` attribute on `<body>` between `light` and `dark`. Saves preference to `localStorage`. Applied on page load.
*PRD ref: `prd.md > Settings`*

### Skeleton Screens
CSS-only placeholder layouts for each page. Shown while JavaScript initialises each view. Grey rectangular blocks that mirror the actual layout.
*PRD ref: `prd.md > States and Boundaries > Slow network / loading`*

---

## Data Model

Everything lives in `localStorage` (the browser's built-in storage). Think of it like a set of labelled sticky notes the browser keeps for this app.

| Key | What it stores | When updated |
|---|---|---|
| `medisense_user` | `{ username: "..." }` | Set on login |
| `medisense_theme` | `"light"` or `"dark"` | Set when theme is toggled |
| `medisense_tutorial_seen` | `true` | Set when tutorial is completed or skipped |
| `medisense_sessions` | Array of session objects (see below) | Appended when a session is saved |

**Session object shape:**
```json
{
  "id": "unique-id",
  "date": "2026-10-26T02:30:00",
  "summary": "Sweating and feeling unwell",
  "outcome": "see-doctor",
  "messages": [
    { "role": "user", "text": "I've been sweating a lot..." },
    { "role": "assistant", "text": "Could you tell me more..." }
  ]
}
```

---

## File Structure

```
medisense/
├── index.html              # Main HTML file — all pages live here as sections
├── config.js               # API key (in .gitignore — never committed)
├── style.css               # All styles: Mondrian grid, themes, animations
├── main.js                 # App entry point — routes between screens
├── gemini.js               # Gemini API calls and conversation logic
├── voice.js                # Web Speech API wrapper
├── storage.js              # localStorage read/write helpers
├── tutorial.js             # Tutorial overlay and cursor animation
├── history.js              # Chat history panel and PDF export
├── open.mp3                # Short opening sound
├── .gitignore              # Includes config.js and any .env files
├── devpost/                # Planning docs (learner profile, scope, prd, spec)
└── README.md               # How to run the app and get the API key
```

---

## External Services and Dependencies

### Google Gemini API
- **Endpoint:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_KEY`
- **Payload:** `{ "contents": [{ "role": "user", "parts": [{ "text": "..." }] }] }`
- **Response:** `response.candidates[0].content.parts[0].text`
- **Auth:** API key as a URL query parameter
- **Free tier:** As of writing, 15 requests/minute, 1 million tokens/day on the free tier. ⚠️ *Verify at setup: [https://ai.google.dev/pricing](https://ai.google.dev/pricing)*
- **Docs:** [https://ai.google.dev/api/generate-content](https://ai.google.dev/api/generate-content)

### Web Speech API
- **Built into Chrome** — no account or key needed
- **Docs:** [https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- **Limitation:** Chrome only for full support

### html2pdf.js
- **Loaded via CDN:** `<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>`
- **Docs:** [https://github.com/eKoopmans/html2pdf.js](https://github.com/eKoopmans/html2pdf.js)
- **Cost:** Free

---

## Important Failure Modes

- **Gemini API key missing or wrong** → app shows: "MediSense can't reach its AI brain right now. Check your API key in `config.js` and reload." No crash, no blank screen.
- **Microphone not available or permission denied** → app shows: "I couldn't access your microphone. Try typing below instead." Text fallback is always visible.
- **Gemini API rate limit hit or network is offline** → Gemini module catches the error and returns: "I'm having trouble connecting right now. Please try again in a moment, or type your symptoms below."

---

## What Was Simplified and Why

- **No password on login** — a username stored in localStorage is enough to personalise the experience for a single-user local PoC. A real login system would need a backend server, password hashing, and sessions — none of which prove the healthcare triage idea.
- **API key in `config.js` (not a backend proxy)** — a production app would route Gemini calls through a backend server so the API key is never exposed in the browser. For a local PoC demo, a local config file is safe enough and avoids the need to set up a server.
- **localStorage instead of a database** — a database (like SQLite or Postgres) would let you search, filter, and query sessions. localStorage is sufficient for listing and reading sessions in a single-user local app.
- **"Paper throw" is a CSS animation, not physics** — a real physics simulation would be more dramatic but is much harder to build. A CSS transition that moves the session element toward the history panel is indistinguishable for demo purposes.

---

## Decisions and Open Issues

**Decisions made:**
- **Google Gemini (`gemini-1.5-flash`) for AI triage** — free tier, capable enough for symptom triage, learner agreed. Tradeoff: requires a free account and API key setup before the app works.
- **Plain HTML/CSS/JS (no framework)** — no build tools, no install step, opens directly in Chrome. Tradeoff: more manual DOM management, but the right size for this PoC and easiest for a first-time learner to read.
- **localStorage for all data** — no backend, no database, no setup. Tradeoff: data lives only on this laptop and browser; switching browsers loses history.
- **Chrome only for voice input** — Web Speech API has the broadest support in Chrome. The text fallback covers other browsers.

**Learner uncertainty noted:** How the Gemini API "knows" what to ask — i.e. how a system prompt tells the AI to behave in a specific way. This will be demonstrated concretely in `5-build` when `gemini.js` is written: the learner will see the system prompt text and can read exactly what instructions shape the AI's responses.

**Open issues carried from PRD:**
- **Tutorial skip behaviour** — if skipped mid-tutorial, the `tutorialSeen` flag is set immediately so it never shows again. (Resolved: simpler is better for a PoC.)
- **PDF formatting** — the export will use the session's existing HTML conversation view, styled to be clean on paper. Exact formatting to be confirmed during `5-build` when the session view is built.
