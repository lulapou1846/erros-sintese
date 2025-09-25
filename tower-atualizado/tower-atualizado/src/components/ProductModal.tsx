// src/components/ProductModal.tsx
import { FC, useEffect, useState } from "react";
import { X, Plus, Lock } from "lucide-react";
import { useCategorias } from "./CategoriasContext";

interface Product {
  codigo?: string;
  descricao?: string;
  tipo?: string;
  categoria?: string;
  unidade?: string;
  qtdEmbalagem?: number;
  custoEmbalagem?: number;
  custoUnitario?: number;
}

interface ProductModalProps {
  product?: Product;
  onSave: (product: Omit<Product, "codigo">) => void; // criação envia sem código
  onClose: () => void;
}

interface FormData {
  descricao: string;
  tipo: string;
  categoria: string;
  unidade: string;
  qtdEmbalagem: string;
  custoEmbalagem: string;
  custoUnitario: string;
}

const ProductModal: FC<ProductModalProps> = ({ product, onSave, onClose }) => {
  const categoriasCtx = useCategorias();
  const categorias = categoriasCtx?.categorias ?? [];
  const adicionarCategoria = categoriasCtx?.adicionarCategoria;

  const [formData, setFormData] = useState<FormData>({
    descricao: "",
    tipo: "",
    categoria: "",
    unidade: "",
    qtdEmbalagem: "",
    custoEmbalagem: "",
    custoUnitario: ""
  });

  const [isInsumo, setIsInsumo] = useState<boolean>(false);
  const [novaCategoria, setNovaCategoria] = useState<string>("");
  const [adicionandoCategoria, setAdicionandoCategoria] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setFormData({
        descricao: product.descricao ?? "",
        tipo: product.tipo ?? "",
        categoria: product.categoria ?? "",
        unidade: product.unidade ?? "",
        qtdEmbalagem: product.qtdEmbalagem?.toString() ?? "",
        custoEmbalagem: product.custoEmbalagem?.toString() ?? "",
        custoUnitario: product.custoUnitario?.toString() ?? ""
      });
      setIsInsumo((product.tipo ?? "").toLowerCase() === "insumo");
    } else {
      setFormData({
        descricao: "",
        tipo: "",
        categoria: "",
        unidade: "",
        qtdEmbalagem: "",
        custoEmbalagem: "",
        custoUnitario: ""
      });
      setIsInsumo(false);
    }
  }, [product]);

  const calcularCustoUnitario = (custoEmbalagemStr: string, qtdEmbalagemStr: string) => {
    const custo = parseFloat(custoEmbalagemStr || "0");
    const qtd = parseFloat(qtdEmbalagemStr || "0");
    if (custo > 0 && qtd > 0) return (custo / qtd).toFixed(2);
    return "0.00";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next: any = { ...prev, [name]: value };

      if (name === "custoEmbalagem" || name === "qtdEmbalagem") {
        const custo = name === "custoEmbalagem" ? value : prev.custoEmbalagem;
        const qtd = name === "qtdEmbalagem" ? value : prev.qtdEmbalagem;
        next.custoUnitario = calcularCustoUnitario(custo, qtd);
      }

      if (name === "tipo") {
        setIsInsumo(value.toLowerCase() === "insumo");
      }

      return next;
    });
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, tipo: value }));
    setIsInsumo(value.toLowerCase() === "insumo");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const produtoParaSalvar: Omit<Product, "codigo"> = {
      descricao: formData.descricao || undefined,
      tipo: formData.tipo || undefined,
      categoria: formData.categoria || undefined,
      unidade: formData.unidade || undefined,
      qtdEmbalagem: formData.qtdEmbalagem ? parseFloat(formData.qtdEmbalagem) : undefined,
      custoEmbalagem: formData.custoEmbalagem ? parseFloat(formData.custoEmbalagem) : undefined,
      custoUnitario: formData.custoUnitario ? parseFloat(formData.custoUnitario) : undefined
    };

    onSave(produtoParaSalvar);
  };

  const adicionarNovaCategoria = () => {
    const name = novaCategoria.trim();
    if (!name) {
      setNovaCategoria("");
      setAdicionandoCategoria(false);
      return;
    }
    if (typeof adicionarCategoria === "function") adicionarCategoria(name);
    setFormData(prev => ({ ...prev, categoria: name }));
    setNovaCategoria("");
    setAdicionandoCategoria(false);
  };

  const tiposDisponiveis = ["Produto", "Insumo", "Matéria Prima", "Componente", "Ferramenta", "Equipamento"];
  const unidadesDisponiveis = ["Peça", "Kg", "Litro", "Metro", "Medida", "Unidade", "Caixa", "Pacote"];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{product ? "Editar Item" : "Adicionar Novo Item"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Código removido (automático) */}

          {/* Tipo */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Tipo <span className="text-red-500">*</span></label>
            <select name="tipo" value={formData.tipo} onChange={handleTipoChange} required className="w-full bg-gray-800 border-2 border-blue-500 rounded-lg px-4 py-3 text-white">
              <option value="">Selecione</option>
              {tiposDisponiveis.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Categoria <span className="text-red-500">*</span></label>
            <div className="flex space-x-2">
              <select name="categoria" value={formData.categoria} onChange={handleChange} required className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white">
                <option value="">Selecione</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.nome}>{c.nome}</option>
                ))}
              </select>
              <button type="button" onClick={() => setAdicionandoCategoria(true)} className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 text-white">
                <Plus size={16} />
              </button>
            </div>

            {adicionandoCategoria && (
              <div className="mt-2 flex space-x-2">
                <input value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)} placeholder="Nova categoria" className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                <button type="button" onClick={adicionarNovaCategoria} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Salvar</button>
              </div>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Descrição <span className="text-red-500">*</span></label>
            <textarea name="descricao" value={formData.descricao} onChange={handleChange} required rows={3} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white resize-none" />
          </div>

          {/* Unidade */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Unidade <span className="text-red-500">*</span></label>
            <select name="unidade" value={formData.unidade} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white">
              <option value="">Selecione</option>
              {unidadesDisponiveis.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          {isInsumo && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Qtd da Embalagem</label>
                  <input type="number" name="qtdEmbalagem" value={formData.qtdEmbalagem} onChange={handleChange} placeholder="Ex: 1, 1000, etc." className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Custo da Embalagem (R$)</label>
                  <input type="number" name="custoEmbalagem" value={formData.custoEmbalagem} onChange={handleChange} placeholder="0.00" step="0.01" min="0" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Custo Unitário (R$)</label>
                <input type="text" value={`R$ ${formData.custoUnitario || "0.00"}`} readOnly className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-gray-400" />
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-transparent border border-gray-600 hover:bg-gray-800 text-white py-3 rounded-lg">Cancelar</button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2">
              <Lock size={16} />
              <span>{product ? "Salvar" : "Adicionar"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
