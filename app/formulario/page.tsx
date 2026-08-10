"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Formulario() {

  const router = useRouter();

  // Available pain levels displayed as buttons
  const painLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState("");
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Toggles a symptom on/off in the selected symptoms list
  function toggleSymptom(symptom: string) {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  }

  // Sets the selected pain level
  function selectPainLevel(level: number) {
    setPainLevel(level);
  }

  // Validates all required fields before submission
  // Returns false and sets error message if any field is missing
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

  // Handles form submission — saves triage data to sessionStorage and navigates to analysis screen
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
    <main className="min-h-screen bg-slate-100 flex flex-col">

      {/* Error modal — shown when form validation fails */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white border-4 border-[#00526e] rounded-2xl p-10 flex flex-col items-center gap-6 shadow-2xl max-w-md w-full mx-4 pointer-events-auto">
            <p className="text-red-500 font-bold text-2xl text-center">{error}</p>
            <button
              onClick={() => setError("")}
              className="bg-red-500 hover:bg-red-700 text-white font-bold px-10 py-3 rounded-xl text-xl transition-colors"
            >
              Ok
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-[1fr_3px_1fr] flex-1">

        {/* Left column — personal data and symptoms */}
        <div className="flex flex-col gap-16 p-12 lg:p-16">

          {/* Personal data section */}
          <div className="flex flex-col gap-8">
            <h2 className="text-[#0097b2] font-bold text-3xl tracking-wide">DADOS PESSOAIS</h2>

            <div className="flex flex-col gap-3">
              <label className="font-bold text-gray-800 text-xl">Nome completo:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nome completo"
                className="bg-blue-100 rounded-xl px-6 py-6 w-full outline-none text-gray-800 text-xl"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-bold text-gray-800 text-xl">Idade:</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="Idade"
                className="bg-blue-100 rounded-xl px-6 py-6 w-40 outline-none text-gray-800 text-xl"
              />
            </div>
          </div>

          {/* Symptoms section — toggle buttons + free text field */}
          <div className="flex flex-col gap-8">
            <h2 className="text-[#0097b2] font-bold text-3xl tracking-wide">SINTOMAS</h2>
            <p className="font-bold text-gray-800 text-xl">Quais são seus sintomas?</p>

            <div className="flex flex-wrap gap-5">
              {["Febre", "Vômito", "Falta de ar", "Tontura", "Dor de cabeça", "Dor no peito"].map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={selectedSymptoms.includes(symptom)
                    ? "bg-red-400 text-white rounded-xl px-8 py-5 text-xl transition-colors"
                    : "bg-white text-gray-800 rounded-xl px-8 py-5 text-xl transition-colors border border-gray-200"}
                >
                  {symptom}
                </button>
              ))}
            </div>

            {/* Free text field for symptoms not listed above */}
            <input
              type="text"
              value={otherSymptom}
              onChange={(e) => setOtherSymptom(e.target.value)}
              placeholder="Outro:"
              className={otherSymptom
                ? "bg-red-400 text-white rounded-xl px-6 py-6 w-full outline-none placeholder-white text-xl mt-2"
                : "bg-white text-gray-800 rounded-xl px-6 py-6 w-full outline-none border border-gray-200 text-xl mt-2"}
            />
          </div>

        </div>

        {/* Vertical divider */}
        <div className="bg-[#00526e] my-12 lg:my-16"></div>

        {/* Right column — pain level, submit button and warning */}
        <div className="flex flex-col gap-16 p-12 lg:p-16 h-full">

          {/* Pain level section — numeric buttons 1 to 10 */}
          <div className="flex flex-col gap-8">
            <h2 className="text-[#0097b2] font-bold text-3xl tracking-wide">NÍVEL DE DOR</h2>
            <p className="font-bold text-gray-800 text-xl">Qual a intensidade da sua dor agora?</p>

            <div className="grid grid-cols-7 gap-5">
              {painLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => selectPainLevel(level)}
                  className={painLevel === level
                    ? "bg-red-400 text-white rounded-xl w-20 h-20 font-bold text-2xl transition-colors"
                    : "bg-white text-gray-800 rounded-xl w-20 h-20 font-bold text-2xl transition-colors border border-gray-200"}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button — triggers validation and saves data to sessionStorage */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              className="bg-[#0097b2] hover:bg-cyan-800 text-white font-bold px-32 py-7 rounded-xl text-3xl transition-colors shadow-lg"
            >
              Enviar
            </button>
          </div>

          {/* Warning box — displayed at all times to alert critical cases */}
          <div className="bg-[#fffcc0] border border-yellow-300 rounded-xl p-12 mt-19 mb-8">
            <p className="text-yellow-700 font-bold text-2xl mb-4">ATENÇÃO:</p>
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