"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { API_URL } from "@/config/api";

export default function Analisando() {
  const router = useRouter();

  const alreadySent = useRef(false);

  useEffect(() => {
    if (alreadySent.current) return;
    alreadySent.current = true;

    async function sendForAnalysis() {
      const patientId = sessionStorage.getItem("patientId");
      const savedVitals = sessionStorage.getItem("sinaisVitais");

      if (!patientId || !savedVitals) {
        router.push("/formulario");
        return;
      }

      const vitalSigns = JSON.parse(savedVitals);

      try {
        const response = await fetch(`${API_URL}/patients/${patientId}/vitals`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vitalSigns),
        });

        if (!response.ok) {
          throw new Error("Erro ao enviar os sinais vitais para análise");
        }

        const patient = await response.json();

        sessionStorage.removeItem("patientId");
        sessionStorage.removeItem("sinaisVitais");

        router.push(`/resultado?id=${patient.id}`);

      } catch (error) {
        console.error(error);
        router.push(`/sinais-vitais?id=${patientId}`);
      }
    }

    sendForAnalysis();
  }, []);

  return (
  <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-5 sm:gap-6 lg:gap-8 overflow-hidden relative px-4 py-8">

    {/* Top-left decorative circle */}
    <div className="absolute top-0 left-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] bg-[#dff0f4] rounded-full -translate-x-20 -translate-y-20 sm:-translate-x-32 sm:-translate-y-32 lg:-translate-x-40 lg:-translate-y-40"></div>

    {/* Bottom-right decorative circle */}
    <div className="absolute bottom-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] bg-[#dff0f4] rounded-full translate-x-20 translate-y-20 sm:translate-x-32 sm:translate-y-32 lg:translate-x-40 lg:translate-y-40"></div>

    {/* Medical cross icon */}
    <div className="bg-cyan-500 rounded-full w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 flex items-center justify-center z-10">
      <Plus size={45} color="white" strokeWidth={6} className="sm:hidden" />
      <Plus size={65} color="white" strokeWidth={6} className="hidden sm:block lg:hidden" />
      <Plus size={90} color="white" strokeWidth={6} className="hidden lg:block" />
    </div>

    {/* Main title */}
    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-800 text-center z-10">
      Analisando seus sintomas...
    </h1>

    {/* Subtitle */}
    <p className="text-base sm:text-lg lg:text-2xl text-gray-600 text-center max-w-xs sm:max-w-md lg:max-w-xl z-10">
      Nossa Inteligência Artificial está avaliando suas informações
      para determinar a prioridade do seu atendimento.
    </p>

    {/* Animated loading dots */}
    <div className="flex items-center gap-2 sm:gap-3 z-10">
      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: "150ms" }}></div>
      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-800 animate-bounce" style={{ animationDelay: "300ms" }}></div>
    </div>

    {/* Progress steps indicator */}
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs sm:text-sm z-10">
      <span className="text-gray-500 flex items-center gap-1">
        <span className="text-cyan-600">✓</span> Dados recebidos
      </span>
      <span className="text-cyan-700 font-bold flex items-center gap-1">
        <span className="border-2 border-cyan-600 rounded-full w-4 h-4 inline-block"></span>
        Analisando sintomas
      </span>
      <span className="text-gray-400 flex items-center gap-1">
        <span className="border border-gray-300 rounded-full w-4 h-4 inline-block"></span>
        Resultado da triagem
      </span>
    </div>

  </main>
);
}