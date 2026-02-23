"use client"

import { useState } from "react"
import { useFinancial } from "@/hooks/useFinancial"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, TrendingUp } from "lucide-react"

export default function GoalsPage() {
  const { data, updateGoal, addGoal } = useFinancial()
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", target: "", deadline: "" })

  const handleAddGoal = () => {
    if (formData.name && formData.target) {
      addGoal({
        name: formData.name,
        targetAmount: Number.parseFloat(formData.target),
        currentAmount: 0,
        deadline: new Date(formData.deadline || Date.now() + 365 * 24 * 60 * 60 * 1000),
        category: "savings",
      })
      setFormData({ name: "", target: "", deadline: "" })
      setModalOpen(false)
    }
  }

  const handleUpdateProgress = (id: string, amount: number) => {
    const goal = data?.goals.find((g) => g.id === id)
    if (goal) {
      updateGoal(id, { currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Financial Goals</h2>
              <p className="text-muted-foreground mt-1">Track your savings goals and milestones</p>
            </div>
            <Button onClick={() => setModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.goals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100
              const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

              return (
                <Card key={goal.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        {goal.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {daysLeft > 0 ? `${daysLeft} days left` : "Goal deadline passed"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">${goal.currentAmount.toFixed(2)}</span>
                        <span className="text-sm font-medium">${goal.targetAmount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{percentage.toFixed(0)}% complete</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => handleUpdateProgress(goal.id, 100)}>
                        + $100
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUpdateProgress(goal.id, 500)}>
                        + $500
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Goal Name</label>
              <Input
                placeholder="e.g., Emergency Fund"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Target Amount</label>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Deadline</label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="mt-1"
              />
            </div>
            <Button onClick={handleAddGoal} className="w-full">
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
