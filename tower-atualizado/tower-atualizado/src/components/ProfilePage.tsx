import { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { User, Camera, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage: React.FC = () => {
  const { user, client, updateProfile, uploadProfilePicture, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || ""
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar perfil");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setUploading(true);
    try {
      await uploadProfilePicture(file);
      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao fazer upload da foto");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-900 border border-blue-500/30 rounded-lg p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl font-bold">Meu Perfil</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Editar Perfil
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Foto de perfil */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-blue-500/30">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {uploading && (
                <p className="text-blue-400 text-sm mt-2">Enviando foto...</p>
              )}
              <p className="text-gray-400 text-sm mt-2">
                Clique no ícone da câmera para alterar a foto
              </p>
            </div>
          </div>

          {/* Informações do usuário */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Nome de usuário</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? "Salvando..." : "Salvar"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        username: user.username,
                        email: user.email
                      });
                    }}
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Nome de usuário</label>
                  <p className="text-white text-lg">{user.username}</p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">E-mail</label>
                  <p className="text-white text-lg">{user.email}</p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Membro desde</label>
                  <p className="text-white text-lg">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {client && (
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-white text-xl font-semibold mb-4">Informações da Empresa</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Nome da empresa</label>
                        <p className="text-white text-lg">{client.name}</p>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">E-mail da empresa</label>
                        <p className="text-white text-lg">{client.email}</p>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Cliente desde</label>
                        <p className="text-white text-lg">
                          {new Date(client.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

