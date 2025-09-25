// src/CategoriasList.tsx
import { useCategorias } from "./CategoriasContext";

export default function CategoriasList() {
  const { categorias } = useCategorias() ?? { categorias: [] };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-white mb-4">Categorias</h2>
      <table className="w-full border border-gray-700 text-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2 text-left">Categoria</th>
            <th className="p-2 text-left">Faixa de Frequência</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length > 0 ? (
            categorias.map((cat) => (
              <tr key={cat.id} className="border-t border-gray-700 hover:bg-gray-900">
                <td className="p-2">{cat.nome}</td>
                <td className="p-2">
                  {cat.frequenciaInicio} – {cat.frequenciaFim}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="p-2 text-gray-400 text-center">
                Nenhuma categoria cadastrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
