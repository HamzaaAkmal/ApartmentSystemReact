"use client"

import { useState, useCallback } from "react"
import type { Currency } from "@/lib/types"
import { convertCurrency } from "@/lib/data"

interface AccountBalance {
  total: number
  used: number
  remaining: number
  currency: Currency
}

interface Transaction {
  id: string
  amount: number
  description: string
  date: Date
  type: "income" | "expense"
  category: string
  currency: Currency
}

export function useAccounts(initialConstructionBalance: AccountBalance, initialFinanceBalance: AccountBalance) {
  const [constructionAccount, setConstructionAccount] = useState<AccountBalance>(initialConstructionBalance)
  const [financeAccount, setFinanceAccount] = useState<AccountBalance>(initialFinanceBalance)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add transaction to construction account
  const addConstructionTransaction = useCallback(
    (amount: number, description: string, type: "income" | "expense", category: string, currency: Currency = "USD") => {
      setLoading(true)
      setError(null)
      try {
        // Convert amount if needed
        const amountInAccountCurrency =
          currency !== constructionAccount.currency
            ? convertCurrency(amount, currency, constructionAccount.currency)
            : amount

        // Create transaction
        const transaction: Transaction = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          amount: amountInAccountCurrency,
          description,
          date: new Date(),
          type,
          category,
          currency: constructionAccount.currency,
        }

        // Update account balance
        const updatedAccount = { ...constructionAccount }
        if (type === "income") {
          updatedAccount.total += amountInAccountCurrency
          updatedAccount.remaining += amountInAccountCurrency
        } else {
          updatedAccount.used += amountInAccountCurrency
          updatedAccount.remaining = updatedAccount.total - updatedAccount.used
        }

        setConstructionAccount(updatedAccount)
        setTransactions((prev) => [...prev, transaction])
        setLoading(false)
        return transaction
      } catch (err) {
        setError("Failed to add transaction")
        setLoading(false)
        throw err
      }
    },
    [constructionAccount],
  )

  // Add transaction to finance account
  const addFinanceTransaction = useCallback(
    (amount: number, description: string, type: "income" | "expense", category: string, currency: Currency = "USD") => {
      setLoading(true)
      setError(null)
      try {
        // Convert amount if needed
        const amountInAccountCurrency =
          currency !== financeAccount.currency ? convertCurrency(amount, currency, financeAccount.currency) : amount

        // Create transaction
        const transaction: Transaction = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          amount: amountInAccountCurrency,
          description,
          date: new Date(),
          type,
          category,
          currency: financeAccount.currency,
        }

        // Update account balance
        const updatedAccount = { ...financeAccount }
        if (type === "income") {
          updatedAccount.total += amountInAccountCurrency
          updatedAccount.remaining += amountInAccountCurrency
        } else {
          updatedAccount.used += amountInAccountCurrency
          updatedAccount.remaining = updatedAccount.total - updatedAccount.used
        }

        setFinanceAccount(updatedAccount)
        setTransactions((prev) => [...prev, transaction])
        setLoading(false)
        return transaction
      } catch (err) {
        setError("Failed to add transaction")
        setLoading(false)
        throw err
      }
    },
    [financeAccount],
  )

  // Change currency for accounts
  const changeCurrency = useCallback(
    (newCurrency: Currency) => {
      if (newCurrency === constructionAccount.currency && newCurrency === financeAccount.currency) {
        return // No change needed
      }

      // Update construction account
      if (newCurrency !== constructionAccount.currency) {
        const updatedConstructionAccount = {
          ...constructionAccount,
          total: convertCurrency(constructionAccount.total, constructionAccount.currency, newCurrency),
          used: convertCurrency(constructionAccount.used, constructionAccount.currency, newCurrency),
          remaining: convertCurrency(constructionAccount.remaining, constructionAccount.currency, newCurrency),
          currency: newCurrency,
        }
        setConstructionAccount(updatedConstructionAccount)
      }

      // Update finance account
      if (newCurrency !== financeAccount.currency) {
        const updatedFinanceAccount = {
          ...financeAccount,
          total: convertCurrency(financeAccount.total, financeAccount.currency, newCurrency),
          used: convertCurrency(financeAccount.used, financeAccount.currency, newCurrency),
          remaining: convertCurrency(financeAccount.remaining, financeAccount.currency, newCurrency),
          currency: newCurrency,
        }
        setFinanceAccount(updatedFinanceAccount)
      }
    },
    [constructionAccount, financeAccount],
  )

  // Get recent transactions
  const getRecentTransactions = useCallback(
    (limit = 10) => {
      return [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit)
    },
    [transactions],
  )

  return {
    constructionAccount,
    financeAccount,
    transactions,
    loading,
    error,
    addConstructionTransaction,
    addFinanceTransaction,
    changeCurrency,
    getRecentTransactions,
  }
}
