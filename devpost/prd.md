---
doc: prd
status: approved
---

# MediSense — Product Requirements

A Mondrian-inspired, voice-first personal healthcare triage chatbot for laptop, that listens to your symptoms, asks smart follow-up questions, and tells you whether to treat it at home or see a doctor.
Source: `scope.md > The Core Loop`, `scope.md > The Unique Kernel`

---

## The Core Journey

1. **Opening** — User launches MediSense. A 2-second cinematic "drop" animation plays in the Mondrian palette, revealing the logo and app name with a short sound effect. The animation resolves into the preview/landing page.
2. **Preview page** — A landing screen visible before login. The user can see what MediSense offers. A "Log In" button is present.
3. **Login** — User enters their username and logs in. Credentials are stored locally.
4. **First-time tutorial** — On first login only, a short guided overlay tutorial plays. An animated cursor demonstrates: where to change light/dark mode, where past chat sessions live, and how to export a session as PDF. The cursor moves to each element and simulates a click to show its purpose.
5. **Main screen** — After login (and tutorial, if first time), the user lands on the main chat interface. All key features are visible on screen. A recording button sits at the bottom center.
6. **Start a session** — User taps the recording button and speaks their symptoms, or types in a text fallback field.
7. **Triage conversation** — MediSense asks follow-up questions one at a time — first open-ended ("Could you tell me more?"), then specific to the symptom. The exchange continues until the app has enough to respond.
8. **Full-screen response** — When ready, MediSense displays its short diagnosis or recommendation in a large, cinematic, full-screen format — readable and clear, not a small card. If it knows: a calm home-remedy suggestion. If it's unsure or it sounds serious: a clear "please see a doctor."
9. **Session saved** — When the conversation ends, it animates like paper being thrown into a bin and is saved to the chat history.
10. **Chat history** — All past sessions live in a chat bin. The user can review them, or export/print as PDF.

---

## Screens and Layout

Source: `scope.md > The POC Boundary`, `scope.md > Inspiration & Identity`

### 1. Opening Animation Screen
- Full-screen, 2 seconds.
- A "drop" motion reveals the MediSense logo and name.
- A short, pleasant sound plays.
- Transitions automatically to the preview page.

### 2. Preview / Landing Page
- Visible before login.
- Shows the app name, a short description of what it does, and a Log In button.
- Mondrian palette and grid layout — bold, clean, uncluttered.

### 3. Login Screen
- Simple username entry.
- No password required for the PoC (local-only, single user).
- Transitions to the main screen on submit.

### 4. Main Chat Interface
- All features accessible from this screen.
- **Bottom center:** Recording button (microphone icon). Text fallback field nearby.
- **Sidebar or panel:** Chat history bin — past sessions listed, paper-throw animation destination.
- **Top bar / settings area:** Light/dark toggle, export/PDF option, app name.
- Layout uses Mondrian-style grid — structured sections divided by bold lines and primary color accents.

### 5. Triage Conversation View
- As the conversation happens, questions and answers appear in the main area.
- Questions from MediSense appear in a "wanderer" style — one at a time, flowing and conversational, not a bullet list.
- User can respond by voice (recording button) or text.

### 6. Full-Screen Response
- When MediSense delivers its diagnosis or recommendation, it fills the screen.
- Large, readable text — cinematic presentation.
- Either: a short home-remedy suggestion, or a calm "this sounds serious / I'm not certain — please see a doctor."
- A dismiss or "save session" action closes this view and triggers the paper-throw animation.

### 7. Chat History / Chat Bin
- List of all past triage sessions, ordered by date.
- Each entry shows the date, a short summary line (e.g. "Cold symptoms — home remedy suggested").
- Tapping a session shows the full conversation.
- Export/print to PDF available per session.

---

## Look and Feel

Source: `scope.md > Inspiration & Identity`

- **Color palette:** Mondrian's *Composition in Red, Yellow, Blue and Black* — bold primary blocks (red, yellow, blue, black) on white/off-white. Used structurally, not decoratively — dividing the grid, framing panels.
- **Grid rhythm:** Inspired by *Composition No. 10, Pier and Ocean* — the layout breathes; sections are delineated by bold black lines in a grid pattern.
- **Energy:** *Broadway Boogie-Woogie* — alive, rhythmic, not static. Subtle motion and transitions carry this energy.
- **Gradients:** Clean, minimal gradients allowed within sections. Not cluttered.
- **Light and dark themes:** Both fully supported. Toggle visible at all times.
- **Typography:** Bold, modern, legible. Feels architectural, not playful.
- **Tone:** Calm, confident, trustworthy — like a knowledgeable friend, not a clinical tool.
- **Motion:** Cinematic but fast. Opening drop (2s), paper-throw save animation, full-screen response reveal. Nothing slow or indulgent.
- **Sound:** A single short, pleasant sound on app open. No other sounds unless the user is recording.
- **Loading screens:** When transitioning between screens on slow connections, a skeleton template (a greyed-out preview of the next screen's layout) appears so the user knows what's coming.

---

## Features and Behavior

### Opening and Onboarding

- **Cinematic intro:** 2-second drop animation with logo + sound. Plays every time the app opens.
- **Skeleton loading:** On any slow page transition, a skeleton preview of the destination screen is shown rather than a blank screen or spinner.
- **First-time tutorial:** On first login, an animated cursor walks through the UI — showing the settings toggle, the chat history, and the PDF export. The cursor moves to each element and simulates interaction. Skippable after any step.

### Login

- Username entry on a clean login screen.
- Stored locally — no server, no password for the PoC.
- Acceptance criterion: Entering a username and clicking "Log In" transitions to the main screen. The username persists when the app is closed and reopened.

### Triage Conversation

- User starts a session with the recording button (bottom center) or by typing.
- **Voice input:** Browser microphone captures voice; transcription appears on screen in real time.
- **Text fallback:** A text field is always available if the user prefers not to use voice.
- MediSense responds with one question at a time — never a list of questions at once.
- First follow-up is always open: "Could you tell me more about how you're feeling?"
- Subsequent questions are symptom-specific (e.g. "How long have you had this? Do you have a fever?").
- Acceptance criterion: Speaking or typing a symptom triggers at least one follow-up question before a response is given.

### Full-Screen Response

- After enough context, MediSense delivers its response in full-screen cinematic format.
- **Known/minor issue:** Short, calm home-remedy suggestion (e.g. "This sounds like a common cold. Rest, stay hydrated, and take a paracetamol if needed.").
- **Serious or unclear:** "This sounds serious — please see a doctor right away" or "I'm not certain what's happening. Please consult a doctor to be safe."
- Text is large and readable — not a card, not a chat bubble.
- Acceptance criterion: A described symptom always results in either a home-remedy suggestion or a doctor referral — never a blank or error state.

### Session Save — Paper Throw Animation

- When the user dismisses the full-screen response, the session animates like paper being thrown into the chat bin.
- The session appears in the chat history list immediately after.
- Acceptance criterion: After dismissing a response, the session is visible in chat history with the correct date and a short summary.

### Chat History

- All past sessions listed in the chat bin, newest first.
- Each entry shows: date, one-line symptom summary, outcome (home remedy / see doctor).
- Clicking a session opens the full conversation.
- Acceptance criterion: A previous session opened from history shows the complete exchange.

### Export / PDF

- Any session in the chat history can be exported as a formatted PDF.
- Acceptance criterion: Clicking export on a session produces a downloadable PDF with the full conversation.

### Settings

- Light/dark theme toggle — accessible from the main screen at all times.
- Acceptance criterion: Toggling the theme changes the app's palette immediately, and the preference persists on reload.

---

## States and Boundaries

- **First use (no history):** Chat bin is empty. A friendly prompt appears: "No sessions yet — tap the mic to get started." No error state.
- **Voice not captured:** If the microphone doesn't detect input after a timeout, MediSense shows a short message: "I didn't catch that — try again or type below." Falls back to text input.
- **AI can't determine a diagnosis:** Always responds with the "please see a doctor" message — never silent, never blank.
- **Session in progress:** Recording button is active/highlighted. No new session can be started mid-conversation.
- **Slow network / loading:** Skeleton screen shows the layout of the destination page while content loads.
- **Persistence:** Chat history and username survive closing and reopening the app (stored locally in the browser).

---

## Product Decisions

- **App name: MediSense** — the name the learner confirmed from the scope.
- **No password for login** — single-user, local-only PoC; a username is enough to personalise the experience.
- **Laptop-first layout** — no mobile responsive constraints, so the Mondrian grid can use the full screen properly.
- **No real doctor on the other end** — the app itself handles triage; "see a doctor" is the safety valve, not a live notification.
- **Wanderer Q&A style** — questions appear one at a time, conversationally, never as a bullet list. Feels exploratory, not clinical.
- **Full-screen response, not a card** — makes the moment of diagnosis feel significant and readable, not buried in a chat thread.
- **Paper-throw animation to save** — gives the session a satisfying, physical end before archiving.

---

## What We're Building

- Cinematic opening animation (2s, drop, sound, Mondrian palette)
- Skeleton loading screens for slow transitions
- Preview / landing page
- Local username login with persistence
- First-time animated cursor tutorial (settings, history, export)
- Main chat interface with Mondrian grid layout
- Voice recording input (bottom center) with real-time transcription
- Text fallback input
- Wanderer-style triage conversation (one question at a time)
- Full-screen cinematic response display
- Paper-throw animation to save session
- Chat history bin with session list
- Full conversation view per session
- Export session to PDF
- Light/dark theme toggle with persistence

---

## Deferred From the POC

- **Heatmap of activity** — useful health insight, but not needed to prove the core triage loop.
- **Energy/task tagging on sessions** — adds value over time, not for a first demo.
- **Resources and guidelines section** — verified health links are a good addition later; out of scope for PoC.
- **Multi-panel dashboard/map layout** — the Mondrian grid can evolve into this; not needed for v1.
- **Real doctor notification/alert system** — significant complexity; the "see a doctor" message is the PoC's safety layer.

---

## Non-Goals

- **Mobile / responsive design** — laptop-first; mobile layout would compromise the Mondrian grid aesthetic.
- **Real medical diagnosis** — MediSense gives suggestions and referrals, never a clinical diagnosis.
- **Multi-user accounts** — single user, local only.
- **Automated tests** — not needed for a PoC demo.
- **External database or backend server** — everything is stored locally in the browser.

---

## Open Questions

- **Which AI service powers the triage?** This is a `4-spec` question — the PRD doesn't decide it. The spec will recommend an option and explain the tradeoff.
- **Tutorial skip behaviour** — if the user skips mid-tutorial, does it restart next login or never show again? *Can wait until `4-spec` or early `5-build`.*
- **PDF formatting** — what does the exported PDF look like? Covered in `5-build` when the feature is reached.
