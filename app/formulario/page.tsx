"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Formulario() {

    const router = useRouter();

    const niveisDeDor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [idade, setIdade] = useState(0);
    const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([]);
    const [outroSintoma, setOutroSintoma] = useState("");
    const [nivelDor, setNivelDor] = useState<number | null>(null);
    const [erro, setErro] = useState("");

     function toggleSintoma(sintoma: string) {
      if (sintomasSelecionados.includes(sintoma)) {
        setSintomasSelecionados(sintomasSelecionados.filter((s) => s !== sintoma));
      } else {
        setSintomasSelecionados([...sintomasSelecionados, sintoma]);
      }
    }

    function selecionarNivelDor(nivel: number) {
        setNivelDor(nivel);
    }

    function validarFormulario(): boolean {
        if (nomeCompleto.trim() === "") {
        setErro("Por favor, preencha o nome completo.");
        return false;
    }

    if (idade <= 0) {
        setErro("Por favor, informe uma idade válida.");
        return false;
    }

    if (sintomasSelecionados.length === 0 && outroSintoma.trim() === "") {
        setErro("Selecione ao menos um sintoma.");
        return false;
    }

    if (nivelDor === null) {
        setErro("Selecione o nível de dor.");
        return false;
    }

    setErro("");
    return true;
    }

    function lidarComEnvio() {
    if (validarFormulario()) {
      const sintomasFinais = [...sintomasSelecionados, outroSintoma].filter(Boolean).join(",");
      
      const dadosTriagem = {
        full_name: nomeCompleto,
        age: idade,
        symptoms: sintomasFinais,
        pain_level: nivelDor,
      };

      sessionStorage.setItem("dadosTriagem", JSON.stringify(dadosTriagem));
      router.push("/analisando");
    }
  }

    

    return (
    <main>
        <h1>Formulário do Paciente</h1>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <input
        type="text"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
        placeholder="Nome completo"
        />
        <input
        type="number"
        value={idade}
        onChange={(e) => setIdade(Number(e.target.value))}
        placeholder="Idade"
        />

        <button onClick={() => toggleSintoma("Febre")}>Febre</button>
        <button onClick={() => toggleSintoma("Vômito")}>Vômito</button>
        <button onClick={() => toggleSintoma("Falta de ar")}>Falta de ar</button>
        <button onClick={() => toggleSintoma("Tontura")}>Tontura</button>
        <button onClick={() => toggleSintoma("Dor de cabeça")}>Dor de cabeça</button>
        <button onClick={() => toggleSintoma("Dor no peito")}>Dor no peito</button>

        <input
        type="text"
        value={outroSintoma}
        onChange={(e) => setOutroSintoma(e.target.value)}
        placeholder="Outro"
        />

       {niveisDeDor.map((nivel) => (
        <button key={nivel} onClick={() => selecionarNivelDor(nivel)}>
        {nivel}
        </button>
        ))}

        <button onClick={lidarComEnvio}>Enviar</button>
        



    </main>
    );
}