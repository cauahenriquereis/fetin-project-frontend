"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

 type PatientQueueInfo = {
    patient: {
      id: number;
      full_name: string;
      age: number;
      symptoms: string;
      pain_level: number;
      urgency_level: string;
      priority_number: number;
    };
    queue_position: number;
    waiting_time_minutes: number;
  }; 

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
      throw new Error("Erro ao enviar os dados para análise");
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
  
  return (
  <main>
    <h1>Resultado da Triagem</h1>
    <p>Nome: {informacoes.patient.full_name}</p>
    <p>Urgência: {informacoes.patient.urgency_level}</p>
    <p>Posição na fila: {informacoes.queue_position}</p>
    <p>Tempo de espera: {informacoes.waiting_time_minutes} minutos</p>
  </main>
);
}