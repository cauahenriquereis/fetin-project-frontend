"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Formulario() {

    const router = useRouter();

    const niveisDeDor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [idade, setIdade] = useState<number | string>("");
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

    if (Number(idade) <= 0) {
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
        age: Number(idade),
        symptoms: sintomasFinais,
        pain_level: nivelDor,
      };

      sessionStorage.setItem("dadosTriagem", JSON.stringify(dadosTriagem));
      router.push("/analisando");
    }
  }

    

   return (
    <main className="min-h-screen bg-slate-100 flex flex-col">
      {erro && (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white border-4 border-[#00526e] rounded-2xl p-10 flex flex-col items-center gap-6 shadow-2xl max-w-md w-full mx-4 pointer-events-auto">
          <p className="text-red-500 font-bold text-2xl text-center">{erro}</p>
          <button
            onClick={() => setErro("")}
            className="bg-red-500 hover:bg-red-700 text-white font-bold px-10 py-3 rounded-xl text-xl transition-colors"
          >
            Ok
          </button>
        </div>
      </div>
      )}

      <div className="grid grid-cols-[1fr_3px_1fr] flex-1">

        {/* Coluna Esquerda */}
        <div className="flex flex-col gap-20 p-16">

          {/* Dados Pessoais */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[#0097b2] font-bold text-3xl tracking-wide">DADOS PESSOAIS</h2>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-800 text-xl">Nome completo:</label>
              <input
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                placeholder="Nome completo"
                className="bg-blue-100 rounded-xl px-5 py-5 w-full outline-none text-gray-800 text-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-800 text-xl">Idade:</label>
              <input
                type="number"
                value={idade}
                onChange={(e) => setIdade(Number(e.target.value))}
                placeholder="Idade"
                className="bg-blue-100 rounded-xl px-5 py-5 w-36 outline-none text-gray-800 text-xl"
              />
            </div>
          </div>

          {/* Sintomas */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[#0097b2] font-bold text-3xl tracking-wide">SINTOMAS</h2>
            <p className="font-bold text-gray-800 text-xl">Quais são seus sintomas?</p>

            <div className="flex flex-wrap gap-4">
              {["Febre", "Vômito", "Falta de ar", "Tontura", "Dor de cabeça", "Dor no peito"].map((sintoma) => (
                <button
                  key={sintoma}
                  onClick={() => toggleSintoma(sintoma)}
                  className={sintomasSelecionados.includes(sintoma)
                    ? "bg-red-400 text-white rounded-xl px-6 py-4 text-xl transition-colors"
                    : "bg-white text-gray-800 rounded-xl px-6 py-4 text-xl transition-colors border border-gray-200"}
                >
                  {sintoma}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={outroSintoma}
              onChange={(e) => setOutroSintoma(e.target.value)}
              placeholder="Outro:"
              className={outroSintoma
                ? "bg-red-400 text-white rounded-xl px-5 py-5 w-full outline-none placeholder-white text-xl"
                : "bg-white text-gray-800 rounded-xl px-5 py-5 w-full outline-none border border-gray-200 text-xl"}
            />
          </div>

        </div>

        {/* Separador */}
        <div className="bg-[#00526e] my-10"></div>

        {/* Coluna Direita */}
        <div className="flex flex-col gap-16 p-16">

          {/* Nível de Dor */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[#0097b2] font-bold text-3xl tracking-wide">NÍVEL DE DOR</h2>
            <p className="font-bold text-gray-800 text-xl">Qual a intensidade da sua dor agora?</p>

            <div className="grid grid-cols-7 gap-4">
              {niveisDeDor.map((nivel) => (
                <button
                  key={nivel}
                  onClick={() => selecionarNivelDor(nivel)}
                  className={nivelDor === nivel
                    ? "bg-red-400 text-white rounded-xl w-16 h-16 font-bold text-xl transition-colors"
                    : "bg-white text-gray-800 rounded-xl w-16 h-16 font-bold text-xl transition-colors border border-gray-200"}
                >
                  {nivel}
                </button>
              ))}
            </div>
          </div>

         {/* Botão Enviar */}
          <div className="flex justify-center">
            <button
              onClick={lidarComEnvio}
              className="bg-[#0097b2] hover:bg-cyan-800 text-white font-bold px-24 py-6 rounded-xl text-2xl transition-colors"
            >
              Enviar
            </button>
          </div>

          {/* Caixa de Atenção */}
          <div className="bg-[#fffcc0] border border-yellow-300 rounded-xl p-8 mt-6">
            <p className="text-yellow-700 font-bold text-2xl mb-3">ATENÇÃO:</p>
            <p className="text-yellow-700 text-xl">
              Se você estiver em <span className="underline">risco imediato de vida</span>,
              informe a recepção diretamente sem aguardar a triagem.
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}