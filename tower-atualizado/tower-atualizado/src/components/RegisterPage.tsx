import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterPage: React.FC = () => {
  const { isAuthenticated, register, loading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    client_name: "",
    client_email: ""
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

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      toast.error("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        client_name: formData.client_name,
        client_email: formData.client_email
      });
      toast.success("Conta criada com sucesso!");
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao criar conta";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-blue-500 text-4xl font-bold mr-2">♜</div>
            <span className="text-white text-3xl font-bold">TOWER</span>
          </div>
        </div>

        <div className="bg-gray-900 border border-blue-500/30 rounded-lg p-8 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-6">
              <h2 className="text-white text-2xl font-semibold mb-2">
                Criar nova conta
              </h2>
              <p className="text-gray-400 text-sm">
                Preencha os dados para começar
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Nome de usuário</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Seu nome de usuário"
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">E-mail pessoal</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Senha</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Confirmar senha</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Digite a senha novamente"
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-gray-300 text-sm mb-3 font-medium">Dados da empresa/cliente</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Nome da empresa</label>
                    <input
                      type="text"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleChange}
                      placeholder="Nome da sua empresa"
                      required
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">E-mail da empresa</label>
                    <input
                      type="email"
                      name="client_email"
                      value={formData.client_email}
                      onChange={handleChange}
                      placeholder="contato@empresa.com"
                      required
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-blue-400 cursor-pointer hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            ©2025 Estratégicos | Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

