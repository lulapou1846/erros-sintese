import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./Card";
import { Edit } from "lucide-react";
import axios from "axios";

// Tipos
interface Produto {
  nome: string;
  custo: number;
  preco: number;
  margem: string;
  desempenho: string;
  vendas: number;
  total_vendas: number;
}

interface Categoria {
  nome: string;
  produtos: Produto[];
}

interface DadosSintese {
  total_vendas: number;
  categorias_ativas: number;
  categorias: Categoria[];
}

const Sintese: React.FC = () => {
  const [dados, setDados] = useState<DadosSintese | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/sintese");
        // força o tipo (caso o backend retorne algo diferente, trate aqui)
        setDados(res.data as DadosSintese);
      } catch (err) {
        console.error("Erro ao carregar síntese:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-white p-6">Carregando...</p>;
  if (!dados) return <p className="text-white p-6">Nenhum dado disponível</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">SÍNTESE</h1>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0a1c2b] text-white col-span-1">
          <CardContent>
            <h2 className="text-lg font-bold mb-2">SÍNTESE DA PRECIFICAÇÃO</h2>
            <p className="text-sm text-gray-300">Análise consolidada de vendas por categoria</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1c2b] text-white flex items-center justify-center">
          <CardContent className="text-center">
            <p className="text-gray-300">TOTAL DE VENDAS</p>
            <h2 className="text-2xl font-bold text-green-400">
              R$ {Number(dados.total_vendas).toLocaleString("pt-BR")}
            </h2>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1c2b] text-white flex items-center justify-center">
          <CardContent className="text-center">
            <p className="text-gray-300">CATEGORIAS ATIVAS</p>
            <h2 className="text-2xl font-bold text-green-400">{dados.categorias_ativas}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas por categoria */}
      {dados.categorias.map((categoria, idx) => (
        <Card key={idx} className="bg-[#0a1c2b] text-white p-4">
          <CardContent>
            <h3 className="text-lg font-bold mb-4 text-center">{categoria.nome}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-700">
                <thead className="bg-[#0d2233] text-gray-300">
                  <tr>
                    <th className="p-2 text-left">PRODUTO</th>
                    <th className="p-2">CUSTO</th>
                    <th className="p-2">PREÇO</th>
                    <th className="p-2">MARGEM</th>
                    <th className="p-2">DESEMPENHO</th>
                    <th className="p-2">VENDAS</th>
                    <th className="p-2">TOTAL VENDAS</th>
                    <th className="p-2">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {categoria.produtos.map((produto, i) => (
                    <tr key={i} className="border-t border-gray-700 hover:bg-[#11263a]">
                      <td className="p-2">{produto.nome}</td>
                      <td className="p-2">R$ {Number(produto.custo).toLocaleString("pt-BR")}</td>
                      <td className="p-2">R$ {Number(produto.preco).toLocaleString("pt-BR")}</td>
                      <td className="p-2">{produto.margem}</td>
                      <td className="p-2">{produto.desempenho}</td>
                      <td className="p-2">{produto.vendas}</td>
                      <td className="p-2">R$ {Number(produto.total_vendas).toLocaleString("pt-BR")}</td>
                      <td className="p-2 text-center">
                        <Edit size={16} className="cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};



export default Sintese;
