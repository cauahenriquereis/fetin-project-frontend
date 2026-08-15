"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { API_URL } from "@/config/api";

export default function Analisando() {
  const router = useRouter();

  // Prevents double submission in React Strict Mode
  const alreadySent = useRef(false);

  useEffect(() => {
    if (alreadySent.current) return;
    alreadySent.current = true;

    // Reads triage data from sessionStorage and sends it to the backend for AI analysis
    // Redirects to /formulario if data is missing or if the request fails
    async function sendForAnalysis() {
      const savedData = sessionStorage.getItem("dadosTriagem");

      if (!savedData) {
        router.push("/formulario");
        return;
      }

      const triageData = JSON.parse(savedData);

      try {
        const response = await fetch(`${API_URL}/patients/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(triageData),
        });

        if (!response.ok) {
          throw new Error("Erro ao enviar os dados para análise");
        }

        const patient = await response.json();

        // Navigates to the result page with the patient ID in the URL
        router.push(`/resultado?id=${patient.id}`);

      } catch (error) {
        console.error(error);
        router.push("/formulario");
      }
    }

    sendForAnalysis();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-8 overflow-hidden relative">

      {/* Top-left decorative circle */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#dff0f4] rounded-full -translate-x-40 -translate-y-40"></div>

      {/* Bottom-right decorative circle */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#dff0f4] rounded-full translate-x-40 translate-y-40"></div>

      {/* Medical cross icon */}
      <div className="bg-cyan-500 rounded-full w-36 h-36 flex items-center justify-center">
        <Plus size={90} color="white" strokeWidth={6} />
      </div>

      {/* Main title */}
      <h1 className="text-5xl font-bold text-gray-800 text-center">
        Analisando seus sintomas...
      </h1>

      {/* Subtitle */}
      <p className="text-2xl text-gray-600 text-center max-w-xl">
        Nossa Inteligência Artificial está avaliando suas informações
        para determinar a prioridade do seu atendimento.
      </p>

      {/* Animated loading dots */}
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-5 h-5 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-6 h-6 rounded-full bg-cyan-800 animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>

      {/* Progress steps indicator */}
      <div className="flex items-center gap-6 text-sm">
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