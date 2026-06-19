import Link from "next/link";


export default function Home() {
  return (
    <main>
      <h1>Bem-vindo ao sistema de triagem hospitalar!</h1>
      <p>Clique no botão abaixo para iniciar seu atendimento.</p>
      <Link href="/formulario">
        <button>Iniciar</button>
      </Link>
    </main>
  );
}