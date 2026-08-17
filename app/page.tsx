import Link from "next/link";
import { Hospital } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-6 sm:gap-8 lg:gap-10 overflow-hidden relative px-4 py-8">

      {/* Top-left decorative circle */}
      <div className="absolute top-0 left-0 w-[250px] h-[200px] sm:w-[350px] sm:h-[300px] lg:w-[500px] lg:h-[400px] bg-[#dff0f4] rounded-full -translate-x-20 -translate-y-20 sm:-translate-x-28 sm:-translate-y-28 lg:-translate-x-40 lg:-translate-y-40"></div>

      {/* Bottom-right decorative circle */}
      <div className="absolute bottom-0 right-0 w-[280px] h-[250px] sm:w-[400px] sm:h-[350px] lg:w-[550px] lg:h-[500px] bg-[#dff0f4] rounded-full translate-x-20 translate-y-20 sm:translate-x-28 sm:translate-y-28 lg:translate-x-35 lg:translate-y-35"></div>

      {/* Top-left logo */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10 lg:top-16 lg:left-16 flex items-center gap-2 z-10">
        <div className="bg-[#0087b2] rounded-full w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex items-center justify-center">
          <span className="text-white font-bold text-3xl sm:text-4xl lg:text-5xl">+</span>
        </div>
        <span className="text-black font-bold text-xl sm:text-2xl lg:text-4xl">Triagem<span className="text-[#0087b2]">IA</span></span>
      </div>

      {/* Hospital icon */}
      <div className="border-4 border-[#0087b2] rounded-full p-3 sm:p-4 z-10 mt-16 sm:mt-0">
        <Hospital size={50} className="text-gray-800 sm:hidden" />
        <Hospital size={65} className="text-gray-800 hidden sm:block lg:hidden" />
        <Hospital size={80} className="text-gray-800 hidden lg:block" />
      </div>

      {/* Welcome title */}
      <div className="flex flex-col items-center gap-1 sm:gap-2 z-10">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-center text-gray-800">Bem-vindo ao</h1>
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-center text-gray-800">Sistema de Triagem Inteligente</h1>
      </div>

      {/* Instructions */}
      <div className="flex flex-col items-center gap-1 z-10">
        <p className="text-base sm:text-lg lg:text-2xl text-gray-800 text-center">Para iniciar, toque no botão abaixo.</p>
        <p className="text-base sm:text-lg lg:text-2xl text-gray-800 text-center">Após o preenchimento das informações, você receberá sua senha.</p>
      </div>

      {/* Start triage button — navigates to the patient form */}
      <Link href="/formulario" className="mt-6 sm:mt-8 lg:mt-12 z-10">
        <button className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-10 py-4 sm:px-14 sm:py-5 lg:px-20 lg:py-6 rounded-xl text-lg sm:text-xl lg:text-3xl transition-colors">
          Iniciar Triagem
        </button>
      </Link>

    </main>
  );
}