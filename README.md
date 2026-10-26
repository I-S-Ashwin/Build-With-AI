# 🏥 MediSense — Personal Healthcare Triage Assistant

> **A Broadway Boogie-Woogie & Piet Mondrian inspired, offline-first personal healthcare triage web app that listens to your symptoms, guides your care decisions, and keeps your health data entirely private.**

Built for the **Build With AI: Basics** Devpost Hackathon.

---

## 🎨 The Aesthetic & Vision

Most health applications look like sterile, clinical spreadsheets or induce unnecessary panic with alarming red warning banners. **MediSense** transforms personal triage into a structured, vibrant, and empowering journey inspired by **Piet Mondrian** (*Composition with Red, Yellow, and Blue*, 1921) and the dynamic urban rhythm of ***Broadway Boogie-Woogie*** (1942–43).

- **Bold Neo-Brutalist Layout**: Black structural borders, high-contrast primary accents, and tactile pop-art drop shadows.
- **Kinetic Rhythm & Audio**: Tactile Web Audio chimes, flying paper-throw consultation archiving, and animated tab baselines.
- **Neon Day & Night Modes**: Seamless high-contrast Light mode and cyberpunk-inspired Dark mode.

---

## ✨ Key Features & Capabilities

### 1. 🤖 Offline Clinical NLP & Dual-Engine Triage
- **100% Offline Clinical Knowledge Base**: Powered by an embedded 116-disease clinical dataset with curated primary symptoms, secondary red flags, home treatments, and referral guidelines.
- **Local Clinical Heuristics**: Immediate triage evaluation with zero network requests or API costs.
- **Optional Generative AI**: Seamless integration with **Google Gemini 1.5 Flash** for deep conversational triage when an API key is connected.
- **Confidence Scoring & Risk Index**: Visual clinical confidence indicators and a real-time 4-tier Health Risk Index (Low, Guarded, Moderate, Severe).

### 2. 🎙️ Voice-First & Text Triage
- **Live Voice Dictation**: Powered by the browser's native Web Speech API with real-time word streaming and an animated vinyl mic orbit indicator.
- **Symptom Quick Chips**: Instant one-click symptom suggestions (`Fever`, `Dry Cough`, `Migraine`, `Fatigue`, `Sprain`, etc.) to jumpstart consultations.
- **Cinematic Diagnosis Reveal**: Full-screen diagnostic breakdown with color-coded severity bars (Home Care vs. Clinical Referral).

### 3. 📋 10-in-1 Clinical & Wellness Suite
1. **Interactive Drug Interaction Checker**: Analyze dangerous drug-drug combinations across common pharmaceuticals with instant clinical warning dialogs.
2. **Symptom Recurrence History**: Compare current complaints against past archived episodes to detect chronic patterns.
3. **Doctor Intake Note Printer**: Generate and print clean, standard SOAP (Subjective, Objective, Assessment, Plan) clinical intake notes for doctor visits.
4. **ICE Medical Wallet Card**: Format, display, and print an emergency wallet card featuring blood type, allergies, conditions, and emergency contact numbers.
5. **CPR Metronome**: Interactive audio/visual 100-120 BPM metronome calibrated to standard resuscitation rhythms (e.g. *"Stayin' Alive"*).
6. **Dynamic BMI & Metric Calculator**: Real-time Body Mass Index calculation with color-coded health categorization.
7. **Interactive Medication Schedule**: Time trays (Morning, Afternoon, Evening, Bedtime) with adherence tracking and refill threshold alerts.
8. **116-Condition Medical Encyclopedia**: Instant search, disease categorization, red flag warnings, and persistent bookmarking.
9. **Weekly Wellness Heatmap**: GitHub-style activity grid tracking check-in frequency and perceived energy levels.
10. **Session PDF Generator**: Export formatted, publication-ready clinical summaries to PDF via `html2pdf.js`.

---

## ⚡ Keyboard Shortcuts

Navigate MediSense effortlessly using single-key shortcuts:

| Key | Action |
|:---:|:---|
| <kbd>T</kbd> | Jump to **Triage Chat** |
| <kbd>E</kbd> | Open **Medical Encyclopedia** |
| <kbd>P</kbd> | Open **Patient Profile** |
| <kbd>M</kbd> | Open **Medication Log** |
| <kbd>A</kbd> | Open **Health Analytics** |
| <kbd>R</kbd> | Open **Emergency & ICE Guide** |
| <kbd>S</kbd> | Open **Settings & Gemini API** |
| <kbd>?</kbd> | Toggle **Keyboard Shortcuts Help Modal** |
| <kbd>Esc</kbd> | Dismiss any active modal or consultation view |

---

## 🚀 Getting Started

MediSense is engineered with **zero external dependencies** and requires **zero build steps** (no `npm install`, no compilation).

### Quick Start (Local Server)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/Build_With_AI_Basics.git
   cd Build_With_AI_Basics
   ```

2. **Start the local HTTP server:**
   - **Using Node.js:**
     ```bash
     node server.js
     ```
   - **Using Python 3:**
     ```bash
     python -m http.server 3000
     ```

3. **Open in your browser:**
   ```
   http://localhost:3000
   ```

4. **⚡ Try Demo Mode:**
   Click the **⚡ Try Demo** button on the opening screen to auto-populate the application with realistic clinical profile data, medications, and sample consultations.

---

## 📁 Project Structure

```
Build_With_AI_Basics/
├── index.html            # Main application shell, Mondrian grid, modals, and views
├── style.css             # Broadway Boogie-Woogie design system, themes, and animations
├── main.js               # Application coordinator, routing, triage loop, and sound effects
├── pages.js              # Multi-page system: Profile, Encyclopedia, Analytics, Meds, ICE
├── clinical-nlp.js       # Offline clinical heuristics, symptom extraction & risk scoring
├── knowledge-base.js     # 116-condition medical encyclopedia and treatment protocols
├── history.js            # History bin, paper-throw animation, and PDF export engine
├── storage.js            # LocalStorage data persistence layer
├── voice.js              # Web Speech API speech-to-text integration
├── tutorial.js           # First-time onboarding interactive cursor tour
├── gemini.js             # Optional Google Gemini 1.5 Flash generative AI bridge
├── server.js             # Lightweight zero-dependency local Node.js static server
├── devpost/              # Hackathon documentation: scope, PRD, spec, and checklist
└── README.md             # Project documentation and guide
```

---

## 🔒 Privacy & Medical Disclaimer

- **100% Client-Side Privacy**: All personal health records, triage chats, medications, and profile details reside exclusively in your browser's `localStorage`. No data is ever transmitted to remote tracking servers.
- **Medical Disclaimer**: MediSense is an assistive personal triage guidance tool and educational project. It is **not** a certified medical diagnostic device. In cases of acute pain, shortness of breath, severe trauma, or life-threatening emergencies, always call emergency services (911 / 112) or seek prompt clinical care.

---

## 📜 License

Created under the MIT License for the **Build With AI: Basics** Hackathon.
