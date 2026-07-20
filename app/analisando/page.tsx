"use client";


import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function Analisando() {
  const router = useRouter();
  const jaEnviou = useRef(false);

  useEffect(() => {
    if (jaEnviou.current)return;
    jaEnviou.current = true;
    
    async function enviarParaAnalise() {
      const dadosSalvos = sessionStorage.getItem("dadosTriagem");
      
      if(!dadosSalvos) {
        router.push("/formulario");
        return;
      }

      const dadosTriagem = JSON.parse(dadosSalvos);

      try {
        const response = await fetch("http://127.0.0.1:8000/patients/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosTriagem),
        });

        if (!response.ok) {    
           throw new Error("Erro ao enviar os dados para análise");
        }

        const paciente = await response.json();

        router.push(`/resultado?id=${paciente.id}`);

      } catch (error) {
        console.error(error);
        router.push("/formulario");
      }
    }

    enviarParaAnalise();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-8 overflow-hidden">

      {/* Círculos decorativos */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#dff0f4] rounded-full -translate-x-40 -translate-y-40"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#dff0f4] rounded-full translate-x-40 translate-y-40"></div>

      {/* Ícone de cruz médica */}
      <div className="bg-cyan-500 rounded-full w-36 h-36 flex items-center justify-center">
        <Plus size={90} color="white" strokeWidth={6} />
      </div>

      {/* Título */}
      <h1 className="text-5xl font-bold text-gray-800 text-center">
        Analisando seus sintomas...
      </h1>

      {/* Subtítulo */}
      <p className="text-2xl text-gray-600 text-center max-w-xl">
        Nossa Inteligência Artificial está avaliando suas informações
        para determinar a prioridade do seu atendimento.
      </p>

      {/* Stepper — 3 bolinhas animadas */}
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-5 h-5 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-6 h-6 rounded-full bg-cyan-800 animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>

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