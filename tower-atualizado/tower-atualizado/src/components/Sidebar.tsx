import { FC } from "react"
import { useAuth } from "../hooks/useAuth"
import {
  LayoutDashboard,
  Package,
  Zap,
  FileText,
  Puzzle,
  GraduationCap,
  Headphones,
  Settings,
  LogOut,
  User,
} from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const Sidebar: FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user, signOut } = useAuth()

  const menuItems = [
    {
      category: "Funcionalidades",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "cadastramento", label: "Cadastramento", icon: Package },
        { id: "sintese", label: "Síntese", icon: Zap },
        { id: "ficha-tecnica", label: "Ficha Técnica", icon: FileText },
      ],
    },
    {
      category: "Mini Estratégias",
      items: [
        { id: "integracoes", label: "Integrações", icon: Puzzle },
        { id: "aprendizado", label: "Aprendizado", icon: GraduationCap },
        { id: "suporte", label: "Suporte", icon: Headphones },
        { id: "configuracoes", label: "Configurações", icon: Settings },
      ],
    },
    {
      category: "Conta",
      items: [
        { id: "perfil", label: "Meu Perfil", icon: User },
      ],
    },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error("Erro ao realizar logout:", err)
    }
  }

  return (
    <aside className="w-64 bg-gray-800 text-sm min-h-screen flex flex-col">
      <nav className="p-4 flex-1">
        {menuItems.map((category) => (
          <div key={category.category} className="mb-6">
            <p className="text-xs text-gray-400 uppercase mb-2">{category.category}</p>
            <div className="space-y-1">
              {category.items.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full flex items-center gap-3 p-2 rounded ${isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}
                    title={item.label}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded flex-1"
            onClick={() => onSectionChange('perfil')}
          >
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={16} className="text-gray-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.username || "Usuário"}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {user?.email || "email@exemplo.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="text-gray-400 hover:text-red-400 transition-colors p-1 ml-2"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
