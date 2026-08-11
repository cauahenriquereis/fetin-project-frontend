"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Formulario() {

  const router = useRouter();

  const painLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState("");
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [error, setError] = useState("");

  function toggleSymptom(symptom: string) {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  }

  function selectPainLevel(level: number) {
    setPainLevel(level);
  }

  function validateForm(): boolean {
    if (fullName.trim() === "") {
      setError("Por favor, preencha o nome completo.");
      return false;
    }
    if (Number(age) <= 0) {
      setError("Por favor, informe uma idade válida.");
      return false;
    }
    if (selectedSymptoms.length === 0 && otherSymptom.trim() === "") {
      setError("Selecione ao menos um sintoma.");
      return false;
    }
    if (painLevel === null) {
      setError("Selecione o nível de dor.");
      return false;
    }
    setError("");
    return true;
  }

  function handleSubmit() {
    if (validateForm()) {
      const finalSymptoms = [...selectedSymptoms, otherSymptom].filter(Boolean).join(",");
      const triageData = {
        full_name: fullName,
        age: Number(age),
        symptoms: finalSymptoms,
        pain_level: painLevel,
      };
      sessionStorage.setItem("dadosTriagem", JSON.stringify(triageData));
      router.push("/analisando");
    }
  }

  return (
    <main className="h-screen bg-slate-100 flex flex-col overflow-hidden">

      {/* Error modal */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white border-4 border-[#00526e] rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl max-w-md w-full mx-4 pointer-events-auto">
            <p className="text-red-500 font-bold text-xl text-center">{error}</p>
            <button
              onClick={() => setError("")}
              className="bg-red-500 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl text-lg transition-colors"
            >
              Ok
            </button>
          </div>
        </div>
      )}

      {/* Single column on mobile, two columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3px_1fr] flex-1">

        {/* Left column — personal data and symptoms */}
        <div className="flex flex-col justify-between p-6 lg:p-12">

          {/* Personal data section */}
          <div className="flex flex-col gap-4 lg:gap-8">
            <h2 className="text-[#0097b2] font-bold text-xl lg:text-3xl tracking-wide">DADOS PESSOAIS</h2>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-800 text-base lg:text-xl">Nome completo:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nome completo"
                className="bg-blue-100 rounded-xl px-4 py-3 lg:px-6 lg:py-6 w-full outline-none text-gray-800 text-base lg:text-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-800 text-base lg:text-xl">Idade:</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="Idade"
                className="bg-blue-100 rounded-xl px-4 py-3 lg:px-6 lg:py-6 w-28 lg:w-40 outline-none text-gray-800 text-base lg:text-xl"
              />
            </div>
          </div>

          {/* Symptoms section */}
          <div className="flex flex-col gap-4 lg:gap-8">
            <h2 className="text-[#0097b2] font-bold text-xl lg:text-3xl tracking-wide">SINTOMAS</h2>
            <p className="font-bold text-gray-800 text-base lg:text-xl">Quais são seus sintomas?</p>

            <div className="flex flex-wrap gap-3 lg:gap-5">
              {["Febre", "Vômito", "Falta de ar", "Tontura", "Dor de cabeça", "Dor no peito"].map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={selectedSymptoms.includes(symptom)
                    ? "bg-red-400 text-white rounded-xl px-4 py-2 lg:px-8 lg:py-5 text-base lg:text-xl transition-colors"
                    : "bg-white text-gray-800 rounded-xl px-4 py-2 lg:px-8 lg:py-5 text-base lg:text-xl transition-colors border border-gray-200"}
                >
                  {symptom}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={otherSymptom}
              onChange={(e) => setOtherSymptom(e.target.value)}
              placeholder="Outro:"
              className={otherSymptom
                ? "bg-red-400 text-white rounded-xl px-4 py-3 lg:px-6 lg:py-6 w-full outline-none placeholder-white text-base lg:text-xl"
                : "bg-white text-gray-800 rounded-xl px-4 py-3 lg:px-6 lg:py-6 w-full outline-none border border-gray-200 text-base lg:text-xl"}
            />
          </div>

        </div>

        {/* Vertical divider — hidden on mobile, visible on desktop */}
        <div className="hidden lg:block bg-[#00526e] my-16"></div>

        {/* Horizontal divider — visible on mobile only */}
        <div className="block lg:hidden h-[3px] bg-[#00526e] mx-6"></div>

        {/* Right column — pain level, submit and warning */}
        <div className="flex flex-col justify-between p-6 lg:p-12 h-full">

          {/* Pain level section */}
          <div className="flex flex-col gap-4 lg:gap-8">
            <h2 className="text-[#0097b2] font-bold text-xl lg:text-3xl tracking-wide">NÍVEL DE DOR</h2>
            <p className="font-bold text-gray-800 text-base lg:text-xl">Qual a intensidade da sua dor agora?</p>

            <div className="grid grid-cols-7 gap-2 lg:gap-5">
              {painLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => selectPainLevel(level)}
                  className={painLevel === level
                    ? "bg-red-400 text-white rounded-xl w-10 h-10 lg:w-20 lg:h-20 font-bold text-base lg:text-2xl transition-colors"
                    : "bg-white text-gray-800 rounded-xl w-10 h-10 lg:w-20 lg:h-20 font-bold text-base lg:text-2xl transition-colors border border-gray-200"}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-[#0097b2] hover:bg-cyan-800 text-white font-bold px-16 py-4 lg:px-32 lg:py-7 rounded-xl text-xl lg:text-3xl transition-colors shadow-lg"
            >
              Enviar
            </button>
          </div>

          {/* Warning box */}
          <div className="bg-[#fffcc0] border border-yellow-300 rounded-xl p-6 lg:p-12">
            <p className="text-yellow-700 font-bold text-lg lg:text-2xl mb-2 lg:mb-4">ATENÇÃO:</p>
            <p className="text-yellow-700 text-base lg:text-xl">
              Se você estiver em <span className="underline">risco imediato de vida</span>,
              informe a recepção diretamente sem aguardar a triagem.
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}