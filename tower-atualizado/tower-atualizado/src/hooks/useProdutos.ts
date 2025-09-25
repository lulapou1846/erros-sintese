import { useState, useEffect, useCallback } from "react"
import { lumi } from "../lib/lumi"
import toast from "react-hot-toast"

export interface Produto {
  _id: string
  codigo: string
  descricao: string
  tipo: string
  categoria: string
  unidade: string
  qtdEmbalagem?: number
  custoEmbalagem: number
  custoUnitario: number
  creator?: string
  createdAt: string
  updatedAt: string
}

type ProdutoInput = Omit<Produto, "_id" | "createdAt" | "updatedAt">

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchProdutos = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      // chamar o lumi e tratar o retorno como any, depois validar
      const rawResponse: any = await lumi.entities.produtos.list({
        sort: { createdAt: -1 },
      })

      const list: Produto[] = Array.isArray(rawResponse?.list) ? rawResponse.list : []
      setProdutos(list)
    } catch (err) {
      console.error("Erro ao buscar produtos:", err)
      toast.error("Erro ao carregar produtos")
    } finally {
      setLoading(false)
    }
  }, [])

  // create sem useCallback (mais simples, evita pitfalls)
  const createProduto = async (produtoData: ProdutoInput): Promise<Produto> => {
    try {
      const payload = {
        ...produtoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const rawNew: any = await lumi.entities.produtos.create(payload)
      const newProduto: Produto = rawNew as Produto

      setProdutos((prev) => [newProduto, ...prev])
      toast.success(`Produto "${newProduto.descricao}" criado com sucesso`)
      return newProduto
    } catch (err) {
      console.error("Erro ao criar produto:", err)
      toast.error("Erro ao criar produto")
      throw err
    }
  }

  // update sem useCallback
  const updateProduto = async (produtoId: string, updates: Partial<Produto>): Promise<Produto> => {
    try {
      const payload = { ...updates, updatedAt: new Date().toISOString() }

      const rawUpdated: any = await lumi.entities.produtos.update(produtoId, payload)
      const updatedProduto: Produto = rawUpdated as Produto

      setProdutos((prev) => prev.map((p) => (p._id === produtoId ? updatedProduto : p)))
      toast.success(`Produto "${updatedProduto.descricao}" atualizado com sucesso`)
      return updatedProduto
    } catch (err) {
      console.error("Erro ao atualizar produto:", err)
      toast.error("Erro ao atualizar produto")
      throw err
    }
  }

  // delete sem useCallback
  const deleteProduto = async (produtoId: string): Promise<void> => {
    try {
      await lumi.entities.produtos.delete(produtoId)
      setProdutos((prev) => prev.filter((p) => p._id !== produtoId))
      toast.success("Produto excluído com sucesso")
    } catch (err) {
      console.error("Erro ao excluir produto:", err)
      toast.error("Erro ao excluir produto")
      throw err
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [fetchProdutos])

  return {
    produtos,
    loading,
    fetchProdutos,
    createProduto,
    updateProduto,
    deleteProduto,
  }
}
