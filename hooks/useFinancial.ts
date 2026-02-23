"use client"

import { useState, useEffect } from "react"
import type { FinancialData, Transaction, Budget, Goal } from "@/types"

const STORAGE_KEY = "financial_planner_data"

const generateMockData = (): FinancialData => {
  const today = new Date()
  return {
    transactions: [
      {
        id: "1",
        type: "income",
        amount: 5000,
        category: "salary",
        description: "Monthly Salary",
        date: new Date(today.getFullYear(), today.getMonth(), 1),
      },
      {
        id: "2",
        type: "expense",
        amount: 45.5,
        category: "food",
        description: "Coffee & Lunch",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      },
      {
        id: "3",
        type: "expense",
        amount: 120,
        category: "transport",
        description: "Gas",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      },
      {
        id: "4",
        type: "expense",
        amount: 80,
        category: "entertainment",
        description: "Movie tickets",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
      },
      {
        id: "5",
        type: "expense",
        amount: 150,
        category: "utilities",
        description: "Electricity bill",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
      },
    ],
    budgets: [
      {
        id: "1",
        category: "food",
        limit: 400,
        spent: 200,
        month: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
      },
      {
        id: "2",
        category: "transport",
        limit: 300,
        spent: 250,
        month: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
      },
      {
        id: "3",
        category: "entertainment",
        limit: 200,
        spent: 150,
        month: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
      },
    ],
    goals: [
      {
        id: "1",
        name: "Emergency Fund",
        targetAmount: 5000,
        currentAmount: 2500,
        deadline: new Date(today.getFullYear() + 1, today.getMonth()),
        category: "savings",
      },
      {
        id: "2",
        name: "Vacation",
        targetAmount: 3000,
        currentAmount: 1200,
        deadline: new Date(today.getFullYear(), today.getMonth() + 6),
        category: "vacation",
      },
    ],
    settings: {
      currency: "USD",
      theme: "light",
    },
  }
}

const deserializeData = (data: any): FinancialData => {
  return {
    ...data,
    transactions: data.transactions.map((t: any) => ({
      ...t,
      date: typeof t.date === "string" ? new Date(t.date) : t.date,
    })),
    goals: data.goals.map((g: any) => ({
      ...g,
      deadline: typeof g.deadline === "string" ? new Date(g.deadline) : g.deadline,
    })),
  }
}

export function useFinancial() {
  const [data, setData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate async load
    const timer = setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY)
      setData(stored ? deserializeData(JSON.parse(stored)) : generateMockData())
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const saveData = (newData: FinancialData) => {
    setData(newData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  }

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    if (!data) return
    const newTransaction = { ...transaction, id: Date.now().toString() }
    saveData({ ...data, transactions: [newTransaction, ...data.transactions] })
  }

  const deleteTransaction = (id: string) => {
    if (!data) return
    saveData({ ...data, transactions: data.transactions.filter((t) => t.id !== id) })
  }

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    if (!data) return
    saveData({
      ...data,
      budgets: data.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })
  }

  const addGoal = (goal: Omit<Goal, "id">) => {
    if (!data) return
    const newGoal = { ...goal, id: Date.now().toString() }
    saveData({ ...data, goals: [newGoal, ...data.goals] })
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    if (!data) return
    saveData({
      ...data,
      goals: data.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })
  }

  const updateSettings = (settings: Partial<typeof data.settings>) => {
    if (!data) return
    saveData({ ...data, settings: { ...data.settings, ...settings } })
  }

  const getMonthlyStats = () => {
    if (!data) return { income: 0, expenses: 0 }
    const currentMonth = new Date().toISOString().slice(0, 7)
    const monthTransactions = data.transactions.filter((t) => {
      const transactionDate = t.date instanceof Date ? t.date : new Date(t.date)
      return transactionDate.toISOString().slice(0, 7) === currentMonth
    })
    return {
      income: monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
      expenses: monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    }
  }

  return {
    data,
    loading,
    addTransaction,
    deleteTransaction,
    updateBudget,
    addGoal,
    updateGoal,
    updateSettings,
    getMonthlyStats,
  }
}
