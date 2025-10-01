// src/pages/LoginPage.tsx
import LogoTower from "../assets/logo-3.png";
import FundoTower from "../assets/tela de fundo 3.png";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage: React.FC = () => {
  const { isAuthenticated, signIn, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn({ email, password }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
      toast.success("Login realizado com sucesso!");
    } catch (err: any) {
      const errorMessage = err.message || "E-mail ou senha inválidos";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${FundoTower})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md">
       {/* Logo */}
<div className="text-center mb-0">
  <img src={LogoTower} alt="Tower Logo" className="mx-auto h-35"/>
</div>


        {/* Card de login com neon */}
        <div
          className="bg-black/80 border border-blue-500/40 rounded-xl p-8"
          style={{
            boxShadow:
              "0 0 6px rgba(37, 99, 235, 0.35), 0 0 12px rgba(30, 64, 175, 0.25)",
            animation: "neonPulse 6s infinite alternate",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-6">
              <h2 className="text-white text-2xl font-semibold mb-2">
                Bem-vindo de volta
              </h2>
              <p className="text-gray-400 text-sm">
                Entre na sua conta para continuar
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <div className="space-y-4 mb-6">
              {/* E-mail */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Link para cadastro */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-blue-400 cursor-pointer hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            ©2025 Estrategos | Todos os direitos reservados
          </p>
        </div>
      </div>

      {/* Estilo do neonPulse */}
      <style>
        {`
          @keyframes neonPulse {
            from {
              box-shadow: 0 0 6px rgba(37, 99, 235, 0.35), 0 0 12px rgba(30, 64, 175, 0.25);
            }
            to {
              box-shadow: 0 0 8px rgba(37, 99, 235, 0.45), 0 0 14px rgba(30, 64, 175, 0.35);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
