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

type RemovalMessage = {
  mensagem: string;
};

// Union type to handle all possible response types from the doctor endpoints
type DoctorData = PatientOutput | PatientOutput[] | RemovalMessage | null;

type Tokens = {
  access_token: string;
  refresh_token: string;
};

export default function Medico() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [typedPassword, setTypedPassword] = useState("");
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Prevents login screen flash while checking sessionStorage on mount
  const [checkingSession, setCheckingSession] = useState(true);

  // Controls which action screen is currently shown (null = main menu)
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [typedId, setTypedId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("aguardando");

  const [data, setData] = useState<DoctorData>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restores session from sessionStorage on page load
  // Session expires when the tab is closed (sessionStorage behavior)
  useEffect(() => {
    const storedTokens = sessionStorage.getItem("medico_tokens");
    if (storedTokens) {
      const parsedTokens = JSON.parse(storedTokens);
      setTokens(parsedTokens);
      setIsLoggedIn(true);
    }
    setCheckingSession(false);
  }, []);

  // Authenticates the doctor with the backend and stores JWT tokens in sessionStorage
  async function handleLogin() {
    setLoadingLogin(true);
    setLoginError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/doctor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha: typedPassword }),
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer login. Tente novamente.");
      }

      const responseData = await response.json();

      const tokensToSave: Tokens = {
        access_token: responseData.access_token,
        refresh_token: responseData.refresh_token,
      };

      sessionStorage.setItem("medico_tokens", JSON.stringify(tokensToSave));
      setTokens(tokensToSave);
      setIsLoggedIn(true);
      setTypedPassword("");
      setLoadingLogin(false);

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setLoadingLogin(false);
      setLoginError("Erro ao fazer login. Tente novamente.");
    }
  }

  // Uses the refresh token to obtain a new access token when the current one expires (401)
  // Calls logout() if the refresh token is also invalid
  async function refreshToken() {
    if (!tokens) return null;

    try {
      const response = await fetch("http://127.0.0.1:8000/doctor/refresh", {
        method: "GET",
        headers: { "Authorization": `Bearer ${tokens.refresh_token}` },
      });

      if (!response.ok) {
        throw new Error("Erro ao refrescar tokens");
      }

      const responseData = await response.json();
      const updatedTokens: Tokens = {
        access_token: responseData.access_token,
        refresh_token: tokens.refresh_token,
      };

      sessionStorage.setItem("medico_tokens", JSON.stringify(updatedTokens));
      setTokens(updatedTokens);
      return updatedTokens;

    } catch (error) {
      console.error("Erro ao refrescar token:", error);
      logout();
      return null;
    }
  }

  // Clears all session data and returns the doctor to the login screen
  function logout() {
    sessionStorage.removeItem("medico_tokens");
    setTokens(null);
    setIsLoggedIn(false);
    setActiveAction(null);
    setTypedId("");
    setData(null);
    setError(null);
    setTypedPassword("");
  }

  // Wrapper around fetch that injects the Authorization header
  // Automatically attempts token refresh on 401 and retries the request
  async function fetchWithAuth(url: string, options: RequestInit = {}) {
    if (!tokens) {
      throw new Error("Sem tokens de autenticação");
    }

    const headersWithAuth = {
      ...options.headers,
      "Authorization": `Bearer ${tokens.access_token}`,
    };

    let response = await fetch(url, { ...options, headers: headersWithAuth });

    if (response.status === 401) {
      const freshTokens = await refreshToken();
      if (!freshTokens) {
        throw new Error("Não foi possível renovar a sessão");
      }

      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Authorization": `Bearer ${freshTokens.access_token}`,
        },
      });
    }

    return response;
  }

  // Fetches all patients currently in the queue, ordered by priority
  async function fetchOrderedQueue() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`http://127.0.0.1:8000/queue/status`);
      if (!response.ok) {
        throw new Error("Erro ao buscar dados da fila");
      }

      const queueData = await response.json();
      setData(queueData);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao buscar dados da fila:", error);
      setLoading(false);
      setError("Erro ao buscar dados da fila");
    }
  }

  // Fetches the next patient to be attended (highest priority in queue)
  async function fetchNextPatient() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`http://127.0.0.1:8000/queue/next/`);
      if (!response.ok) {
        throw new Error("Erro ao buscar próximo paciente da fila");
      }

      const nextPatientData = await response.json();
      setData(nextPatientData);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao buscar próximo paciente da fila:", error);
      setLoading(false);
      setError("Erro ao buscar próximo paciente da fila");
    }
  }

  // Fetches the current status and queue info of a specific patient by ID
  async function fetchPatientStatus(id: number) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`http://127.0.0.1:8000/queue/status/${id}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar status do paciente");
      }

      const patientStatusData = await response.json();
      setData(patientStatusData);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao buscar status do paciente:", error);
      setLoading(false);
      setError("Erro ao buscar status do paciente");
    }
  }

  // Updates the attendance status of a patient (aguardando / em atendimento / atendido)
  async function updatePatientStatus(id: number, status: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`http://127.0.0.1:8000/queue/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_status: status }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status do paciente");
      }

      const updatedData = await response.json();
      setData(updatedData);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao atualizar status do paciente:", error);
      setLoading(false);
      setError("Erro ao atualizar status do paciente");
    }
  }

  // Removes a patient from the queue by ID
  async function removePatient(id: number) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`http://127.0.0.1:8000/queue/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao remover paciente");
      }

      const removedData = await response.json();
      setData(removedData);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao remover paciente:", error);
      setLoading(false);
      setError("Erro ao remover paciente");
    }
  }

  // Renders the correct UI based on the type of data received from the backend
  // Handles: removal message, array of patients, or single patient object
  function renderInfo(info: DoctorData) {
    if (!info) return <p>Nenhum dado encontrado</p>;

    if ('mensagem' in info) {
      return <p>{info.mensagem}</p>;
    }

    if (Array.isArray(info)) {
      if (info.length === 0) return <p>Fila vazia</p>;
      return (
        <ul>
          {info.map((patient) => (
            <li key={patient.id}>
              ID: {patient.id} — {patient.full_name} — {patient.urgency_level} — status: {patient.status}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div>
        <p>ID: {info.id}</p>
        <p>Nome: {info.full_name}</p>
        <p>Idade: {info.age}</p>
        <p>Urgência: {info.urgency_level}</p>
        <p>Status: {info.status}</p>
      </div>
    );
  }

  // Reusable result display — shows loading, error or data depending on current state
  const resultDisplay = (
    <>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {data && !loading && !error && renderInfo(data)}
    </>
  );

  // Resets all action-related state and returns to the main menu
  function backToMenu() {
    setActiveAction(null);
    setTypedId("");
    setData(null);
    setError(null);
  }

  // Validates the typed ID and dispatches the correct action function
  function confirmAction() {
    if (!typedId || Number(typedId) <= 0) {
      setError("Por favor, digite um ID válido");
      return;
    }

    const id = Number(typedId);

    if (activeAction === "status") fetchPatientStatus(id);
    else if (activeAction === "atualizar") updatePatientStatus(id, selectedStatus);
    else if (activeAction === "remover") removePatient(id);
  }

  // Reusable header component rendered across all doctor panel screens
  const panelHeader = (
    <header className="bg-[#00526d] flex items-center px-10 py-6">
      <div className="flex items-center gap-4">
        <div className="bg-[#0087b2] rounded-full w-12 h-12 flex items-center justify-center">
          <span className="text-white font-bold text-5xl">+</span>
        </div>
        <span className="text-white font-bold text-3xl">Triagem<span className="text-[#00c2e0]">IA</span></span>
        <div className="bg-[#009bb6] rounded-full px-7 py-2 ml-2">
          <span className="text-white font-semibold text-lg">Painel Médico</span>
        </div>
      </div>
    </header>
  );

  // Renders blank screen while checking sessionStorage to avoid login flash
  if (checkingSession) return null;

  // Login screen — shown when no valid session is found in sessionStorage
  if (!isLoggedIn) {
  return (
    <main className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      {panelHeader}
      <div className="flex flex-col flex-1 items-center justify-center gap-8">
        <div className="border-4 border-[#0087b2] rounded-full p-4">
          <Hospital size={80} className="text-gray-800" />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center gap-6 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800">Painel do Médico</h1>
          <p className="text-lg text-gray-800">Digite a senha para acessar</p>
          <input
            type="password"
            value={typedPassword}
            onChange={(e) => setTypedPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Senha"
            className="bg-slate-100 rounded-xl px-5 py-4 w-full outline-none text-gray-800 text-lg border border-gray-200"
          />
          <button
            disabled={loadingLogin}
            onClick={handleLogin}
            className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-12 py-4 rounded-xl text-xl transition-colors w-full disabled:opacity-50"
          >
            {loadingLogin ? "Entrando..." : "Entrar"}
          </button>
          {loginError && <p className="text-red-500 font-semibold text-lg text-center">{loginError}</p>}
        </div>
      </div>
    </main>
  );
}

  // Main menu screen — shown after successful login
 if (!activeAction) {
  return (
    <main className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      {panelHeader}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <div className="bg-[#ebf1f9] rounded-3xl p-6 lg:p-10 flex flex-col items-center gap-3 lg:gap-5 w-full max-w-2xl">
          <h1 className="text-2xl lg:text-4xl font-bold text-[#00526d] mb-2 lg:mb-4 tracking-wide">MENU MÉDICO</h1>
          <button
            onClick={() => { setActiveAction("fila"); fetchOrderedQueue(); }}
            className="bg-white hover:bg-slate-200 text-gray-700 font-semibold px-8 py-3 lg:py-5 rounded-full text-lg lg:text-2xl transition-colors w-full border-3 border-gray-300 shadow-sm"
          >
            Buscar Fila Ordenada
          </button>
          <button
            onClick={() => { setActiveAction("proximo"); fetchNextPatient(); }}
            className="bg-white hover:bg-slate-200 text-gray-700 font-semibold px-8 py-3 lg:py-5 rounded-full text-lg lg:text-2xl transition-colors w-full border-3 border-gray-300 shadow-sm"
          >
            Buscar Próximo Paciente
          </button>
          <button
            onClick={() => setActiveAction("status")}
            className="bg-white hover:bg-slate-200 text-gray-700 font-semibold px-8 py-3 lg:py-5 rounded-full text-lg lg:text-2xl transition-colors w-full border-3 border-gray-300 shadow-sm"
          >
            Buscar Status Paciente
          </button>
          <button
            onClick={() => setActiveAction("atualizar")}
            className="bg-white hover:bg-slate-200 text-gray-700 font-semibold px-8 py-3 lg:py-5 rounded-full text-lg lg:text-2xl transition-colors w-full border-3 border-gray-300 shadow-sm"
          >
            Atualizar Status Paciente
          </button>
          <button
            onClick={() => setActiveAction("remover")}
            className="bg-white hover:bg-slate-200 text-gray-700 font-semibold px-8 py-3 lg:py-5 rounded-full text-lg lg:text-2xl transition-colors w-full border-3 border-gray-300 shadow-sm"
          >
            Remover Paciente
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold px-8 py-3 lg:py-5 rounded-full text-lg lg:text-2xl transition-colors border-3 border-red-900 w-full mt-2"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </main>
  );
}

  // Result screen — shown for actions that don't require input (queue / next patient)
  if (activeAction === "fila" || activeAction === "proximo") {
  return (
    <main className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      {panelHeader}
      <div className="flex flex-col flex-1 items-center justify-between p-8">

        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-3xl overflow-y-auto max-h-[70vh]">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {activeAction === "fila" ? "Fila Ordenada" : "Próximo Paciente"}
          </h2>
          <div className="text-gray-800 text-lg">
            {resultDisplay}
          </div>
        </div>

        <button
          onClick={backToMenu}
          className="bg-slate-400 hover:bg-slate-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors w-full max-w-lg mt-6"
        >
          Voltar ao Menu
        </button>

      </div>
    </main>
  );
}

  // Input screen — shown for actions that require a patient ID (status / update / remove)
  return (
  <main className="h-screen bg-slate-100 flex flex-col overflow-hidden">
    {panelHeader}
    <div className="flex flex-col flex-1 items-center justify-between p-8">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {activeAction === "status" && "Buscar Status do Paciente"}
          {activeAction === "atualizar" && "Atualizar Status do Paciente"}
          {activeAction === "remover" && "Remover Paciente"}
        </h2>
        <input
          type="number"
          value={typedId}
          onChange={(e) => setTypedId(e.target.value)}
          placeholder="ID do paciente"
          className="bg-slate-100 rounded-xl px-5 py-4 w-full outline-none text-gray-800 text-lg border border-gray-200"
        />
        {activeAction === "atualizar" && (
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-100 rounded-xl px-5 py-4 w-full outline-none text-gray-800 text-lg border border-gray-200"
          >
            <option value="aguardando">Aguardando</option>
            <option value="em atendimento">Em atendimento</option>
            <option value="atendido">Atendido</option>
          </select>
        )}
        <button
          disabled={loading}
          onClick={confirmAction}
          className="bg-[#0087b2] hover:bg-[#00526d] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors w-full disabled:opacity-50"
        >
          Confirmar
        </button>
        <div className="text-gray-800 text-lg">
          {resultDisplay}
        </div>
      </div>
      <button
        onClick={backToMenu}
        className="bg-slate-400 hover:bg-slate-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors w-full max-w-lg mt-6"
      >
        Voltar ao Menu
      </button>
    </div>
  </main>
);
}