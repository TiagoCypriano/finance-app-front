"use client"

import { useFinancial } from "@/hooks/useFinancial"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCIES } from "@/lib/constants"

export default function SettingsPage() {
  const { data, updateSettings } = useFinancial()

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div>
            <h2 className="text-3xl font-bold">Settings</h2>
            <p className="text-muted-foreground mt-1">Manage your preferences and defaults</p>
          </div>

          <div className="mt-8 max-w-2xl space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Currency</h3>
              <Select value={data?.settings.currency} onValueChange={(currency) => updateSettings({ currency })}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">Choose your preferred currency for all transactions</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Theme</h3>
              <div className="flex gap-4">
                <Button
                  variant={data?.settings.theme === "light" ? "default" : "outline"}
                  onClick={() => updateSettings({ theme: "light" })}
                >
                  Light
                </Button>
                <Button
                  variant={data?.settings.theme === "dark" ? "default" : "outline"}
                  onClick={() => updateSettings({ theme: "dark" })}
                >
                  Dark
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Data Management</h3>
              <Button variant="destructive">Clear All Data</Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will permanently delete all your transactions, budgets, and goals
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
