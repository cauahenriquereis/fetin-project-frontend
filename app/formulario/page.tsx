"use client";

import { useState } from "react";

export default function Formulario() {
    const [nomeCompleto, setNomeCompleto] = useState("");
    return (
    <main>
        <h1>Formulário do Paciente</h1>
        <input
        type="text"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
        placeholder="Nome completo"
        />
    </main>
    );
}