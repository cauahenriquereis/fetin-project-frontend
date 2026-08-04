"use client";
import { useState, useEffect } from "react";
import { Hospital } from "lucide-react";

type PatientOutput = {
  id: number;
  full_name: string;
  age: number;
  symptoms: string;
  pain_level: number;
  urgency_level: string;
  priority_number: number;
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
  const [verificandoSessao, setVerificandoSessao] = useState(true);


  const [acaoAtiva, setAcaoAtiva] = useState<string | null>(null);
  const [idDigitado, setIdDigitado] = useState("");
  const [statusEscolhido, setStatusEscolhido] = useState("aguardando");

  const [informacoes, setInformacoes] = useState<DadosMedico>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const tokensArmazenados = sessionStorage.getItem("medico_tokens");
    if (tokensArmazenados) {
      const tokensParsed = JSON.parse(tokensArmazenados);
      setTokens(tokensParsed);
      setLogado(true);
    }
    setVerificandoSessao(false);
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
        throw new Error("Erro ao fazer login. Tente novamente.");
      }

      const dados = await response.json();

      const tokensParaSalvar: Tokens = {
        access_token: dados.access_token,
        refresh_token: dados.refresh_token,
      };

      sessionStorage.setItem("medico_tokens", JSON.stringify(tokensParaSalvar));
      setTokens(tokensParaSalvar);
      setLogado(true);
      setSenhaDigitada("");
      setLoadingLogin(false);

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setLoadingLogin(false);
      setErroLogin("Erro ao fazer login. Tente novamente.");
    }
  }

  async function refrescarToken() {
    if (!tokens) return null;

    try {
      const response = await fetch("http://127.0.0.1:8000/doctor/refresh", {
        method: "GET",
        headers: { "Authorization": `Bearer ${tokens.refresh_token}` },
      });

      if (!response.ok) {
        throw new Error("Erro ao refrescar tokens");
      }

      const dados = await response.json();
      const tokensAtualizados: Tokens = {
        access_token: dados.access_token,
        refresh_token: tokens.refresh_token,
      };

      sessionStorage.setItem("medico_tokens", JSON.stringify(tokensAtualizados));
      setTokens(tokensAtualizados);
      return tokensAtualizados;

    } catch (error) {
      console.error("Erro ao refrescar token:", error);
      logout();
      return null;
    }
  }

  function logout() {
    sessionStorage.removeItem("medico_tokens");
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
      if (!response.ok) {
        throw new Error("Erro ao buscar dados da fila");
      }

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
      if (!response.ok) {
        throw new Error("Erro ao buscar próximo paciente da fila");
      }

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
      if (!response.ok) {
        throw new Error("Erro ao buscar status do paciente");
      }

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

      if (!response.ok) {
        throw new Error("Erro ao atualizar status do paciente");
      }

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

      if (!response.ok) {
        throw new Error("Erro ao remover paciente");
      }

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
              {paciente.full_name} — {paciente.urgency_level} — status: {paciente.status}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div>
        <p>Nome: {dados.full_name}</p>
        <p>Idade: {dados.age}</p>
        <p>Urgência: {dados.urgency_level}</p>
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
    else if (acaoAtiva === "atualizar") atualizarPacienteStatus(id, statusEscolhido);
    else if (acaoAtiva === "remover") removerPaciente(id);
  }

  if (verificandoSessao) {
  return null;
}

 if (!logado) {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-8 overflow-hidden relative">

      <div className="border-4 border-[#0087b2] rounded-full p-4">
        <Hospital size={80} className="text-gray-800" />
      </div>

      <div className="absolute top-0 left-0 w-[500px] h-[450px] bg-[#dff0f4] rounded-full -translate-x-40 -translate-y-40"></div>
      <div className="absolute bottom-0 right-0 w-[550px] h-[500px] bg-[#dff0f4] rounded-full translate-x-40 translate-y-40"></div>

      <div className="bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center gap-6 w-full max-w-md z-10">
        <h1 className="text-3xl font-bold text-gray-800">Painel do Médico</h1>
        <p className="text-lg text-gray-800">Digite a senha para acessar</p>

        <input
          type="password"
          value={senhaDigitada}
          onChange={(e) => setSenhaDigitada(e.target.value)}
          placeholder="Senha"
          className="bg-slate-100 rounded-xl px-5 py-4 w-full outline-none text-gray-800 text-lg border border-gray-200"
        />

        <button
          disabled={loadingLogin}
          onClick={fazerLogin}
          className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-12 py-4 rounded-xl text-xl transition-colors w-full disabled:opacity-50"
        >
          {loadingLogin ? "Entrando..." : "Entrar"}
        </button>

        {erroLogin && <p className="text-red-500 font-semibold text-lg text-center">{erroLogin}</p>}
      </div>
    </main>
  );
}

  if (!acaoAtiva) {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-8 overflow-hidden relative">

      <div className="absolute top-0 left-0 w-[500px] h-[450px] bg-[#dff0f4] rounded-full -translate-x-40 -translate-y-40"></div>
      <div className="absolute bottom-0 right-0 w-[550px] h-[500px] bg-[#dff0f4] rounded-full translate-x-40 translate-y-40"></div>

      <div className="bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center gap-4 w-full max-w-md z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Menu Médico</h1>

        <button
          onClick={() => { setAcaoAtiva("fila"); buscarFilaOrdenada(); }}
          className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors w-full"
        >
          Buscar Fila Ordenada
        </button>

        <button
          onClick={() => { setAcaoAtiva("proximo"); buscarProximoPaciente(); }}
          className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors w-full"
        >
          Buscar Próximo Paciente
        </button>

        <button
          onClick={() => setAcaoAtiva("status")}
          className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors w-full"
        >
          Buscar Status do Paciente
        </button>

        <button
          onClick={() => setAcaoAtiva("atualizar")}
          className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors w-full"
        >
          Atualizar Status do Paciente
        </button>

        <button
          onClick={() => setAcaoAtiva("remover")}
          className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors w-full"
        >
          Remover Paciente
        </button>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors w-full mt-4"
        >
          Logout
        </button>
      </div>

    </main>
  );
}

  if (acaoAtiva === "fila" || acaoAtiva === "proximo") {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-6 overflow-hidden relative p-8">

      <div className="absolute top-0 left-0 w-[500px] h-[450px] bg-[#dff0f4] rounded-full -translate-x-40 -translate-y-40"></div>
      <div className="absolute bottom-0 right-0 w-[550px] h-[500px] bg-[#dff0f4] rounded-full translate-x-40 translate-y-40"></div>

      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-3xl z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {acaoAtiva === "fila" ? "Fila Ordenada" : "Próximo Paciente"}
        </h2>

        {loading && <p className="text-gray-500 text-lg">Carregando...</p>}
        {erro && <p className="text-red-500 text-lg">{erro}</p>}
        {informacoes && !loading && !erro && (
          <div className="text-gray-800 text-lg">
            {exibirInformacoes(informacoes)}
          </div>
        )}
      </div>

      <button
        onClick={voltarAoMenu}
        className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors z-10"
      >
        Voltar ao Menu
      </button>

    </main>
  );
}

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-6 overflow-hidden relative p-8">

    <div className="absolute top-0 left-0 w-[500px] h-[450px] bg-[#dff0f4] rounded-full -translate-x-40 -translate-y-40"></div>
    <div className="absolute bottom-0 right-0 w-[550px] h-[500px] bg-[#dff0f4] rounded-full translate-x-40 translate-y-40"></div>

    <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg flex flex-col gap-6 z-10">
      <h2 className="text-2xl font-bold text-gray-800">
        {acaoAtiva === "status" && "Buscar Status do Paciente"}
        {acaoAtiva === "atualizar" && "Atualizar Status do Paciente"}
        {acaoAtiva === "remover" && "Remover Paciente"}
      </h2>

      <input
        type="number"
        value={idDigitado}
        onChange={(e) => setIdDigitado(e.target.value)}
        placeholder="ID do paciente"
        className="bg-slate-100 rounded-xl px-5 py-4 w-full outline-none text-gray-800 text-lg border border-gray-200"
      />

      {acaoAtiva === "atualizar" && (
        <select
          value={statusEscolhido}
          onChange={(e) => setStatusEscolhido(e.target.value)}
          className="bg-slate-100 rounded-xl px-5 py-4 w-full outline-none text-gray-800 text-lg border border-gray-200"
        >
          <option value="aguardando">Aguardando</option>
          <option value="em atendimento">Em atendimento</option>
          <option value="atendido">Atendido</option>
        </select>
      )}

      <button
        disabled={loading}
        onClick={confirmarAcao}
        className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors w-full disabled:opacity-50"
      >
        Confirmar
      </button>

      {loading && <p className="text-gray-500 text-lg text-center">Carregando...</p>}
      {erro && <p className="text-red-500 text-lg text-center">{erro}</p>}
      {informacoes && !loading && !erro && (
        <div className="text-gray-800 text-lg">
          {exibirInformacoes(informacoes)}
        </div>
      )}
    </div>

    <button
      onClick={voltarAoMenu}
      className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors z-10"
    >
      Voltar ao Menu
    </button>

  </main>
  );
}