---
doc: scope
status: approved
---

# MediSense — Personal Healthcare Triage Chatbot

A Mondrian-inspired, voice-first chatbot that listens to your symptoms and tells you whether to treat it at home or see a doctor — no appointment needed.

## The Unique Kernel

Most health apps either panic you or ignore you. MediSense acts like a calm, knowledgeable friend: it asks smart follow-up questions, gives you a real suggestion for minor things (a cold, a scratch), and says clearly "go see a doctor" when it doesn't know or when something sounds serious. The Mondrian art aesthetic gives it a personality no other health tool has — bold, structured, and unmistakably yours.

## Who It's For

Someone like you — active, community-oriented, busy — who gets a familiar cold once or twice a month and doesn't want to waste a half-day at a clinic to hear "drink water and rest." Today they either Google symptoms (and get scared) or just tough it out. MediSense gives them a quick, honest second opinion they can actually trust for the routine stuff.

## The Core Loop

You open the app → tap the recording button at the bottom center → describe what's wrong in your own words → the app asks one or two follow-up questions to understand better → it gives you either a clear home remedy suggestion or a direct "this sounds serious, please see a doctor." You come back every time something feels off, because it's faster than Googling and calmer than panicking.

## Inspiration & Identity

- **Aesthetic anchor:** Piet Mondrian — specifically *Composition in Red, Yellow, Blue and Black* (1921) for color palette; *Composition No. 10, Pier and Ocean* (1915) for the underlying grid rhythm; and *Broadway Boogie-Woogie* (1942–43) for the sense of musical energy and movement.
- **Mood:** Modernistic, futuristic, structured but alive. Clean gradients. Not overwhelming — bold without being loud.
- **Opening:** A brief cinematic intro (like the Netflix animation) using the Mondrian palette before landing on the preview page. Gets you *into* the experience.
- **Light and dark themes** with clean gradients throughout.
- **Q&A style:** "Wanderer" — the follow-up questions feel like a guided exploration, not a form. Conversational and philosophical rather than a checkbox list.
- **Platform:** Laptop-first. No mobile constraints — the layout can breathe and use the full screen.

## Why This Matters to the Learner

"If I get a cold — which I get once or twice a month — I'd like to consult the chatbot rather than go to a doctor. Or if I get a mild scratch, I don't have to head to a doctor to solve it. I can even save some money in the meantime." This is a tool built for their own life, and for the neighbors, friends, and community members around them.

## What "Working" Looks Like

The demo opens on the cinematic landing page → logs into a simple local account → navigates to the main chat interface → taps the recording button at the bottom center → speaks a symptom ("I've been sweating a lot and feeling really unwell") → the app transcribes it, asks a follow-up question, and returns either a calm home-remedy suggestion or a clear "this sounds serious — please see a doctor." That response landing is the "oh, that works" moment.

## The POC Boundary

- **Landing/preview page** with Mondrian-palette opening animation
- **Simple local login** (username stored locally — no backend server needed)
- **Chat interface** with a voice recording button (bottom center) + text fallback
- **AI-powered symptom triage**: describes symptoms → follow-up question → remedy suggestion OR "see a doctor" response
- **Light/dark theme toggle**
- **Local chat history** (stored in the browser, no external database)
- **Laptop-first layout** — no mobile-responsive constraints

## Later

- Heatmap showing how often and when you've checked in
- Import/export of your chat history
- Energy/task tagging on sessions
- Resources and guidelines section (links to verified health info)
- Map/art style dashboard layout with multiple panels

## Explicitly Cut

- **Real doctor notification/alert system** — adds significant complexity (accounts, notifications, HIPAA-adjacent concerns) and isn't needed to prove the core idea works. The app itself handles triage.
- **Mobile/responsive design** — you said laptop-first; designing for both at the PoC stage would split the aesthetic focus.
- **Automated tests** — not needed for a proof of concept demonstration.
