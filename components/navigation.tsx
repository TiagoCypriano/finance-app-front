"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Wallet, Target, FileText, Settings, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", icon: BarChart3, label: "Dashboard" },
  { href: "/transactions", icon: Wallet, label: "Transactions" },
  { href: "/budgets", icon: TrendingUp, label: "Budgets" },
  { href: "/goals", icon: Target, label: "Goals" },
  { href: "/reports", icon: FileText, label: "Reports" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-r border-border bg-card">
      <div className="flex flex-col h-screen">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">FinPlan</h1>
        </div>
        <div className="flex-1 overflow-auto">
          <ul className="space-y-2 p-4">
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    pathname === href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
