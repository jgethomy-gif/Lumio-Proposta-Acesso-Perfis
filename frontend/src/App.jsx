
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  Bus,
} from "lucide-react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [mensagem, setMensagem] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    if (!email || !senha) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    if (!aceitouTermos) {
      setMensagem("Você precisa aceitar os Termos de Uso e a LGPD.");
      return;
    }

    setMensagem("Interface pronta. A autenticação será conectada ao backend.");
  }

  return (
    <main className="lumio-page">
      <section className="login-container">
        <div className="login-brand">
          <div className="brand-icon">
            <Bus size={30} />
          </div>
          <h2>LUMIO</h2>
          <span>TRANSPORTE ESCOLAR</span>
        </div>

        <div className="login-heading">
          <h1>Bem-vindo ao Lumio!</h1>
          <p>Acesse sua conta para acompanhar sua jornada.</p>
        </div>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">E-mail</label>
          <div className="input-group">
            <Mail size={19} />
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label htmlFor="senha">Senha</label>
          <div className="input-group">
            <Lock size={19} />
            <input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button
              type="button"
              className="eye-button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              aria-label="Mostrar ou ocultar senha"
            >
              {mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <div className="forgot-link">
            <a href="#recuperar">Esqueceu sua senha?</a>
          </div>

          <label className="terms">
            <input
              type="checkbox"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
            />
            <span>
              Li e aceito os <a href="#termos">Termos de Uso</a> e a
              <a href="#lgpd"> Política de Privacidade (LGPD)</a>.
            </span>
          </label>

          <button type="submit" className="login-button">
            Entrar na minha conta
          </button>

          {mensagem && (
            <p className="feedback-message" role="status">
              {mensagem}
            </p>
          )}
        </form>

        <div className="separator">
          <span>ou continue com</span>
        </div>

        <button type="button" className="google-button">
          <strong>G</strong>
          Continuar com Google
        </button>

        <p className="register-link">
          Ainda não tem uma conta? <a href="#cadastro">Cadastre-se</a>
        </p>

        <div className="security-note">
          <ShieldCheck size={19} />
          <span>Seus dados são tratados com segurança.</span>
        </div>
      </section>

      <footer>
        © 2026 Lumio — Plataforma de Transporte Escolar
      </footer>
    </main>
  );
}

export default App;
