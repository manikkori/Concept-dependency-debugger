# Concept Dependency Debugger (CDD)

> Most tests tell you what you got wrong. CDD tells you why — tracing failures through a concept dependency graph to find the true root cause.

Built for **OpenAI Build Week** (Education track) using **Codex** and **GPT-5.6**.

**Live demo:** [cdd-openai.vercel.app]

---

## The Problem

Traditional tests score every topic independently. If a student fails a question on Graphs, the obvious advice is "study Graphs more." But knowledge isn't independent — concepts build on each other in a dependency chain (e.g. `Arrays → Linked Lists → Stacks & Queues → Trees → Graphs`). The real gap is often two or three concepts upstream, quietly breaking everything built on top of it. No standard quiz traces that back.

## What CDD Does

CDD models a subject as a **concept dependency graph** and runs a student's quiz results through a **propagation engine** that traces weaknesses upstream instead of scoring each topic in isolation.

- If a student scores well on a downstream topic but the prerequisite underneath it is weak, CDD does **not** take that score at face value — it flags it as unreliable and traces back to the true root cause.
- The root cause is visually distinguished on a live dependency graph from its downstream, cascading effects.
- A **"Show the math" transparency panel** exposes the exact raw-vs-adjusted score and the reasoning behind every adjustment — the diagnosis is fully explainable, not a black box.
- GPT-5.6 converts the structured diagnosis into a clear, encouraging explanation with a concrete next step.

Currently covers six subjects: **Data Structures, Math, DBMS, Computer Networks, OOP, and Web Development.**

---

## How Codex Was Used

Codex was used throughout implementation to iterate directly on the existing codebase, working across both frontend and backend to keep changes consistent. Specific contributions include:

- Implementing the **root-cause visualization system** — distinguishing the root-cause node (thick border + badge) from downstream affected nodes (dashed border + label) on the React Flow dependency graph
- Fixing the **borderline scoring tier**, which was mathematically unreachable at the original thresholds given a 2-questions-per-concept design, and realigning it to the actual achievable score values
- Building the **"Show the math" transparency panel** — a per-concept raw-vs-adjusted score breakdown with reasoning
- Extending the propagation engine to **two additional subject chains** (OOP Concepts, Web Dev Basics), each with a full 10-question bank matching the existing schema
- Redesigning the **landing page** — new typography system, color tokens tied to the app's own diagnostic color language, and a signature animated dependency-graph preview in the hero section
- Implementing a **consistent dark/light theme system** across the entire app (landing page + in-app pages), while keeping the graph's functional status colors (strong/borderline/weak) intentionally independent of the general theme tokens
- Fixing a **dark-mode visibility regression** where graph node status colors were incorrectly overridden by global theme tokens
- Building a dedicated **"all concepts mastered" success state**, replacing a broken fallback that reused warning-style UI for a positive outcome
- Migrating the diagnosis API integration to use **OpenAI's GPT-5.6** directly
- Generating and refining this README

## How GPT-5.6 Is Used

GPT-5.6 sits specifically at the **explanation layer** of the product — it does not determine the diagnosis itself. Root-cause identification is handled by a deterministic propagation engine (see below), which guarantees the diagnosis is consistent, traceable, and explainable rather than dependent on a language model's reasoning.

Once the propagation engine identifies the root weak concept and computes adjusted scores, GPT-5.6 (`gpt-5.6-luna`) receives the structured result — the concept dependency chain, per-concept raw/adjusted scores, and the identified root cause — and generates:

1. **Diagnosis** — a plain-English statement of the student's actual weak point
2. **Why It Matters** — why this specific gap causes downstream failures
3. **Next Step** — one concrete, actionable recommendation

This separation is intentional: the *what* (root cause) is deterministic and auditable; the *how to explain it* (tone, clarity, actionability) is where GPT-5.6 adds value.

---

## The Propagation Engine

The core technical piece of CDD is a lightweight, fully explainable scoring algorithm — not a black-box model:

1. Each concept gets a **raw score** from its quiz questions.
2. Concepts are processed in **dependency order** (prerequisites first).
3. For each concept, if any prerequisite's adjusted score falls below the mastery threshold, the current concept's score is **capped** at its weakest prerequisite's adjusted score — a downstream "pass" is treated as unreliable if the foundation under it is shaky.
4. The **root weak concept** is the most upstream concept whose adjusted score falls below threshold — not necessarily the concept the student did worst on.
5. Every node is classified **strong / borderline / weak**, and every adjustment is logged with a plain-English reason, shown in the "Show the math" panel.

---

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Flow (dependency graph visualization)
- **Backend:** Node.js, Express
- **AI:** OpenAI API — `gpt-5.6-luna`
- **Fonts:** JetBrains Mono (headings/labels/data), Manrope (body copy)

---

## Project Structure

```
concept-dependency-debugger/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── QuizFlow.jsx
│   │   │   ├── ConceptGraphView.jsx
│   │   │   ├── DiagnosisPanel.jsx
│   │   │   └── ...
│   │   └── App.css
│   ├── package.json
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── data/
│   │   │   ├── conceptGraph.json
│   │   │   └── questionBank.json
│   │   ├── routes/
│   │   │   ├── quiz.js
│   │   │   └── diagnose.js
│   │   ├── services/
│   │   │   ├── propagationEngine.js
│   │   │   └── diagnosisExplainer.js
│   ├── package.json
│   └── .env.example
└── README.md
```

*(Adjust this tree to match your actual file layout before submitting.)*

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- An OpenAI API key with access to GPT-5.6

### 1. Clone the repo
```bash
git clone [https://github.com/manikkori/Concept-dependency-debugger-frontend-]
cd concept-dependency-debugger
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_key_here
```
Start the backend:
```bash
npm start
```
Backend runs on `http://localhost:[5000]` by default.

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` by default (Vite's default port).

### 4. Try it out
Open the frontend URL in your browser, pick a subject, and take the diagnostic quiz.

---

## What's Next

- Larger per-concept question banks for finer-grained scoring
- A teacher/faculty view for classroom-wide diagnostics
- An adaptive quiz mode that focuses follow-up questions on suspected weak areas in real time

---

## Team

Manik Kori

Built with Codex, July 2026.