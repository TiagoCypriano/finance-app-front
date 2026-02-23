"use client"

import { useFinancial } from "@/hooks/useFinancial"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { CATEGORIES } from "@/lib/constants"
import { AlertCircle } from "lucide-react"

export default function BudgetsPage() {
  const { data } = useFinancial()

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div>
            <h2 className="text-3xl font-bold">Budgets</h2>
            <p className="text-muted-foreground mt-1">Set and track your spending limits</p>
          </div>

          <div className="mt-8 space-y-4">
            {data?.budgets.map((budget) => {
              const category = CATEGORIES.find((c) => c.id === budget.category)
              const percentage = (budget.spent / budget.limit) * 100
              const isOverBudget = budget.spent > budget.limit

              return (
                <Card key={budget.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{category?.icon}</span>
                        <h3 className="text-lg font-semibold">{category?.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Spent: <span className="font-semibold">${budget.spent.toFixed(2)}</span> of{" "}
                        <span className="font-semibold">${budget.limit.toFixed(2)}</span>
                      </p>
                    </div>
                    {isOverBudget && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950 px-3 py-1 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Over budget</span>
                      </div>
                    )}
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percentage > 100 ? "bg-red-500" : percentage > 80 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">{percentage.toFixed(0)}% of budget used</p>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
