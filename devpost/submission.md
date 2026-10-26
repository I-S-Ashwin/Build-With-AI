# 📝 Devpost Submission Guide & Checklist

This document helps you review and prepare your final submission for the **Build With AI: Basics** Hackathon.

---

## 📌 Submission Requirements Checklist

- [ ] **Short Demo Video Link**: A video demonstrating the working proof of concept (e.g. YouTube unlisted, Loom, Vimeo, or Google Drive public link).
  - *Must show*: The opening screen / Try Demo, voice or text triage consultation, follow-up advice, and browsing saved sessions in the Chat Bin.
- [ ] **Public GitHub Repository Link**: Your project repository URL containing the source code and documentation.
- [ ] **Project Name**: `MediSense — Personal Healthcare Triage Assistant`
- [ ] **Short Tagline / Pitch**: A one-line summary of what you built.
- [ ] **Submission Story & Form Fields**: Complete the submission questions in your own words on the Devpost form.
- [ ] **Exit Survey**: Completed by you on Devpost.

---

## 💡 Project Reference Notes for Your Submission Form

Use these factual notes about your project when writing your own submission copy:

### 1. Inspiration
- Built to solve the real everyday dilemma of routine colds, headaches, and scratches — saving unnecessary clinic visits and avoiding fear-inducing web searches.
- Blends healthcare triage with the bold artistic vision of Piet Mondrian (*Composition in Red, Yellow, Blue and Black*, 1921) and the musical urban movement of *Broadway Boogie-Woogie* (1942–43).

### 2. What it Does
- Listens to symptom descriptions via live voice dictation (Web Speech API) or text.
- Provides immediate triage recommendations (self-care protocol vs. clinical referral) backed by an offline 116-disease medical encyclopedia.
- Features a complete 10-in-1 clinical suite: Drug Interaction Checker, Doctor Intake Note (SOAP format printing), Emergency ICE Wallet Card printing, CPR Metronome (100–120 BPM), Medication Schedule Trays, and Weekly Wellness Heatmap.
- Offers multi-way session management: Consultation Chat Bin, formatted PDF generation, and full keyboard navigation.

### 3. How We Built It
- **Frontend Core**: Vanilla HTML5, CSS3 with custom variables for Light/Dark Neo-Brutalist themes, and ES6 JavaScript modules.
- **Audio & Voice**: Web Audio API (tactile synthesized clicks & chimes), Web Speech API (real-time voice streaming).
- **Clinical Engine**: Curated offline medical knowledge base of 116 conditions + local NLP symptom match heuristics, with an optional Google Gemini 1.5 Flash API connector.
- **Data & Export**: Zero-backend local storage (`localStorage`) and client-side PDF compilation via `html2pdf.js`.

### 4. Challenges Faced & Solved
- Balancing high-density artistic Neo-Brutalist aesthetics with clean, legible clinical interfaces.
- Ensuring 100% offline functionality without sacrificing intelligent triage accuracy or diagnostic depth.
- Engineering robust modal height clamping and sticky navigation for complex consultation transcripts.
- Perfecting clean print stylesheets for standard clinical intake notes and emergency wallet cards.

### 5. Accomplishments
- Zero runtime dependencies — loads instantly on any modern browser.
- Complete privacy protection — zero patient data leaves the local machine.
- Cohesive interactive experience with tactile audio feedback and animations.

---

## 🔗 Links to Record

- **GitHub Repository**: 
- **Demo Video URL**: 
- **Live Demo (Optional)**: http://localhost:3000
