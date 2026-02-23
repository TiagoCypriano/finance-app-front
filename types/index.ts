export type TransactionType = "income" | "expense"

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  description: string
  date: Date
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  month: string
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  category: string
}

export interface FinancialData {
  transactions: Transaction[]
  budgets: Budget[]
  goals: Goal[]
  settings: {
    currency: string
    theme: "light" | "dark"
  }
}
