# KalpanaAI

## AI-Powered Cultural Commerce Platform for Indian Artisans

Empowering 200M+ artisans with Google Cloud-native AI tools for storytelling, pricing, and global sales.

## Live Demo

`https://kalpana-ai.vercel.app`

Fully functional prototype with all core features.

## Project Vision

KalpanaAI transforms how Indian artisans preserve heritage while accessing global markets. By combining cultural intelligence with agent-based AI architecture, this platform aims to deliver an AP2-ready commerce system designed specifically for traditional craftspeople.

"We don't force artisans to learn technology. We built technology that understands artisans."

## Core Features

### Add Product Pipeline

Upload 1 photo plus voice story and generate an instant marketing kit:

- 2 professional e-commerce images (Cloud Vision + Imagen 4.0)
- 3 emotional story posts (Firestore RAG + Gemini 2.5 Flash)
- Dynamic fair pricing (BigQuery + Trends API)
- Craft DNA QR with heritage proof and eco-metrics
- AP2-ready badge for autonomous sales

### The Muse (AI Creative Assistant)

Generate 2 traditional and 2 modern design variations with zero-hallucination intent:

- Style transfer validated against Craft Knowledge Base
- Risk-free innovation without wasting materials
- Culturally authentic outputs for new markets

### Sales Analytics Dashboard

Real-time business intelligence:

- Revenue tracking and inventory alerts
- Demand forecasting (example: "Diwali = +3.2x demand")
- Regional insights and AI-powered recommendations
- Stock velocity analysis and restock alerts

### Artisan Circle

Hyperlocal collaboration engine:

- Demand-spike collaboration prompts by location and skill
- Matchmaking by craft strength and proximity
- Shared project spaces for bulk orders

### Artisan Mentor

Structured lessons with AI evaluation:

- Foundation: Photography and listing basics
- Growth: Pricing, SEO, and customer engagement
- Scale: Export readiness and business planning
- Progress tracking and multilingual certification workflows

### Support Chatbot

24/7 AI assistant:

- Context-aware conversations in Indian languages
- Craft knowledge base and platform support flows
- Voice-first interaction for low-literacy users

## Tech Stack

| Category | Technologies |
| --- | --- |
| Framework | Next.js 15.3.3 (App Router), React 18.3.1 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4.1, Radix UI |
| Icons | Lucide React 0.475.0 |
| State | React Hooks, localStorage patterns |
| AI | Genkit 1.14.1 |
| Auth | Firebase Authentication |
| Database | Firestore |
| Storage | Firebase Storage |
| Deployment | Vercel |
| i18n | Next.js i18n routing with locale dictionaries |

## Project Structure

```text
Kalpana-AI/
|- src/
|  |- app/
|  |  |- [lang]/                 # Localized routes
|  |  |  |- add-product/
|  |  |  |- the-muse/
|  |  |  |- sales-analytics/
|  |  |  |- artisan-circle/
|  |  |  |- artisan-mentor/
|  |  |  |- support/
|  |  |- api/
|  |     |- proxy/route.ts       # Story generation proxy
|  |     |- translate/route.ts   # Translation proxy
|  |     |- transcribe/route.ts  # Voice transcription proxy
|  |- components/                # UI components
|  |- hooks/                     # Custom hooks
|  |- lib/
|     |- firebase/               # Firebase config
|     |- i18n/                   # Locale config and dictionaries
|- public/                       # Static assets
|- package.json
|- next.config.ts
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Firebase project
- Google Cloud project with required AI APIs enabled

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` and configure values for your environment:

```env
# Backend storytelling API base URL
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-url

# Translation service URL (used by translation proxy route)
TRANSLATION_SERVICE_URL=https://your-translation-service-url

# Firebase (example keys; align with src/lib/firebase/firebase.ts)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
npm run dev
```

Local URL:

```text
http://localhost:9002/en-US
```

### Build and Deploy

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

## Internationalization

KalpanaAI is designed for broad multilingual support across Indian languages.

Current configured locales in this frontend:

- `en-US`, `hi-IN`, `bn-IN`, `ta-IN`, `te-IN`, `mr-IN`, `gu-IN`, `kn-IN`

Add new languages:

1. Add language code to `src/lib/i18n/i18n-config.ts`.
2. Add language labels in the same config file.
3. Add dictionary content under your i18n dictionary files.
4. Ensure route usage is covered under `src/app/[lang]/`.

## Contributing

Contributions from developers, designers, and cultural experts are welcome.

How to contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/AmazingFeature`.
3. Commit changes: `git commit -m "Add AmazingFeature"`.
4. Push to branch: `git push origin feature/AmazingFeature`.
5. Open a Pull Request.

Areas where help is needed:

- Regional language translations
- Accessibility improvements
- Mobile UX enhancements
- UI/UX refinements
- Documentation quality

## License

MIT License. See `LICENSE` for details.

## Acknowledgements

- Firebase for backend infrastructure integration
- Google Cloud for Vertex AI and Cloud Run services
- Vercel for Next.js hosting
- Radix UI for accessible UI primitives
- Tailwind Labs for Tailwind CSS
- Lucide for iconography
- Dastkar India for field research partnership
- Crafts Council of India for cultural validation

## Contact

- Project Lead: Bhavishya Jain
- GitHub: `@Bhavishya011`
- Live Demo: `https://kalpana-ai.vercel.app`
- Backend Repo: `https://github.com/Bhavishya011/Kalpana-AI-Backend`
- Hackathon: Google Cloud Gen AI Exchange 2025

"KalpanaAI doesn't just use AI. It gives AI a soul, a purpose, and a mission: to ensure no artisan is left behind in the digital age."
