import { createContext, useContext, useState, ReactNode } from "react";

export interface Categoria {
  id: number;
  nome: string;
  frequenciaInicio: number;
  frequenciaFim: number;
}

interface CategoriasContextType {
  categorias: Categoria[];
  adicionarCategoria: (name: string) => void;
}

const CategoriasContext = createContext<CategoriasContextType | undefined>(undefined);

export const useCategorias = () => {
  return useContext(CategoriasContext);
};

// Gera faixa aleatória de 1000 em 1000 (exceto a primeira que começa em 1)
function gerarFaixaAleatoria(categorias: Categoria[]) {
  if (categorias.length === 0) {
    // Primeira categoria sempre 1–999
    return { inicio: 1, fim: 999 };
  }

  let inicio: number;
  do {
    inicio = Math.floor(Math.random() * 9000) + 1000; // gera entre 1000 e 9999
    inicio = Math.floor(inicio / 1000) * 1000; // arredonda para múltiplo de 1000
  } while (categorias.some(c => c.frequenciaInicio === inicio));

  return { inicio, fim: inicio + 999 };
}

export const CategoriasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const adicionarCategoria = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const exists = categorias.some(c => c.nome.toLowerCase() === trimmed.toLowerCase());
    if (exists) return;

    const { inicio, fim } = gerarFaixaAleatoria(categorias);

    const nova: Categoria = {
      id: categorias.length + 1,
      nome: trimmed,
      frequenciaInicio: inicio,
      frequenciaFim: fim,
    };

    setCategorias(prev => [...prev, nova]);
  };

  return (
    <CategoriasContext.Provider value={{ categorias, adicionarCategoria }}>
      {children}
    </CategoriasContext.Provider>
  );
};
