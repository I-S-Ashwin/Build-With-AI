---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Mondrian shell, opening animation, preview, and login**
  Becomes usable: A running web app with the 2-second Mondrian drop intro, landing preview page, username login stored locally, and the full Mondrian grid layout with a working light/dark theme toggle.
  Why now: Scaffolds the app structure, styling variables, and navigation early so every subsequent feature has a screen to live in.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Features and Behavior > Opening and Onboarding`, `prd.md > Features and Behavior > Login`, `prd.md > Settings`
  Spec ref: `spec.md > Components > Opening Animation`, `spec.md > Components > Preview / Landing Page`, `spec.md > Components > Login`, `spec.md > Components > Settings / Theme Toggle`, `spec.md > Look and Feel`, `spec.md > File Structure`
  Build: Scaffold `index.html`, `style.css`, `main.js`, `storage.js`, and synthesize a clean audio chime with Web Audio API. Implement Mondrian grid, drop animation, preview page, username entry saved to localStorage, and light/dark theme toggle.
  Verify (mechanical): Verify page loads in a local HTTP server with zero JavaScript console errors; verify localStorage receives username and theme changes.
  Learner check: Open the app in Chrome, watch the opening animation, enter your name to log in, and click the theme toggle to test light and dark mode.
  Commit: `Add Mondrian shell, opening animation, preview, and login`

- [x] **2. Interactive triage conversation & Google Gemini AI integration**
  Becomes usable: Type symptoms into the chat, receive one wanderer follow-up question at a time from Gemini AI, and get a clear home-remedy suggestion or "see a doctor" referral.
  Why now: Risk and kernel first. Proves the core AI triage conversation works before adding voice and complex animations.
  PRD ref: `prd.md > Features and Behavior > Triage Conversation`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Gemini Service (JavaScript module)`, `spec.md > Components > Text Fallback Input`, `spec.md > Important Failure Modes`, `spec.md > External Services and Dependencies`
  Build: Create `config.js` and `gemini.js`. Wire the chat text input to the Gemini 1.5 Flash endpoint with the triage system prompt. Include helpful error feedback if the API key is not configured.
  Verify (mechanical): Test API payload formatting and verify simulated or live Gemini responses return and render properly in the chat log.
  Learner check: Type symptoms like "I have a headache and sore throat" into the chat, answer the follow-up question, and see the advice MediSense gives you.
  Commit: `Implement Gemini AI symptom triage chat engine`

- [ ] **3. Voice recording input (Web Speech API) & full-screen cinematic response**
  Becomes usable: Tap the microphone button at the bottom center to speak your symptoms with real-time live transcription, and see the final medical suggestion displayed in full-screen cinematic presentation.
  Why now: Delivers the signature voice-first interaction and dramatic diagnosis presentation specified in your scope and PRD.
  PRD ref: `prd.md > Features and Behavior > Triage Conversation`, `prd.md > Features and Behavior > Full-Screen Response`
  Spec ref: `spec.md > Components > Recording Button and Voice Input`, `spec.md > Components > Full-Screen Response`
  Build: Create `voice.js` wrapping the browser's Web Speech API. Connect the mic button to live speech recognition. Implement the full-screen overlay for final responses with dismiss action.
  Verify (mechanical): Verify speech recognition events fire and feed transcribed text into the chat flow; verify full-screen modal displays correctly when triggered.
  Learner check: Click the mic button, speak a sentence, watch the words appear on screen, and see the full-screen response appear when triage finishes.
  Commit: `Add voice recognition and full-screen response reveal`

- [ ] **4. Paper-throw save animation, chat history bin, and PDF export**
  Becomes usable: Dismissing a triage response animates the session into the history bin, stores the session in localStorage, lets you browse past conversations, and exports any session as a formatted PDF.
  Why now: Closes the session lifecycle and delivers the user's requirement to save and review past colds and scratches.
  PRD ref: `prd.md > Features and Behavior > Session Save — Paper Throw Animation`, `prd.md > Features and Behavior > Chat History`, `prd.md > Features and Behavior > Export / PDF`
  Spec ref: `spec.md > Components > Paper-Throw Animation and Session Save`, `spec.md > Components > Chat History Panel`, `spec.md > Components > PDF Export`, `spec.md > Data Model`
  Build: Create `history.js`. Implement the paper-throw CSS animation, save session history to localStorage, populate the sidebar history bin, and integrate `html2pdf.js` for instant PDF download.
  Verify (mechanical): Verify session object structure in localStorage, test history rendering on reload, and verify PDF generation trigger without errors.
  Learner check: Finish a chat, watch it animate into the history bin, click it to re-open past conversations, and click the Export PDF button.
  Commit: `Add paper-throw save animation, history bin, and PDF export`

- [ ] **5. First-time animated cursor tutorial & skeleton loading screens**
  Becomes usable: An animated cursor overlay tours the user through the interface on their first visit, and skeleton preview placeholders display during screen transitions.
  Why now: Completes the final onboarding and polish details agreed in the PRD.
  PRD ref: `prd.md > Features and Behavior > Opening and Onboarding > First-time tutorial`, `prd.md > States and Boundaries > Slow network / loading`
  Spec ref: `spec.md > Components > Tutorial Overlay`, `spec.md > Components > Skeleton Screens`
  Build: Create `tutorial.js`. Build the guided cursor animation pointing to theme toggle, history bin, and PDF export with a skip button. Add CSS skeleton loading templates.
  Verify (mechanical): Verify tutorial plays once, sets `medisense_tutorial_seen` in localStorage, skippable at any time, and does not show on subsequent reloads.
  Learner check: Clear browser data or use incognito, log in, watch the animated cursor tour, and verify the skip button works.
  Commit: `Add animated cursor tutorial and skeleton loaders`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — Slice 2 (Testing the core Gemini triage chat loop)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: 
Route and stops: 
Edit outcome: 
Reflection: 
Activity mode: 

## Revisions

