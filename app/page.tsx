"use client"

import { useState, useMemo } from "react"
import { useFinancial } from "@/hooks/useFinancial"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { StatCard } from "@/components/stat-card"
import { TransactionModal } from "@/components/transaction-modal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { CATEGORIES } from "@/lib/constants"

export default function Dashboard() {
  const { data, loading, addTransaction, getMonthlyStats } = useFinancial()
  const [modalOpen, setModalOpen] = useState(false)

  const stats = getMonthlyStats()
  const savings = stats.income - stats.expenses

  // 1. Processamento seguro para a Pizza
  const categoryData = useMemo(() => {
    if (!data?.transactions || data.transactions.length === 0) return []
    
    const groups = data.transactions.reduce((acc, t) => {
      const categoryObj = CATEGORIES.find((c) => c.id === t.category)
      const name = categoryObj ? categoryObj.name : "Geral"
      acc[name] = (acc[name] || 0) + Number(t.amount)
      return acc
    }, {} as Record<string, number>)

    return Object.entries(groups).map(([name, value]) => ({ name, value }))
  }, [data?.transactions])

  // 2. Processamento seguro para as Barras
  const chartData = useMemo(() => [
    { 
      name: "Resumo", 
      receita: Number(stats.income) || 0, 
      despesa: Number(stats.expenses) || 0 
    }
  ], [stats])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">💫</div>
          <p>Sincronizando banco de dados...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Navigation />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">Painel</h2>
                <p className="text-muted-foreground">Bem-vindo, Tiago. Seus dados estão sincronizados.</p>
              </div>
              <Button onClick={() => setModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" /> Nova Transação
              </Button>
            </div>

            {/* Cartões de Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Receita" value={`R$ ${stats.income.toFixed(2)}`} icon={<TrendingUp />} color="green" />
              <StatCard label="Despesas" value={`R$ ${stats.expenses.toFixed(2)}`} icon={<TrendingDown />} color="red" />
              <StatCard label="Economia" value={`R$ ${savings.toFixed(2)}`} icon={<Wallet />} color="blue" />
              <StatCard label="Saldo Total" value={`R$ ${savings.toFixed(2)}`} icon={<TrendingUp />} color="purple" />
            </div>

            {/* Seção de Gráficos com Altura Fixa Forçada */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 h-[400px]">
                <h3 className="text-lg font-semibold mb-6">Receitas vs Despesas</h3>
                <div className="w-full h-full pb-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                        cursor={{ fill: "rgba(255,255,255,0.05)" }}
                      />
                      <Legend />
                      <Bar dataKey="receita" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} barSize={60} />
                      <Bar dataKey="despesa" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6 h-[400px]">
                <h3 className="text-lg font-semibold mb-6">Divisão por Categoria</h3>
                <div className="w-full h-full pb-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData.length > 0 ? categoryData : [{ name: "Sem dados", value: 0.01 }]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={60}
                        paddingAngle={5}
                      >
                        {["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"].map((color, i) => (
                          <Cell key={`cell-${i}`} fill={color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Lista de Transações Recentes */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
              <div className="space-y-3">
                {data.transactions.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground">Aguardando dados do banco...</p>
                  </div>
                ) : (
                  data.transactions.slice(0, 5).map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                          {CATEGORIES.find((c) => c.id === t.category)?.icon || "💰"}
                        </div>
                        <div>
                          <p className="font-medium">{t.description}</p>
                          <p className="text-sm text-muted-foreground">{t.date.toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${t.type === "income" ? "text-emerald-500" : "text-red-500"}`}>
                        {t.type === "income" ? "+" : "-"} R$ {t.amount.toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </main>
        <TransactionModal open={modalOpen} onOpenChange={setModalOpen} onSave={addTransaction} />
      </div>
    </AuthGuard>
  )
}