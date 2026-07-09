import Link from "next/link";
import { Hospital } from "lucide-react";


export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-10 overflow-hidden relative">
      

      <div className="border-4 border-[#0087b2] rounded-full p-4">
        <Hospital size={60} className="text-gray-800" />
      </div>

      <div className="absolute top-0 left-0 w-[500px] h-[400px] bg-[#dff0f4] rounded-full -translate-x-40 -translate-y-40">
      </div>

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-5xl font-bold text-center text-gray-800">Bem-vindo ao</h1>
        <h1 className="text-5xl font-bold text-center text-gray-800">Sistema de Triagem Inteligente</h1>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-2xl text-gray-800 text-center">Para iniciar, toque no botão abaixo.</p>
        <p className="text-2xl text-gray-800 text-center">Após o preenchimento das informações, você receberá sua posição na fila.</p>
      </div>

      <div className="absolute top-16 left-16 flex items-center gap-2">
        <div className="bg-[#0087b2] rounded-full w-10 h-10 flex items-center justify-center">
          <span className="text-white font-bold text-5xl">+</span>
        </div>
        <span className="text-black font-bold text-4xl">Triagem<span className="text-[#0087b2]">IA</span></span>
      </div>

      <Link href="/formulario" className = "mt-12">
        <button className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-20 py-6 rounded-xl text-3xl transition-colors">
          Iniciar Triagem
        </button>
      </Link>

      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#dff0f4] rounded-full translate-x-20 translate-y-20">
      </div>

    </main>
  );
}