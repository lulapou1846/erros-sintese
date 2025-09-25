import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage: React.FC = () => {
  const { isAuthenticated, signIn, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn({ email, password }); 
      toast.success("Login realizado com sucesso!");
    } catch (err: any) {
      const errorMessage = err.message || "E-mail ou senha inválidos";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
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
              <div>
                <label className="block text-gray-300 text-sm mb-2">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
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

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-blue-400 cursor-pointer hover:underline">
                Cadastre-se
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

export default LoginPage;
