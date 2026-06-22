import Link from "next/link";


export default function Home() {
  return (
    <main>
      <h1>Bem-vindo ao Sistema de Triagem Inteligente!</h1>
      <p>Para iniciar, clique no botão abaixo.</p>
      <Link href="/formulario">
        <button>Iniciar Triagem</button>
      </Link>
    </main>
  );
}