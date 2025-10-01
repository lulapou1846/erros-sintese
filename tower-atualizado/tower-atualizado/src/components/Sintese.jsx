
import React from "react";
import { Card, CardContent } from "./Card";



import { Edit } from "lucide-react";

const Sintese: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Título */}
      <h1 className="text-3xl font-bold text-white">SÍNTESE</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0a1c2b] text-white col-span-1 p-4">
          <CardContent>
            <h2 className="text-lg font-bold mb-2">SÍNTESE DA PRECIFICAÇÃO</h2>
            <p className="text-sm text-gray-300">Análise consolidada de vendas por categoria</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1c2b] text-white flex items-center justify-center">
          <CardContent className="text-center">
            <p className="text-gray-300">TOTAL DE VENDAS</p>
            <h2 className="text-2xl font-bold text-green-400">0</h2>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1c2b] text-white flex items-center justify-center">
          <CardContent className="text-center">
            <p className="text-gray-300">CATEGORIAS ATIVAS</p>
            <h2 className="text-2xl font-bold text-green-400">0</h2>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas (2 exemplos) */}
      {[1, 2].map((_, idx) => (
        <Card key={idx} className="bg-[#0a1c2b] text-white p-4">
          <CardContent>
            <h3 className="text-lg font-bold mb-4 text-center">NOME DA CATEGORIA</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-700">
                <thead className="bg-[#0d2233] text-gray-300">
                  <tr>
                    <th className="p-2 text-left">PRODUTOS</th>
                    <th className="p-2">CMV/CPV/CSV</th>
                    <th className="p-2">PREÇO DE VENDA</th>
                    <th className="p-2">MARGEM</th>
                    <th className="p-2">CMV/CPV/CSV DO PRODUTO</th>
                    <th className="p-2">DESEMPENHO</th>
                    <th className="p-2">VENDAS</th>
                    <th className="p-2">TOTAL DE VENDAS</th>
                    <th className="p-2">MARGEM</th>
                    <th className="p-2">CMV/CPV/CSV DO PRODUTO</th>
                    <th className="p-2">DESEMPENHO DO PRODUTO</th>
                    <th className="p-2">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="border-t border-gray-700 hover:bg-[#11263a]">
                      <td className="p-2">Nome do produto</td>
                      <td className="p-2">R$ 0,00</td>
                      <td className="p-2">R$ 0,00</td>
                      <td className="p-2">0%</td>
                      <td className="p-2">R$ 0,00</td>
                      <td className="p-2">0%</td>
                      <td className="p-2">0</td>
                      <td className="p-2">R$ 0,00</td>
                      <td className="p-2">0%</td>
                      <td className="p-2">R$ 0,00</td>
                      <td className="p-2">0%</td>
                      <td className="p-2 text-center">
                        <Edit size={16} className="cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t border-gray-700">
                    <td className="p-2">TOTAL</td>
                    <td className="p-2">R$ 0,00</td>
                    <td className="p-2">R$ 0,00</td>
                    <td className="p-2">0%</td>
                    <td className="p-2">R$ 0,00</td>
                    <td className="p-2">0%</td>
                    <td className="p-2">0</td>
                    <td className="p-2">R$ 0,00</td>
                    <td className="p-2">0%</td>
                    <td className="p-2">R$ 0,00</td>
                    <td className="p-2">0%</td>
                    <td className="p-2">-</td>
                  </tr>
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
