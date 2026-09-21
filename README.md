# FETIN Triage — Frontend

Web interface for an AI-assisted hospital triage system. Patients submit symptoms, nurses record vital signs, and doctors manage a priority-ordered queue from a protected dashboard.

The backend API is maintained in a separate repository: [fetin-project-backend](https://github.com/cauahenriquereis/fetin-project-backend).

## Contents

- [Overview](#overview)
- [Features](#features)
- [Screens and routes](#screens-and-routes)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Deployment](#deployment)
- [Related repository](#related-repository)
- [Roadmap](#roadmap)

## Overview

- **Live application:** [fetin-triagem-ia.vercel.app](https://fetin-triagem-ia.vercel.app/)
- **Production API:** [Railway](https://fetin-project-backend-production.up.railway.app)
- **API documentation:** [Swagger UI](https://fetin-project-backend-production.up.railway.app/docs)

> The doctor dashboard at `/medico` is password-protected. Contact the project owner if you need demo credentials.

## Features

- Patient self-service intake form with symptoms and optional email
- Nurse-facing vital-sign form for temperature, blood pressure, SpO₂, and heart rate
- Client-side plausibility validation for vital signs
- Loading state while the backend performs AI urgency classification
- Result screen with queue position and priority
- Password-protected doctor dashboard for managing the live queue
- Responsive interface for desktop and mobile devices

## Screens and routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/formulario` | Patient symptom intake form |
| `/sinais-vitais` | Nurse-facing vital-sign form |
| `/analisando` | Loading state during AI classification |
| `/resultado` | Patient queue position and priority |
| `/medico` | Protected doctor queue dashboard |

## Tech stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **UI and styling:** Tailwind CSS
- **Validation:** Zod
- **Icons:** Lucide React
- **Deployment:** Vercel

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm
- The [backend API](https://github.com/cauahenriquereis/fetin-project-backend) running locally or available remotely

### Installation

```bash
git clone https://github.com/cauahenriquereis/fetin-project-frontend.git
cd fetin-project-frontend
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

`NEXT_PUBLIC_API_URL` must contain the base URL of the backend API. The application validates this variable when it starts. For production, configure it in the Vercel project environment settings.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Before opening a pull request, run the production build and linter:

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

The frontend is deployed on [Vercel](https://vercel.com), connected to this GitHub repository for automatic deployments from `main`.

## Related repository

- **Backend API:** [cauahenriquereis/fetin-project-backend](https://github.com/cauahenriquereis/fetin-project-backend)

## Roadmap

- Optional Bluetooth integration with vital-sign devices (thermometer, blood pressure monitor, and pulse oximeter), currently out of scope

## License

This project is available under the [MIT License](LICENSE).
