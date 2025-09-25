// src/components/Dashboard.tsx
import { FC, useState, useMemo } from "react";
import { useProdutos } from "../hooks/useProdutos";
import { useCategorias } from "./CategoriasContext";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import ProductModal from "./ProductModal";
import ProfilePage from "./ProfilePage";

interface Produto {
  _id?: string;
  codigo?: string;
  descricao: string;
  tipo: string;
  categoria: string;
  unidade: string;
  qtdEmbalagem?: number;
  custoEmbalagem?: number;
  custoUnitario?: number;
}

interface DashboardProps {
  activeSection: string;
}

const Dashboard: React.FC<DashboardProps> = ({ activeSection }) => {
  const { produtos = [], loading, createProduto, updateProduto, deleteProduto } = useProdutos();
  const { categorias = [] } = useCategorias() ?? { categorias: [] };

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (product: Produto) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId: string) => {
    if (!productId) return;
    if (typeof window !== "undefined" && window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduto(productId);
      } catch (err) {
        console.error("Erro ao excluir produto:", err);
      }
    }
  };

  // calcula próximo código dentro da faixa da categoria; se não houver categoria, fallback global
  const getNextCodeForCategory = (categoriaNome?: string): number => {
    // fallback global (próximo múltiplo de 1000)
    const fallbackGlobal = () => {
      const numericCodes = (produtos || [])
        .map(p => Number(p.codigo))
        .filter(n => Number.isFinite(n) && !Number.isNaN(n));
      const maxCode = numericCodes.length > 0 ? Math.max(...numericCodes) : 0;
      return Math.floor(maxCode / 1000) * 1000 + 1000;
    };

    if (!categoriaNome) return fallbackGlobal();

    const cat = categorias.find(c => c.nome === categoriaNome);
    if (!cat) return fallbackGlobal();

    const numericInRange = (produtos || [])
      .map(p => Number(p.codigo))
      .filter(n => Number.isFinite(n) && n >= cat.frequenciaInicio && n <= cat.frequenciaFim);

    if (numericInRange.length === 0) return cat.frequenciaInicio;

    const next = Math.max(...numericInRange) + 1;
    if (next <= cat.frequenciaFim) return next;

    // faixa exaurida -> fallback global
    return fallbackGlobal();
  };

  const handleSave = async (productData: any) => {
    try {
      if (editingProduct && editingProduct._id) {
        // edição: preserva código atual
        await updateProduto(editingProduct._id, {
          ...productData,
          codigo: editingProduct.codigo
        });
      } else {
        // criação: gerar código baseado na categoria
        const novoCodigoNum = getNextCodeForCategory(productData.categoria);
        await createProduto({
          ...productData,
          codigo: novoCodigoNum.toString()
        });
      }

      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  // filtro de busca
  const filteredProdutos = useMemo(() => {
    const searchLower = searchTerm.trim().toLowerCase();
    if (!searchLower) return produtos;
    return produtos.filter(produto => {
      const descricao = (produto.descricao || "").toString().toLowerCase();
      const codigo = (produto.codigo || "").toString().toLowerCase();
      const tipo = (produto.tipo || "").toString().toLowerCase();
      const categoria = (produto.categoria || "").toString().toLowerCase();
      return (
        descricao.includes(searchLower) ||
        codigo.includes(searchLower) ||
        tipo.includes(searchLower) ||
        categoria.includes(searchLower)
      );
    });
  }, [produtos, searchTerm]);

  // --- o resto do render fica igual ao seu layout original (reduzi comentários) ---
  const renderPlaceholder = (title: string, description: string) => (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <p className="text-gray-400">{description}</p>
      <p className="text-gray-500 text-sm mt-2">Esta funcionalidade está em desenvolvimento.</p>
    </div>
  );

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total de Itens</p>
              <p className="text-3xl font-bold mt-1">{produtos.length}</p>
            </div>
            <div className="text-4xl opacity-80">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Produtos</p>
              <p className="text-3xl font-bold mt-1">{produtos.filter(p => p.tipo === "Produto").length}</p>
            </div>
            <div className="text-4xl opacity-80">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Insumos</p>
              <p className="text-3xl font-bold mt-1">{produtos.filter(p => p.tipo === "Insumo").length}</p>
            </div>
            <div className="text-4xl opacity-80">🏭</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Categorias</p>
              <p className="text-3xl font-bold mt-1">{new Set(produtos.map(p => p.categoria || "")).size}</p>
            </div>
            <div className="text-4xl opacity-80">📂</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-white text-xl font-semibold">Atividade Recente</h2>
        </div>
        <div className="p-6">
          {produtos.length > 0 ? (
            <div className="space-y-4">
              {produtos.slice(0, 5).map(produto => (
                <div key={produto._id ?? produto.codigo ?? produto.descricao} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{produto.tipo === "Produto" ? "📦" : "🏭"}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{produto.descricao}</p>
                      <p className="text-gray-400 text-sm">{produto.categoria} • {produto.tipo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">R$ {(produto.custoUnitario ?? 0).toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">{produto.unidade}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhuma atividade recente.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderProdutos = () => (
    <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl">
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-white text-xl font-semibold">Itens Cadastrados</h2>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por código, descrição, tipo ou categoria..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 bg-gray-800 border border-blue-500 rounded-lg pl-10 pr-4 py-2 text-white placeholder-blue-300"
              />
            </div>

            <button
              onClick={() => { setEditingProduct(null); setShowModal(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <Plus size={16} />
              <span>Novo Item</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-400 mt-4">Carregando produtos...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 text-gray-300 font-medium">Código</th>
                <th className="text-left p-4 text-gray-300 font-medium">Descrição</th>
                <th className="text-left p-4 text-gray-300 font-medium">Tipo</th>
                <th className="text-left p-4 text-gray-300 font-medium">Categoria</th>
                <th className="text-left p-4 text-gray-300 font-medium">Unidade</th>
                <th className="text-left p-4 text-gray-300 font-medium">Qtd Embalagem</th>
                <th className="text-left p-4 text-gray-300 font-medium">Custo da Embalagem</th>
                <th className="text-left p-4 text-gray-300 font-medium">Custo Unitário</th>
                <th className="text-left p-4 text-gray-300 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProdutos.map(produto => (
                <tr key={produto._id ?? produto.codigo ?? produto.descricao} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-4 text-white">{produto.codigo ?? "-"}</td>
                  <td className="p-4 text-white">{produto.descricao}</td>
                  <td className="p-4 text-white">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${produto.tipo === "Produto" ? "bg-blue-600 text-blue-100" : "bg-green-600 text-green-100"}`}>
                      {produto.tipo}
                    </span>
                  </td>
                  <td className="p-4 text-white">{produto.categoria}</td>
                  <td className="p-4 text-white">{produto.unidade}</td>
                  <td className="p-4 text-white">{produto.qtdEmbalagem ?? "-"}</td>
                  <td className="p-4 text-white">R$ {(produto.custoEmbalagem ?? 0).toFixed(2)}</td>
                  <td className="p-4 text-white">R$ {(produto.custoUnitario ?? 0).toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(produto)} className="text-blue-400 hover:text-blue-300 p-1"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(produto._id ?? "")} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProdutos.length === 0 && !searchTerm && (
            <div className="p-12 text-center">
              <p className="text-gray-400 mb-4">Nenhum produto cadastrado ainda.</p>
              <button onClick={() => { setEditingProduct(null); setShowModal(true); }} className="text-blue-400">Cadastrar primeiro produto</button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "produtos":
      case "cadastramento":
        return renderProdutos();
      case "sintese":
        return renderPlaceholder("Síntese", "Esta seção permite visualizar sínteses e relatórios.");
      case "ficha-tecnica":
        return renderPlaceholder("Ficha Técnica", "Esta seção permite gerenciar fichas técnicas.");
      case "perfil":
        return <ProfilePage />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex-1 bg-gray-800 p-6">
      {renderContent()}

      {showModal && (
        <ProductModal
          product={editingProduct ?? undefined}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
