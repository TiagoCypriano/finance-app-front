"use client"

import { useState, useEffect } from "react"
import type { FinancialData, Transaction } from "@/types"
import { getToken } from "@/lib/auth"

export function useFinancial() {
  const [data, setData] = useState<FinancialData>({
    transactions: [],
    settings: { currency: "BRL", theme: "light" }
  })
  const [loading, setLoading] = useState(true)

  // 1. BUSCAR DADOS
  useEffect(() => {
    async function fetchFinancialData() {
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch("/api/transaction", {
          headers: { "Authorization": `Bearer ${token}` }
        })

        if (!response.ok) throw new Error("Erro na rede")

        const res = await response.json()
        
        const mappedTransactions: Transaction[] = Array.isArray(res) 
          ? res.map((t: any) => {
              const rawDate = t.dataHoraTransacao || t.dataTransacao;
              return {
                id: (t.idTransacao || t.id || Math.random()).toString(),
                type: t.tipo === "R" ? "income" : "expense",
                amount: Number(t.valor) || 0,
                description: t.descricao || "",
                category: t.idCategoria ? t.idCategoria.toString() : "",
                date: rawDate ? new Date(rawDate.split('T')[0] + "T12:00:00") : new Date()
              }
            })
          : []

        setData(prev => ({
          ...prev,
          transactions: mappedTransactions
        }))
      } catch (error) {
        console.error("Erro na integração:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFinancialData()
  }, [])

  // 2. SALVAR TRANSAÇÃO
  // 2. SALVAR TRANSAÇÃO (Atualizado para aceitar a categoria escolhida)
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const token = getToken()
      const payload = {
        tipo: transaction.type === "income" ? "R" : "D",
        valor: transaction.amount,
        descricao: transaction.description,
        dataTransacao: new Date(transaction.date).toISOString().split('T')[0],
        idCategoria: Number(transaction.category) 
      }

      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error("Erro ao salvar")
      const newT = await response.json()

      const rawDate = newT.dataHoraTransacao || newT.dataTransacao;

      const mappedNew: Transaction = {
        id: (newT.idTransacao || newT.id || Date.now()).toString(),
        type: newT.tipo === "R" ? "income" : "expense",
        amount: Number(newT.valor) || 0,
        description: newT.descricao || "",
        // Mapeia o ID que voltou do Java para o Front-end reconhecer o ícone
        category: newT.idCategoria ? newT.idCategoria.toString() : transaction.category,
        date: rawDate ? new Date(rawDate.split('T')[0] + "T12:00:00") : new Date()
      }

      setData((prev) => ({
        ...prev,
        transactions: [mappedNew, ...prev.transactions]
      }))
    } catch (error) {
      alert("Erro ao salvar.");
    }
  }

  // 3. DELETAR TRANSAÇÃO (CORRIGIDO)
  const deleteTransaction = async (id: string) => {
    try {
      const token = getToken()
      const response = await fetch(`/api/transaction/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        setData((prev) => ({
          ...prev,
          transactions: prev.transactions.filter((t) => t.id !== id)
        }))
      }
    } catch (error) {
      console.error("Erro ao deletar:", error)
    }
  }

  // 4. ATUALIZAR CONFIGURAÇÕES (RESOLVE O ERRO DO TEMA)
  const updateSettings = (newSettings: Partial<FinancialData["settings"]>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }))
    
    // Opcional: Aplicar classe dark ao HTML para o CSS mudar de cor
    if (newSettings.theme) {
      document.documentElement.classList.toggle("dark", newSettings.theme === "dark")
    }
  }

  const getMonthlyStats = () => {
    const validTransactions = data.transactions.filter(t => !isNaN(t.date.getTime()));
    const income = validTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expenses = validTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    return { income, expenses }
  }

  return { 
    data, 
    loading, 
    addTransaction, 
    deleteTransaction, 
    updateSettings, // Adicionado aqui para a página de configurações encontrar
    getMonthlyStats 
  }
}