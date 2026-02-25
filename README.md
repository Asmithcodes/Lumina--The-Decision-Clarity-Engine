# Lumina: The Decision Clarity Engine

> "The hardest person to be honest with is yourself. Lumina is the mirror that doesn't look away."

Lumina is a **Socratic mirror** designed to deconstruct the ego and expose the hidden truths behind your hardest dilemmas. Utilizing physics-based metaphors and deep-introspection AI, it transforms mental entropy into geometric clarity.

[![Live Demo](https://img.shields.io/badge/demo-materialize-cyan?style=for-the-badge&logoColor=white)](https://asmithcodes.github.io/Lumina--The-Decision-Clarity-Engine/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## The Philosophy

Most decision-making tools help you *decide*. Lumina helps you *see*.

Through a sequence of precisely calibrated, hard-hitting questions, Lumina forces you to bypass the superficial layers of self-justification. It doesn't give you advice; it reflects your own truth back to you until you can no longer ignore it.

## Cognitive Features

- **Deconstructive Questioning**: 5 devastatingly simple questions designed to bypass the ego and reach the core of your hesitation.
- **The Double-Model Cascade**: A resilient architecture using **Gemini 2.5 Flash** as the primary engine, with an automatic fallback to **Flash Lite** to ensure clarity even under high entropy (quota limits).
- **NeuroKnot Visualization**: A kinetic, physics-based UI that reacts to your progress, visualizing the unraveling of mental knots in real-time.
- **Zero-Exposure API**: All intelligence is proxied through a secure Cloudflare Worker, keeping the "brain" decoupled and the secrets safe.
- **Weightless Interface**: Built for speed and immersion, featuring glassmorphic aesthetics and motion-driven navigation.

## The Cognitive Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Logic** | [React 19](https://react.dev/) | Functional purity for complex state management. |
| **Motion** | [Framer Motion](https://www.framer.com/motion/) | Physics-based micro-interactions that feel "alive." |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Atomic utility for a weightless, premium UI. |
| **Intelligence** | [Gemini 2.5 Flash](https://ai.google.dev/) | High-speed, high-reasoning Socratic engine. |
| **Security** | [Cloudflare Workers](https://workers.cloudflare.com/) | Edge-level proxy for secure, serverless API execution. |

---

## Materializing Locally

### Prerequisites
- **Node.js 18+**
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Initialize the Core
```bash
git clone https://github.com/Asmithcodes/Lumina--The-Decision-Clarity-Engine.git
cd Lumina--The-Decision-Clarity-Engine
npm install
```

### 2. Configure the Proxy (Recommended)
This project uses a Cloudflare Worker to secure your API keys.
```bash
cd cloudflare-worker-api-proxy
npm install
npx wrangler secret put API_KEY  # Input your Gemini API key
npx wrangler deploy
```

### 3. Connect & Ignite
Create a `.env` in the root and point it to your materialized worker:
```env
VITE_WORKER_URL=https://your-worker-name.workers.dev
```
Then run the engine:
```bash
npm run dev
```

---

## Deployment

Lumina is designed to breathe on the edge.

- **Frontend**: Shipped via **GitHub Pages** (automated via `.github/workflows/ci.yml`).
- **Intelligence**: Distributed via **Cloudflare Workers**.

---

## Architecture of Thought

```text
├── components/          # The Sensory Organs (React Components)
│   ├── NeuroKnot.tsx    # The Pulse: Physics-based visualizer
│   ├── CognitiveHUD.tsx # The Feedback: Real-time status indicators
│   └── WarningGate.tsx  # The Filter: Ego-check before entry
├── services/
│   └── geminiService.ts # The Synapse: Dual-model cascade logic
├── types.ts             # The Blueprint: Strongly typed schemas
└── cloudflare-worker-api-proxy/ # The Shield: Secure API handling
```

---

## Collaboration

Interested in refining the Socratic engine or the physics of clarity? Pull requests are welcome. Let's build better mirrors together.

## Recognition

- Developed by **Asmith** ([asmyth@duck.com](mailto:asmyth@duck.com)).

---

**[Experience Clarity →](https://asmithcodes.github.io/Lumina--The-Decision-Clarity-Engine/)**
