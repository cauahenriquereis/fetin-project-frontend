"use client";
import { useState, useEffect } from "react";

type PatientOutput = {
  id: number;
  full_name: string;
  age: number;
  symptoms: string;
  pain_level: number;
  urgency_level: string | null;
  priority_number: number | null;
  status: string;
  created_at: string;
};

type MensagemRemocao = {
  mensagem: string;
};

type DadosMedico = PatientOutput | PatientOutput[] | MensagemRemocao | null;

type Tokens = {
  access_token: string;
  refresh_token: string;
};

export default function Medico() {

  const [logado, setLogado] = useState(false);
  const [senhaDigitada, setSenhaDigitada] = useState("");
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [erroLogin, setErroLogin] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [acaoAtiva, setAcaoAtiva] = useState<string | null>(null);
  const [idDigitado, setIdDigitado] = useState("");
  const [statusEscolhido, setStatusEscolhido] = useState("aguardando");

  const [informacoes, setInformacoes] = useState<DadosMedico>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const tokensArmazenados = localStorage.getItem("medico_tokens");
    if (tokensArmazenados) {
      const tokensParsed = JSON.parse(tokensArmazenados);
      setTokens(tokensParsed);
      setLogado(true);
    }
  }, []);

  async function fazerLogin() {
    setLoadingLogin(true);
    setErroLogin(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/doctor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha: senhaDigitada }),
      });

      if (!response.ok) {
        throw new Error("Senha incorreta");
      }

      const dados = await response.json();

      const tokensParaSalvar: Tokens = {
        access_token: dados.access_token,
        refresh_token: dados.refresh_token,
      };

      localStorage.setItem("medico_tokens", JSON.stringify(tokensParaSalvar));
      setTokens(tokensParaSalvar);
      setLogado(true);
      setSenhaDigitada("");
      setLoadingLogin(false);

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setLoadingLogin(false);
      setErroLogin("Senha incorreta");
    }
  }

  async function refrescarToken() {
    if (!tokens) return null;

    try {
      const response = await fetch("http://127.0.0.1:8000/doctor/refresh", {
        method: "GET",
        headers: { "Authorization": `Bearer ${tokens.refresh_token}` },
      });

      if (!response.ok) throw new Error("Erro ao refrescar token");

      const dados = await response.json();
      const tokensAtualizados: Tokens = {
        access_token: dados.access_token,
        refresh_token: tokens.refresh_token,
      };

      localStorage.setItem("medico_tokens", JSON.stringify(tokensAtualizados));
      setTokens(tokensAtualizados);
      return tokensAtualizados;

    } catch (error) {
      console.error("Erro ao refrescar token:", error);
      logout();
      return null;
    }
  }

  function logout() {
    localStorage.removeItem("medico_tokens");
    setTokens(null);
    setLogado(false);
    setAcaoAtiva(null);
    setIdDigitado("");
    setInformacoes(null);
    setErro(null);
    setSenhaDigitada("");
  }

  async function buscarComAutenticacao(url: string, options: RequestInit = {}) {
    if (!tokens) {
      throw new Error("Sem tokens de autenticação");
    }

    const headersComAuth = {
      ...options.headers,
      "Authorization": `Bearer ${tokens.access_token}`,
    };

    let response = await fetch(url, { ...options, headers: headersComAuth });

    if (response.status === 401) {
      const tokensFrescos = await refrescarToken();
      if (!tokensFrescos) {
        throw new Error("Não foi possível renovar a sessão");
      }

      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Authorization": `Bearer ${tokensFrescos.access_token}`,
        },
      });
    }

    return response;
  }

  async function buscarFilaOrdenada() {
    setLoading(true);
    setErro(null);

    try {
      const response = await buscarComAutenticacao(`http://127.0.0.1:8000/queue/status`);
      if (!response.ok) throw new Error("Erro ao buscar dados da fila");

      const dadosFila = await response.json();
      setInformacoes(dadosFila);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao buscar dados da fila:", error);
      setLoading(false);
      setErro("Erro ao buscar dados da fila");
    }
  }

  async function buscarProximoPaciente() {
    setLoading(true);
    setErro(null);

    try {
      const response = await buscarComAutenticacao(`http://127.0.0.1:8000/queue/next/`);
      if (!response.ok) throw new Error("Erro ao buscar próximo paciente da fila");

      const dadosProximoPaciente = await response.json();
      setInformacoes(dadosProximoPaciente);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao buscar próximo paciente da fila:", error);
      setLoading(false);
      setErro("Erro ao buscar próximo paciente da fila");
    }
  }

  async function pacienteStatus(id: number) {
    setLoading(true);
    setErro(null);

    try {
      const response = await buscarComAutenticacao(`http://127.0.0.1:8000/queue/status/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar status do paciente");

      const dadosStatusPaciente = await response.json();
      setInformacoes(dadosStatusPaciente);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao buscar status do paciente:", error);
      setLoading(false);
      setErro("Erro ao buscar status do paciente");
    }
  }

  async function atualizarPacienteStatus(id: number, status: string) {
    setLoading(true);
    setErro(null);

    try {
      const response = await buscarComAutenticacao(`http://127.0.0.1:8000/queue/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_status: status }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar status do paciente");

      const dadosAtualizados = await response.json();
      setInformacoes(dadosAtualizados);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao atualizar status do paciente:", error);
      setLoading(false);
      setErro("Erro ao atualizar status do paciente");
    }
  }

  async function removerPaciente(id: number) {
    setLoading(true);
    setErro(null);

    try {
      const response = await buscarComAutenticacao(`http://127.0.0.1:8000/queue/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover paciente");

      const dadosRemovidos = await response.json();
      setInformacoes(dadosRemovidos);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao remover paciente:", error);
      setLoading(false);
      setErro("Erro ao remover paciente");
    }
  }

  function exibirInformacoes(dados: DadosMedico) {
    if (!dados) return <p>Nenhum dado encontrado</p>;

    if ('mensagem' in dados) {
      return <p>{dados.mensagem}</p>;
    }

    if (Array.isArray(dados)) {
      if (dados.length === 0) return <p>Fila vazia</p>;
      return (
        <ul>
          {dados.map((paciente) => (
            <li key={paciente.id}>
              {paciente.full_name} — {paciente.urgency_level ?? "sem classificação"} — status: {paciente.status}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div>
        <p>Nome: {dados.full_name}</p>
        <p>Idade: {dados.age}</p>
        <p>Urgência: {dados.urgency_level ?? "sem classificação"}</p>
        <p>Status: {dados.status}</p>
      </div>
    );
  }

  const exibicaoResultado = (
    <>
      {loading && <p>Carregando...</p>}
      {erro && <p>Erro: {erro}</p>}
      {informacoes && !loading && !erro && exibirInformacoes(informacoes)}
    </>
  );

  function voltarAoMenu() {
    setAcaoAtiva(null);
    setIdDigitado("");
    setInformacoes(null);
    setErro(null);
  }

  function confirmarAcao() {
    if (!idDigitado || Number(idDigitado) <= 0) {
      setErro("Por favor, digite um ID válido");
      return;
    }

    const id = Number(idDigitado);

    if (acaoAtiva === "status") pacienteStatus(id);
    if (acaoAtiva === "atualizar") atualizarPacienteStatus(id, statusEscolhido);
    if (acaoAtiva === "remover") removerPaciente(id);
  }

  if (!logado) {
    return (
      <main>
        <h1>Painel do Médico</h1>
        <p>Digite a senha para acessar</p>

        <input
          type="password"
          value={senhaDigitada}
          onChange={(e) => setSenhaDigitada(e.target.value)}
          placeholder="Senha"
        />

        <button disabled={loadingLogin} onClick={fazerLogin}>
          {loadingLogin ? "Entrando..." : "Entrar"}
        </button>

        {erroLogin && <p style={{ color: "red" }}>Erro: {erroLogin}</p>}
      </main>
    );
  }

  if (!acaoAtiva) {
    return (
      <main>
        <h1>Painel do Médico</h1>
        <button onClick={() => { setAcaoAtiva("fila"); buscarFilaOrdenada(); }}>
          Buscar Fila Ordenada
        </button>
        <button onClick={() => { setAcaoAtiva("proximo"); buscarProximoPaciente(); }}>
          Buscar Próximo Paciente
        </button>
        <button onClick={() => setAcaoAtiva("status")}>Buscar Status do Paciente</button>
        <button onClick={() => setAcaoAtiva("atualizar")}>Atualizar Status do Paciente</button>
        <button onClick={() => setAcaoAtiva("remover")}>Remover Paciente</button>
        <button onClick={logout} style={{ backgroundColor: "red", color: "white" }}>Logout</button>
      </main>
    );
  }

  if (acaoAtiva === "fila" || acaoAtiva === "proximo") {
    return (
      <main>
        <button onClick={voltarAoMenu}>Voltar ao Menu</button>
        {exibicaoResultado}
      </main>
    );
  }

  return (
    <main>
      <input
        type="number"
        value={idDigitado}
        onChange={(e) => setIdDigitado(e.target.value)}
        placeholder="ID do paciente"
      />

      {acaoAtiva === "atualizar" && (
        <select value={statusEscolhido} onChange={(e) => setStatusEscolhido(e.target.value)}>
          <option value="aguardando">Aguardando</option>
          <option value="em atendimento">Em atendimento</option>
          <option value="atendido">Atendido</option>
        </select>
      )}

      <button disabled={loading} onClick={confirmarAcao}>
        Confirmar
      </button>
      <button onClick={voltarAoMenu}>Voltar ao Menu</button>

      {exibicaoResultado}
    </main>
  );
}