"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { API_URL } from "@/config/api";

type PatientQueueInfo = {
  patient: {
    id: number;
    full_name: string;
    age: number;
    symptoms: string;
    pain_level: number;
    urgency_level: string;
    priority_number: number;
    status: string;
    created_at: string;
  };
  queue_position: number;
  waiting_time_minutes: number;
  priority_number: number;
}

function ResultadoContent() {

  const router = useRouter();

  // Prevents double fetch in React Strict Mode
  const alreadyFetched = useRef(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [patientInfo, setPatientInfo] = useState<PatientQueueInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevents flash of loading screen before data is ready
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (alreadyFetched.current) return;
    alreadyFetched.current = true;

    // Fetches patient data and queue info by ID from the backend
    // Redirects to /formulario if ID is missing or request fails
    async function fetchPatientData(id: string) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/patients/${id}`);

        if (!response.ok) {
          throw new Error("Erro ao buscar dados do paciente");
        }

        const patientData = await response.json();
        console.log("Dados recebidos:", patientData);
        setPatientInfo(patientData);
        setLoading(false);
        setCheckingSession(false);

      } catch (error) {
        console.error("Erro ao buscar dados do paciente:", error);
        setLoading(false);
        setError("Erro ao buscar dados do paciente");
        setCheckingSession(false);
      }
    }

    if (id) {
      fetchPatientData(id);
    } else {
      router.push("/formulario");
    }

  }, [id, router]);

  if (checkingSession || loading) return (
  <main className="min-h-screen bg-slate-100 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-semibold">Carregando resultado...</p>
    </div>
  </main>
);

  if (!id) return null;

  if (error) return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <p className="text-2xl text-red-500">{error}</p>
    </main>
  );

  if (!patientInfo) return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <p className="text-2xl text-gray-600">Nenhum dado encontrado</p>
    </main>
  );

  // Dynamic color and icon config based on urgency level
  const config = {
    alta: {
      headerColor: "bg-red-600",
      leftBackground: "bg-[#f4e1e1]",
      rightBackground: "bg-[#e17d80]",
      textColor: "text-red-700",
      iconBackground: "bg-red-600",
      icon: <AlertTriangle size={100} color="white" strokeWidth={2} />,
      headerIcon: <AlertTriangle size={25} color="white" strokeWidth={2} />,
      badgeColor: "bg-[#e17d80]",
    },
    média: {
      headerColor: "bg-orange-500",
      leftBackground: "bg-[#f4ede1]",
      rightBackground: "bg-[#e1aa7d]",
      textColor: "text-orange-700",
      iconBackground: "bg-orange-500",
      icon: <AlertCircle size={100} color="white" strokeWidth={2} />,
      headerIcon: <AlertCircle size={25} color="white" strokeWidth={2} />,
      badgeColor: "bg-[#e1aa7d]",
    },
    baixa: {
      headerColor: "bg-green-600",
      leftBackground: "bg-[#e2f4e1]",
      rightBackground: "bg-[#a3c7a0]",
      textColor: "text-green-700",
      iconBackground: "bg-green-600",
      icon: <CheckCircle size={100} color="white" strokeWidth={2} />,
      headerIcon: <CheckCircle size={25} color="white" strokeWidth={2} />,
      badgeColor: "bg-[#a3c7a0]",
    },
  }[patientInfo.patient.urgency_level] ?? {
    headerColor: "bg-gray-500",
    leftBackground: "bg-gray-50",
    rightBackground: "bg-gray-100",
    textColor: "text-gray-700",
    iconBackground: "bg-gray-500",
    icon: <AlertCircle size={100} color="white" strokeWidth={2} />,
    headerIcon: <AlertCircle size={25} color="white" strokeWidth={2} />,
    badgeColor: "bg-gray-400",
  };

  return (
    <main className="min-h-screen flex flex-col overflow-hidden">

      {/* Dynamic header bar — color and icon change based on urgency level */}
      <div className={`flex items-center gap-4 px-8 py-4 ${config.headerColor}`}>
        <div className={`border-2 border-white rounded-lg px-20 py-1 flex items-center gap-2 ${config.badgeColor}`}>
          {config.headerIcon}
          <span className="text-white font-bold text-xl">{patientInfo.patient.urgency_level.toUpperCase()}</span>
        </div>
        <p className="text-white font-semibold text-xl">
          Triagem concluída para {patientInfo.patient.full_name}, {patientInfo.patient.age} anos
        </p>
      </div>

      {/* Main content — two columns */}
      <div className="grid grid-cols-[1fr_1px_1fr] flex-1">

        {/* Left column — urgency level and symptoms */}
        <div className={`flex flex-col items-center justify-center gap-8 p-16 ${config.leftBackground}`}>
          <p className={`font-bold text-xl tracking-widest ${config.textColor}`}>NÍVEL DE URGÊNCIA</p>

          <div className={`w-36 h-36 rounded-full flex items-center justify-center ${config.iconBackground}`}>
            {config.icon}
          </div>

          <p className={`text-6xl font-bold ${config.textColor}`}>
            {patientInfo.patient.urgency_level.charAt(0).toUpperCase() + patientInfo.patient.urgency_level.slice(1)}
          </p>

          {/* Symptoms pill */}
          <div className="bg-white border-3 border-gray-400 rounded-full px-10 py-2">
            <p className="text-gray-600 font-bold text-lg">{patientInfo.patient.symptoms}</p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="bg-gray-200"></div>

        {/* Right column — wait time and queue position */}
        <div className={`flex flex-col items-center justify-center gap-10 p-16 ${config.rightBackground}`}>


          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-600 font-bold font-boldtext-sm tracking-widest uppercase">Senha</p>
            <div className="border-6 border-gray-300 rounded-2xl px-16 py-8 bg-blue-50">
              <p className="text-7xl font-black text-gray-800">{patientInfo.priority_number}</p>
            </div>
          </div>


          {/* Estimated wait time — primary info */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-600 font-bold text-sm tracking-widest uppercase">Tempo estimado de espera</p>
            <div className="border-6 border-gray-300 rounded-2xl px-10 py-4 bg-blue-50">
              <p className="text-4xl font-black text-gray-800">~ {patientInfo.waiting_time_minutes} min</p>
            </div>
          </div>

          {/* Queue position — secondary info */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-gray-600 font-bold text-sm tracking-widest uppercase">Posição na fila</p>
            <div className="border-6 border-gray-300 rounded-2xl px-6 py-2 bg-blue-50">
              <p className="text-4xl font-black text-gray-800">#{patientInfo.queue_position}</p>
            </div>
          </div>

          {/* Stay in waiting room notice */}
          <div className="bg-white border-6 border-gray-300 rounded-2xl px-8 py-6 max-w-lg text-center">
            <p className="text-gray-500 text-lg">Sente-se e aguarde ser chamado pela senha.</p>
            <p className="text-gray-800 font-bold text-lg mt-1">Por favor, não saia da recepção.</p>
          </div>

        </div>

      </div>

    </main>
  );
}

export default function Resultado() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-100"></main>}>
      <ResultadoContent />
    </Suspense>
  );
}