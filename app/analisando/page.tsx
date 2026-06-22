"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Analisando() {
  const router = useRouter();

  useEffect(() => {
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
    <main>
      <h1>Analisando os sintomas...</h1>
    </main>
  );
}