# FETIN Triage — Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel" alt="Deployed on Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

<p align="center">
  <strong>Web interface for an AI-assisted hospital triage system.</strong><br />
  Patients report symptoms, nurses record vital signs, and doctors manage a priority queue from a protected dashboard.
</p>

<p align="center">
  <a href="https://fetin-triagem-ia.vercel.app/">Live demo</a> ·
  <a href="https://fetin-project-backend-production.up.railway.app/docs">API documentation</a> ·
  <a href="https://github.com/cauahenriquereis/fetin-project-backend">Backend repository</a>
</p>

> **Project status:** Functional proof of concept deployed to production. This project is intended for demonstration and academic purposes and must not be used as a substitute for professional medical evaluation.

## About the project

FETIN Triage provides a guided workflow for hospital triage. The frontend coordinates the patient intake journey, communicates with the FastAPI backend, displays the AI analysis state, and gives the medical team a dedicated queue-management interface.

### Doctor dashboard

The doctor dashboard is available at `/medico` and is protected by password authentication. If you would like to explore this area, please contact the project owner to request demo credentials.

**Login screen:**

<img width="1919" height="997" alt="Doctor login screen" src="https://github.com/user-attachments/assets/345e42d9-c624-4845-982a-b35e59fdbeaa" />

**Dashboard view:**

<img width="1915" height="998" alt="Doctor dashboard" src="https://github.com/user-attachments/assets/c9d8111f-1f2a-41c9-9caa-3a2cd917b33d" />

### User journey

```text
Patient submits symptoms
          ↓
Nurse records vital signs
          ↓
Backend classifies urgency with AI
          ↓
Patient receives queue position
          ↓
Doctor manages the priority queue
```

## Features

- Patient self-service intake form with optional contact email
- Nurse-facing vital-sign form for temperature, blood pressure, SpO₂, and heart rate
- Client-side plausibility validation for vital signs
- Clear loading state while the backend performs AI classification
- Result screen with queue position and priority
- Password-protected doctor dashboard
- Responsive experience for desktop and mobile devices

## Screens and routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/formulario` | Patient symptom intake |
| `/sinais-vitais` | Vital-sign registration |
| `/analisando` | AI classification loading state |
| `/resultado` | Queue position and priority |
| `/medico` | Protected doctor dashboard |

## Technology

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Validation:** Zod
- **Icons:** Lucide React
- **Backend integration:** REST API with `fetch`
- **Deployment:** Vercel

## Quick start

### Requirements

- Node.js 18 or newer
- npm
- A running instance of the [backend API](https://github.com/cauahenriquereis/fetin-project-backend)

### Installation

```bash
git clone https://github.com/cauahenriquereis/fetin-project-frontend.git
cd fetin-project-frontend
npm install
```

### Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

`NEXT_PUBLIC_API_URL` must point to the backend base URL. For production, configure the same variable in the Vercel project settings.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run lint` | Runs ESLint |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the production server |

Before submitting changes, run:

```bash
npm run lint
npm run build
```

## Project structure

```text
.
├── app/
│   ├── analisando/       # AI classification loading screen
│   ├── formulario/       # Patient intake form
│   ├── medico/           # Doctor dashboard
│   ├── resultado/        # Queue result screen
│   ├── sinais-vitais/    # Vital-sign form
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Home page
├── config/
│   └── api.ts            # API URL and environment validation
├── public/               # Static assets
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## Deployment

The application is deployed on [Vercel](https://vercel.com) and configured for automatic deployments from the `main` branch.

## Related resources

- **Backend API:** [cauahenriquereis/fetin-project-backend](https://github.com/cauahenriquereis/fetin-project-backend)
- **Live application:** [fetin-triagem-ia.vercel.app](https://fetin-triagem-ia.vercel.app/)
- **Swagger UI:** [fetin-project-backend-production.up.railway.app/docs](https://fetin-project-backend-production.up.railway.app/docs)

## Roadmap

- Optional Bluetooth integration with vital-sign devices, currently out of scope

## License

This project is distributed under the [MIT License](LICENSE).
