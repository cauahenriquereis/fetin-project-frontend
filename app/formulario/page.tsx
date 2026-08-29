"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {z} from "zod";

const emailSchema = z.object({
  email: z.string().email("Por favor, informe um e-mail válido."),
})

const fullNameSchema = z.string().min(2, "Por favor, informe um nome completo válido.").regex(/^[A-Za-zÀ-ÿ\s'-]+$/, "O nome não pode conter números ou símbolos.");

function validateFullName(fullName: string): boolean {
  try {
    fullNameSchema.parse(fullName); 
    return true;
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Erro de validação de nome completo:");
    }
    return false;
  }
}

function validateEmail(email: string): boolean {
  try {
    emailSchema.parse({ email }); 
    return true;
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Erro de validação de e-mail:");
    } 
  return false;
 }
}

export default function Formulario() {

  const router = useRouter();

  const painLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [fullName, setFullName] = useState("");
  const [email,setEmail] = useState("");
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

  function validateForm(): boolean {
    if (fullName.trim() === "") {
      setError("Por favor, preencha o nome completo.");
      return false;
    }
    if (validateFullName(fullName) === false) {
      setError("Por favor, informe um nome completo válido.");
      return false;
    }

    if(email.trim() !== "" && validateEmail(email) === false) {
      setError("Por favor, informe um e-mail válido.");
      return false;
    }

    if (Number(age) <= 0 || Number(age) > 120 ) {
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
      const finalSymptoms = [...selectedSymptoms, otherSymptom].filter(Boolean).join(", ");
      const triageData = {
        full_name: fullName,
        email: email,
        age: Number(age),
        symptoms: finalSymptoms,
        pain_level: painLevel,
      };
      sessionStorage.setItem("dadosTriagem", JSON.stringify(triageData));
      router.push("/analisando");
    }
  }

return (
    <main className="min-h-screen bg-slate-100 flex flex-col overflow-y-auto">

      {/* Error modal */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
          <div className="bg-white border-4 border-[#00526e] rounded-2xl p-6 xl:p-8 flex flex-col items-center gap-4 xl:gap-6 shadow-2xl max-w-md w-full pointer-events-auto">
            <p className="text-red-500 font-bold text-lg xl:text-xl text-center">{error}</p>
            <button
              onClick={() => setError("")}
              className="bg-red-500 hover:bg-red-700 text-white font-bold px-8 py-2 xl:py-3 rounded-xl text-base xl:text-lg transition-colors"
            >
              Ok
            </button>
          </div>
        </div>
      )}

      {/* Single column on mobile/tablet, two columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3px_1fr] flex-1 min-h-0">

        {/* Left column — personal data and symptoms */}
        <div className="flex flex-col gap-6 md:gap-10 lg:gap-1 lg:justify-evenly p-6 md:p-10 lg:p-8 xl:p-12 lg:h-full">

          {/* Personal data section */}
          <div className="flex flex-col gap-3 md:gap-5 xl:gap-6">
            <h2 className="text-[#0097b2] font-bold text-xl md:text-2xl lg:text-2xl xl:text-3xl tracking-wide">DADOS PESSOAIS</h2>

            <div className="flex flex-col gap-1 md:gap-2">
              <label className="font-bold text-gray-800 text-sm md:text-lg lg:text-base xl:text-xl">Nome completo:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nome completo"
                className="bg-blue-100 rounded-xl px-4 py-3 md:py-4 lg:py-3 xl:py-5 w-full outline-none text-gray-800 text-sm md:text-lg lg:text-base xl:text-xl"
              />
            </div>

            <div className="flex flex-col gap-1 md:gap-2">  
              <label className="font-bold text-gray-800 text-sm md:text-lg lg:text-base xl:text-xl">
                E-mail: <span className="font-normal text-gray-500">(opcional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-blue-100 rounded-xl px-4 py-3 md:py-4 lg:py-3 xl:py-5 w-full outline-none text-gray-800 text-sm md:text-lg lg:text-base xl:text-xl"
              />
            </div>  

            <div className="flex flex-col gap-1 md:gap-2">
              <label className="font-bold text-gray-800 text-sm md:text-lg lg:text-base xl:text-xl">Idade:</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="Idade"
                className="bg-blue-100 rounded-xl px-4 py-3 md:py-4 lg:py-3 xl:py-5 w-24 md:w-36 lg:w-32 xl:w-40 outline-none text-gray-800 text-sm md:text-lg lg:text-base xl:text-xl"
              />
            </div>
          </div>

          {/* Symptoms section */}
          <div className="flex flex-col gap-3 md:gap-5 xl:gap-6">
            <h2 className="text-[#0097b2] font-bold text-xl md:text-2xl lg:text-2xl xl:text-3xl tracking-wide mt-4 lg:mt-0">SINTOMAS</h2>
            <p className="font-bold text-gray-800 text-sm md:text-lg lg:text-base xl:text-xl">Quais são seus sintomas?</p>

            <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-3 xl:gap-5">
              {["Febre", "Vômito", "Falta de ar", "Tontura", "Dor de cabeça", "Dor no peito"].map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={selectedSymptoms.includes(symptom)
                    ? "bg-red-400 text-white rounded-xl px-4 py-2 md:px-6 md:py-3 lg:px-4 lg:py-3 xl:px-8 xl:py-5 text-sm md:text-lg lg:text-base xl:text-xl transition-colors"
                    : "bg-white text-gray-800 rounded-xl px-4 py-2 md:px-6 md:py-3 lg:px-4 lg:py-3 xl:px-8 xl:py-5 text-sm md:text-lg lg:text-base xl:text-xl transition-colors border border-gray-200"}
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
                ? "bg-red-400 text-white rounded-xl px-4 py-3 md:py-4 lg:py-3 xl:py-5 w-full outline-none placeholder-white text-sm md:text-lg lg:text-base xl:text-xl"
                : "bg-white text-gray-800 rounded-xl px-4 py-3 md:py-4 lg:py-3 xl:py-5 w-full outline-none border border-gray-200 text-sm md:text-lg lg:text-base xl:text-xl"}
            />
          </div>

        </div>

        {/* Vertical divider — hidden on mobile/tablet, visible on desktop */}
        <div className="hidden lg:block bg-[#00526e] my-8 xl:my-16"></div>

        {/* Horizontal divider — visible on mobile/tablet only */}
        <div className="block lg:hidden h-[3px] bg-[#00526e] mx-6 my-4 md:my-8"></div>

        {/* Right column — pain level, submit and warning */}
        <div className="flex flex-col gap-6 md:gap-10 lg:gap-6 lg:justify-evenly p-6 md:p-10 lg:p-8 xl:p-12 lg:h-full">

        {/* Pain level section */}
          <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
            <h2 className="text-[#0097b2] font-bold text-xl md:text-2xl lg:text-3xl tracking-wide">NÍVEL DE DOR</h2>
            <p className="font-bold text-gray-800 text-sm md:text-lg lg:text-xl">Qual a intensidade da sua dor agora?</p>

            <div className="grid grid-cols-7 gap-2 md:gap-4 lg:gap-5">
              {painLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setPainLevel(level)}
                  className={painLevel === level
                    ? "bg-red-400 text-white rounded-xl w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 font-bold text-base md:text-xl lg:text-xl xl:text-2xl transition-colors"
                    : "bg-white text-gray-800 rounded-xl w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 font-bold text-base md:text-xl lg:text-xl xl:text-2xl transition-colors border border-gray-200"}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>   

          {/* Submit button */}
          <div className="flex justify-center mt-4 lg:mt-0">
            <button
              onClick={handleSubmit}
              className="bg-[#0097b2] hover:bg-cyan-800 text-white font-bold px-12 py-4 md:px-16 md:py-5 lg:px-20 lg:py-5 xl:px-32 xl:py-7 rounded-xl text-lg md:text-2xl lg:text-xl xl:text-3xl transition-colors shadow-lg w-full md:w-auto"
            >
              Enviar
            </button>
          </div>

          {/* Warning box */}
          <div className="bg-[#fffcc0] border border-yellow-300 rounded-xl p-4 md:p-8 lg:p-6 xl:p-10 mt-4 lg:mt-0">
            <p className="text-yellow-700 font-bold text-base md:text-xl lg:text-lg xl:text-2xl mb-1 md:mb-3 xl:mb-4">ATENÇÃO:</p>
            <p className="text-yellow-700 text-sm md:text-lg lg:text-base xl:text-xl leading-relaxed">
              Se você estiver em <span className="underline">risco imediato de vida</span>,
              informe a recepção diretamente sem aguardar a triagem.
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}