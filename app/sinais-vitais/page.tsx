"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SinaisVitaisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id");

  const [systolicPressure, setSystolicPressure] = useState<number | string>("");
  const [diastolicPressure, setDiastolicPressure] = useState<number | string>("");
  const [heartRate, setHeartRate] = useState<number | string>("");
  const [temperature, setTemperature] = useState<number | string>("");
  const [oxygenSaturation, setOxygenSaturation] = useState<number | string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) {
        router.push("/formulario");
    }
  }, [patientId, router]);

    function validateForm(): boolean {
        if (systolicPressure !== "" && (Number(systolicPressure) <= 0 || Number(systolicPressure) > 300)) {
            setError("Informe uma pressão sistólica válida.");
            return false;
        }
        if (diastolicPressure !== "" && (Number(diastolicPressure) <= 0 || Number(diastolicPressure) > 200)) {
            setError("Informe uma pressão diastólica válida.");
            return false;
        }
        if (heartRate !== "" && (Number(heartRate) <= 0 || Number(heartRate) > 300)) {
            setError("Informe uma frequência cardíaca válida.");
            return false;
        }
        if (temperature !== "" && (Number(temperature) <= 30 || Number(temperature) > 45)) {
            setError("Informe uma temperatura válida.");
            return false;
        }
        if (oxygenSaturation !== "" && (Number(oxygenSaturation) <= 0 || Number(oxygenSaturation) > 100)) {
            setError("Informe uma saturação de O2 válida.");
            return false;
        }
        setError("");
        return true;
    }

  function handleSubmit() {
    if (!validateForm()) return;

    const vitalSigns = {
    temperature: temperature !== "" ? Number(temperature) : null,
    systolic_pressure: systolicPressure !== "" ? Number(systolicPressure) : null,
    diastolic_pressure: diastolicPressure !== "" ? Number(diastolicPressure) : null,
    heart_rate: heartRate !== "" ? Number(heartRate) : null,
    oxygen_saturation: oxygenSaturation !== "" ? Number(oxygenSaturation) : null,
  };

    sessionStorage.setItem("patientId", patientId as string);
    sessionStorage.setItem("sinaisVitais", JSON.stringify(vitalSigns));
    router.push("/analisando");
  }

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
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

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 w-full max-w-2xl flex flex-col gap-6">
        <h2 className="text-[#0097b2] font-bold text-xl md:text-2xl tracking-wide text-center">
          SINAIS VITAIS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-800 text-sm md:text-base">
              Pressão sistólica (mmHg):
            </label>
            <input
              type="number"
              value={systolicPressure}
              onChange={(e) => setSystolicPressure(Number(e.target.value))}
              placeholder="Ex: 120"
              className="bg-blue-100 rounded-xl px-4 py-3 outline-none text-gray-800 text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-800 text-sm md:text-base">
              Pressão diastólica (mmHg):
            </label>
            <input
              type="number"
              value={diastolicPressure}
              onChange={(e) => setDiastolicPressure(Number(e.target.value))}
              placeholder="Ex: 80"
              className="bg-blue-100 rounded-xl px-4 py-3 outline-none text-gray-800 text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-800 text-sm md:text-base">
              Frequência cardíaca (bpm):
            </label>
            <input
              type="number"
              value={heartRate}
              onChange={(e) => setHeartRate(Number(e.target.value))}
              placeholder="Ex: 78"
              className="bg-blue-100 rounded-xl px-4 py-3 outline-none text-gray-800 text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-800 text-sm md:text-base">
              Temperatura (°C):
            </label>
            <input
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              placeholder="Ex: 36.5"
              className="bg-blue-100 rounded-xl px-4 py-3 outline-none text-gray-800 text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-800 text-sm md:text-base">
              Saturação de O2 (%):
            </label>
            <input
              type="number"
              value={oxygenSaturation}
              onChange={(e) => setOxygenSaturation(Number(e.target.value))}
              placeholder="Ex: 98"
              className="bg-blue-100 rounded-xl px-4 py-3 outline-none text-gray-800 text-sm md:text-base"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
        <button
            onClick={handleSubmit}
            className="bg-[#0097b2] hover:bg-cyan-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-12 py-4 rounded-xl text-lg transition-colors shadow-lg mt-2"
        >
            Confirmar
        </button>
        </div>
    </div> 
    </main>
  );
}

export default function SinaisVitais() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-100"></main>}>
      <SinaisVitaisContent />
    </Suspense>
  );
}