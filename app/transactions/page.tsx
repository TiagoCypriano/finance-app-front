"use client"

import { useState } from "react"
import { useFinancial } from "@/hooks/useFinancial"
import { Navigation } from "@/components/navigation"
import { TransactionModal } from "@/components/transaction-modal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Search } from "lucide-react"
import { CATEGORIES } from "@/lib/constants"
import { AuthGuard } from "@/components/auth-guard"

export default function TransactionsPage() {
  const { data, deleteTransaction, addTransaction } = useFinancial()
  const [modalOpen, setModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const filtered =
    data?.transactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === "all" || t.type === filterType
      const matchesCategory = filterCategory === "all" || String(t.category) === String(filterCategory)
      
      return matchesSearch && matchesType && matchesCategory
    }) || []

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background text-foreground">
        <Navigation />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">Transações</h2>
                <p className="text-muted-foreground mt-1">Gerencie e acompanhe todas as suas movimentações</p>
              </div>
              <Button onClick={() => setModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Transação
              </Button>
            </div>

            {/* Filtros */}
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por descrição..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Lista de Transações */}
            <Card className="overflow-hidden">
              <div className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    Nenhuma transação encontrada com os filtros aplicados.
                  </div>
                ) : (
                  filtered.map((transaction) => {
                    const categoryInfo = CATEGORIES.find((c) => String(c.id) === String(transaction.category));

                    return (
                      <div
                        key={transaction.id}
                        className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                            {categoryInfo?.icon || "💰"}
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {categoryInfo ? categoryInfo.name : "Geral"} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <p className={`font-bold text-lg ${transaction.type === "income" ? "text-emerald-500" : "text-red-500"}`}>
                            {transaction.type === "income" ? "+" : "-"} R$ {transaction.amount.toFixed(2)}
                          </p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              if(window.confirm("Deseja realmente excluir esta transação?")) {
                                deleteTransaction(transaction.id)
                              }
                            }}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
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