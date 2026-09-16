# FETIN Triage - Frontend

Web interface for an AI-assisted hospital triage system. Patients register and report symptoms, a nurse records vital signs, and a doctor dashboard consumes a priority-ordered queue classified by generative AI.

This repository contains the frontend. The backend API lives in a separate repository.

## Live Demo

- 🌐 **App:** https://fetin-triagem-ia.vercel.app/
- 🔗 **Backend repository:** https://github.com/cauahenriquereis/fetin-project-backend
- 📑 **API docs (Swagger):** https://fetin-project-backend-production.up.railway.app/docs

### Doctor dashboard

> **Note:** The doctor dashboard (`/medico`) is password-protected. Feel free to reach out if you'd like demo credentials to explore it.

**Login screen:**

<img width="1919" height="997" alt="Doctor login screen" src="https://github.com/user-attachments/assets/345e42d9-c624-4845-982a-b35e59fdbeaa" />

**Dashboard view:**

<img width="1915" height="998" alt="Doctor dashboard" src="https://github.com/user-attachments/assets/c9d8111f-1f2a-41c9-9caa-3a2cd917b33d" />

## Table of Contents

- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Screens](#screens)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Related Repository](#related-repository)
- [Roadmap](#roadmap)

## Features

- Patient self-service intake form (symptoms + optional contact email)
- Nurse-facing vital signs screen (temperature, blood pressure, SpO2, heart rate) with client-side plausibility validation
- Real-time "analyzing" screen while the backend runs AI urgency classification
- Result screen showing the patient's queue position and estimated priority
- Password-protected doctor dashboard for managing the live patient queue
- Responsive layout (mobile and desktop)

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

## Screens

| Route             | Description                                                        |
|--------------------|---------------------------------------------------------------------|
| `/`                | Home / landing page                                                 |
| `/formulario`      | Patient intake form (symptoms, optional email)                     |
| `/sinais-vitais`   | Nurse-facing screen to record vital signs                          |
| `/analisando`      | Loading screen while the backend runs AI urgency classification    |
| `/resultado`       | Shows the patient's queue position after classification            |
| `/medico`          | Password-protected doctor dashboard for managing the queue         |

## Getting Started

### Prerequisites

- Node.js 18+
- The [backend API](https://github.com/cauahenriquereis/fetin-project-backend) running locally or accessible remotely

### Installation

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The API base URL is read and validated in `config/api.ts`:

```typescript
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não está definida");
}
```

> The app will throw at startup if this variable is not set.

### Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
.
├── app/
│   ├── analisando/
│   │   └── page.tsx
│   ├── formulario/
│   │   └── page.tsx
│   ├── medico/
│   │   └── page.tsx
│   ├── resultado/
│   │   └── page.tsx
│   ├── sinais-vitais/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Home
├── config/
│   └── api.ts                 # API_URL env variable + validation
├── public/
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## Deployment

The frontend is deployed on [Vercel](https://vercel.com), connected to the GitHub repository for automatic deploys on push to the main branch.

## Related Repository

- **Backend API:** https://github.com/cauahenriquereis/fetin-project-backend

## Roadmap

- Optional Bluetooth integration with vital-sign measurement devices (thermometer, blood pressure monitor, pulse oximeter) — currently out of scope
