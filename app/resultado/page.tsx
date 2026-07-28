"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

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
} 

export default function Resultado() {

 
  const router = useRouter();
  const jaEnviou = useRef(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id"); 
  
  const [informacoes, setInformacoes] = useState<PatientQueueInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

useEffect(() => {

    if (jaEnviou.current) return;
    jaEnviou.current = true;

    async function buscarDadosPaciente(id:string) {
    setLoading(true); 
    setErro(null);

    try {
    const response = await fetch(`http://127.0.0.1:8000/patients/${id}`);
    
    if (!response.ok) {    
      throw new Error("Erro ao buscar dados do paciente");
    }

    const dadosPaciente = await response.json();
    console.log("Dados recebidos:", dadosPaciente);
    setInformacoes(dadosPaciente); 
    setLoading(false);   

  } catch (error) {
    console.error("Erro ao buscar dados do paciente:", error);
    setLoading(false);
    setErro("Erro ao buscar dados do paciente");
  }
}
    if (id) {
      buscarDadosPaciente(id);
    }

    else {
      router.push("/formulario");
    }
  }, [id, router]);


  if (!id) return null;
  if (loading) return <p>Analisando seus dados...</p>;
  if (erro) return <p>Erro: {erro}</p>;
  if (!informacoes) return <p>Nenhum dado encontrado</p>;

 const config = {
  alta: {
    corBarra: "bg-red-600",
    corFundoEsquerda: "bg-[#f4e1e1]",
    corFundoDireita: "bg-[#e17d80]",
    corTexto: "text-red-700",
    corIcone: "bg-red-600",
    icone: <AlertTriangle size={100} color="white" strokeWidth={2} />,
    iconeBarra: <AlertTriangle size={25} color="white" strokeWidth={2} />,
    corBadge: "bg-[#e17d80]",
  },
  média: {
    corBarra: "bg-orange-500",
    corFundoEsquerda: "bg-[#f4ede1]",
    corFundoDireita: "bg-[#e1aa7d]",
    corTexto: "text-orange-700",
    corIcone: "bg-orange-500",
    icone: <AlertCircle size={100} color="white" strokeWidth={2} />,
    iconeBarra: <AlertCircle size={25} color="white" strokeWidth={2} />,
    corBadge: "bg-[#e1aa7d]",
  },
  baixa: {
    corBarra: "bg-green-600",
    corFundoEsquerda: "bg-[#e2f4e1]",
    corFundoDireita: "bg-[#a3c7a0]",
    corTexto: "text-green-700",
    corIcone: "bg-green-600",
    icone: <CheckCircle size={100} color="white" strokeWidth={2} />,
    iconeBarra: <CheckCircle size={25} color="white" strokeWidth={2} />,
    corBadge: "bg-[#a3c7a0]",
  },
}
[informacoes.patient.urgency_level] ?? {
  corBarra: "bg-gray-500",
  corFundoEsquerda: "bg-gray-50",
  corFundoDireita: "bg-gray-100",
  corTexto: "text-gray-700",
  corIcone: "bg-gray-500",
  icone: <AlertCircle size={100} color="white" strokeWidth={2} />,
  iconeBarra: <AlertCircle size={25} color="white" strokeWidth={2} />,
  corBadge: "bg-gray-400",
} 
  
  return (
  <main className="min-h-screen flex flex-col overflow-hidden">

    {/* Barra superior dinâmica */}
   <div className={`flex items-center gap-4 px-8 py-4 ${config.corBarra}`}>
    <div className={`border-2 border-white rounded-lg px-20 py-1 flex items-center gap-2 ${config.corBadge}`}>
      {config.iconeBarra}
      <span className="text-white font-bold text-xl">{informacoes.patient.urgency_level.toUpperCase()}</span>
    </div>
      <p className="text-white font-semibold text-xl">
        Triagem concluída para {informacoes.patient.full_name}, {informacoes.patient.age} anos
      </p>
    </div>

    {/* Conteúdo principal em 2 colunas */}
    <div className="grid grid-cols-[1fr_1px_1fr] flex-1">

      {/* Coluna Esquerda — Urgência */}
      <div className={`flex flex-col items-center justify-center gap-8 p-16 ${config.corFundoEsquerda}`}>
        <p className={`font-bold text-xl tracking-widest ${config.corTexto}`}>NÍVEL DE URGÊNCIA</p>

        <div className={`w-36 h-36 rounded-full flex items-center justify-center ${config.corIcone}`}>
          {config.icone}
        </div>

        <p className={`text-6xl font-bold ${config.corTexto}`}>
          {informacoes.patient.urgency_level.charAt(0).toUpperCase() + informacoes.patient.urgency_level.slice(1)}
        </p>

        <div className="bg-white border-3 border-gray-400 rounded-full px-10 py-2">
          <p className="text-gray-600 text-lg">{informacoes.patient.symptoms}</p>
        </div>
      </div>

      {/* Separador */}
      <div className="bg-gray-200"></div>

      {/* Coluna Direita — Tempo e Posição */}
      <div className={`flex flex-col items-center justify-center gap-10 p-16 ${config.corFundoDireita}`}>

        {/* Tempo de espera — destaque principal */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-600 text-sm tracking-widest uppercase">Tempo estimado de espera</p>
          <div className="border-2 border-blue-100 rounded-2xl px-16 py-8 bg-blue-50">
            <p className="text-7xl font-black text-gray-800">~ {informacoes.waiting_time_minutes} min</p>
          </div>
        </div>

        {/* Posição na fila — secundário */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-gray-600 text-sm tracking-widest uppercase">Posição na fila</p>
          <p className="text-4xl font-black text-gray-800">#{informacoes.queue_position}</p>
        </div>

        {/* Aviso */}
        <div className="bg-white border-6 border-gray-300 rounded-2xl px-8 py-6 max-w-lg text-center">
          <p className="text-gray-500 text-lg">Sente-se e aguarde ser chamado pelo nome.</p>
          <p className="text-gray-800 font-bold text-lg mt-1">Por favor, não saia da recepção.</p>
        </div>

      </div>

    </div>

  </main>
);
}