// src/pages/RegisterPage.tsx
import LogoTower from "../assets/logo-tower.png";
import FundoTower from "../assets/fundo-tower.png";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUser, FaLock, FaBuilding, FaEnvelope } from "react-icons/fa";

const RegisterPage: React.FC = () => {
  const { isAuthenticated, register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    company: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      const msg = "As senhas não coincidem";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (formData.password.length < 6) {
      const msg = "A senha deve ter pelo menos 6 caracteres";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      await register({
        username: formData.fullname,
        email: formData.email,
        password: formData.password,
        company: formData.company,
        client_name: formData.fullname,
        client_email: formData.email
      } as any);

      toast.success("Conta criada com sucesso!");
      navigate("/planos");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar conta";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage: `url(${FundoTower})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo Tower */}
      <div className="mb-1">
        <img src={LogoTower} alt="Tower Logo" className="h-25 object-contain" />
      </div>

      {/* Balão do formulário */}
      <div className="w-full max-w-md">
        <div
          className="bg-black/80 border border-blue-900 rounded-xl p-8 relative"
          style={{
            boxShadow:
              "0 0 4px rgba(37, 99, 235, 0.25), 0 0 8px rgba(30, 64, 175, 0.20)",
            animation: "neonPulse 6s infinite alternate",
          }}
        >
          <div className="text-center mb-6">
            <h2 className="text-white text-2xl font-bold">Criar nova conta</h2>
            <p className="text-gray-400 text-sm">Comece sua jornada conosco</p>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome completo */}
            <div className="flex items-center bg-black border border-gray-700 rounded-lg px-3">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
                className="w-full bg-transparent py-3 text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Empresa */}
            <div className="flex items-center bg-black border border-gray-700 rounded-lg px-3">
              <FaBuilding className="text-gray-400 mr-3" />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="CNPJ da empresa"
                required
                className="w-full bg-transparent py-3 text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="flex items-center bg-black border border-gray-700 rounded-lg px-3">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="w-full bg-transparent py-3 text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Senha */}
            <div className="flex items-center bg-black border border-gray-700 rounded-lg px-3">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crie uma senha"
                required
                className="w-full bg-transparent py-3 text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Confirmar Senha */}
            <div className="flex items-center bg-black border border-gray-700 rounded-lg px-3">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                required
                className="w-full bg-transparent py-3 text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <Link
                to="/login"
                className="flex-1 bg-black text-white text-center py-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-all duration-200"
              >
                Voltar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Criando conta..." : "Escolher plano"}
              </button>
            </div>
          </form>
        </div>
        <p className="text-gray-500 text-xs text-center mt-6">
          ©2025 Estrategos | Todos os direitos reservados
        </p>
      </div>

      {/* Estilo do neonPulse */}
      <style>
        {`
          @keyframes neonPulse {
            from {
              box-shadow: 0 0 4px rgba(37, 99, 235, 0.25), 0 0 8px rgba(30, 64, 175, 0.20);
            }
            to {
              box-shadow: 0 0 6px rgba(37, 99, 235, 0.35), 0 0 12px rgba(30, 64, 175, 0.25);
            }
          }
        `}
      </style>
    </div>
  );
};

export default RegisterPage;
