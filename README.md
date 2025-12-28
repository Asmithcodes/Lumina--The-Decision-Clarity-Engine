# 🔮 Lumina - The Decision Clarity Engine

**A brutally honest AI tool that cuts through your excuses and exposes the truth about your decisions.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://asmithcodes.github.io/Lumina--The-Decision-Clarity-Engine/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 What is Lumina?

Lumina is an AI-powered decision-making assistant that uses deep, piercing questions to expose your hidden fears, lies you tell yourself, and blind spots. Instead of giving you easy answers, it forces brutal self-honesty through Socratic questioning powered by Google's Gemini AI.

**No fluff. No comfort. Just clarity.**

## ✨ Features

- 🎭 **Ruthless Questioning** - 5 devastating questions that expose what you're really avoiding
- 🧠 **Deep Analysis** - AI-powered insights that reveal your core truth and blind spots
- 🎨 **Immersive UI** - Dark, focused interface with animated visual feedback
- 🔒 **Privacy First** - All processing happens client-side, no data stored on servers
- ⚡ **Dual Model Fallback** - Automatic switching between Gemini models for reliability

## 🚀 How It Works

1. **Enter Your Dilemma** - Describe what decision you're struggling with
2. **Face the Questions** - Answer 5 hard-hitting questions that make you think deep
3. **Get Clarity** - Receive brutal analysis of what you're avoiding and what to do

The AI uses simple language but asks the tough questions most people avoid.

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Google Gemini 2.5 Flash
- **Build**: Vite
- **Deployment**: GitHub Pages

## 📦 Local Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key ([Get one free](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Asmithcodes/Lumina--The-Decision-Clarity-Engine.git
   cd Lumina--The-Decision-Clarity-Engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional)
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_KEY=your_gemini_api_key_here
   ```
   
   *Note: If you don't set this, users will be prompted to enter their own API key in the app.*

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173/Lumina--The-Decision-Clarity-Engine/
   ```

## 🌐 Deployment

### GitHub Pages (Automated)

The app automatically deploys to GitHub Pages when you push to the `main` branch.

**Setup:**

1. **Add API Key to GitHub Secrets** (Optional but recommended)
   - Go to: `Settings` → `Secrets and variables` → `Actions`
   - Click `New repository secret`
   - Name: `VITE_API_KEY`
   - Value: Your Gemini API key
   - Click `Add secret`

2. **Enable GitHub Pages**
   - Go to: `Settings` → `Pages`
   - Source: `GitHub Actions`

3. **Deploy**
   - Push to `main` branch or trigger workflow manually
   - Wait 2-3 minutes for build
   - Visit: `https://yourusername.github.io/Lumina--The-Decision-Clarity-Engine/`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🛡️ Secure Backend (Cloudflare Worker)

To use the Google Gemini API securely without exposing your credentials, this project includes a Cloudflare Worker proxy.

1. **Navigate to the worker directory**
   ```bash
   cd cloudflare-worker-api-proxy
   ```
2. **Deploy the worker** (Requires Cloudflare account)
   ```bash
   npm install
   npx wrangler login
   npx wrangler secret put API_KEY  # Paste your Google API Key
   npx wrangler deploy
   ```
3. **Connect Frontend**
   Add your worker URL to `.env`:
   ```env
   VITE_WORKER_URL=https://your-worker-name.workers.dev
   ```

## 📁 Project Structure

```
.
├── components/          # React components
│   ├── ApiKeyModal.tsx  # API key input modal
│   ├── CognitiveHUD.tsx # Main interface
│   ├── IntroBriefing.tsx # Landing screen
│   ├── NeuroKnot.tsx    # Animated visual
│   └── WarningGate.tsx  # Disclaimer screen
├── services/
│   └── geminiService.ts # Gemini AI integration
├── App.tsx              # Main app component
├── types.ts             # TypeScript definitions
├── vite.config.ts       # Vite configuration
└── .github/workflows/   # GitHub Actions deployment
```

## 🔑 API Key Management

### For Users
The app will prompt for a Gemini API key on first use. Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).

### For Developers
- **Local Development**: Use `.env` file (not committed to Git)
- **Production**: Add to GitHub Secrets for automated deployment

## 🎨 Customization

### Change AI Behavior

Edit prompts in `services/geminiService.ts`:
- `generateQuestions()` - Modify question generation
- `generateAnalysis()` - Adjust analysis tone and depth

### Styling

All styles use Tailwind CSS. Custom colors defined in `index.html`:
- `void` - Deep black
- `magma` - Red (chaos/warnings)
- `ether` - Purple (processing)
- `clarity` - Cyan (truth/results)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Powered by [Google Gemini AI](https://ai.google.dev/)
- Built with [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Live Demo**: [https://asmithcodes.github.io/Lumina--The-Decision-Clarity-Engine/](https://asmithcodes.github.io/Lumina--The-Decision-Clarity-Engine/)

**Made by [Asmithcodes](https://github.com/Asmithcodes)**
