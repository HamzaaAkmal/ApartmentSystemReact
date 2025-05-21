"use client"

import { useState, useCallback } from "react"

// Generic CRUD hook for managing any type of data
export function useCrud<T extends { id: string }>(initialData: T[]) {
  const [items, setItems] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create operation
  const create = useCallback((item: Omit<T, "id">) => {
    setLoading(true)
    setError(null)
    try {
      // Generate a unique ID (in a real app, this would come from the backend)
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newItem = { ...item, id } as T
      setItems((prevItems) => [...prevItems, newItem])
      setLoading(false)
      return newItem
    } catch (err) {
      setError("Failed to create item")
      setLoading(false)
      throw err
    }
  }, [])

  // Read operation (get all)
  const getAll = useCallback(() => {
    return items
  }, [items])

  // Read operation (get by id)
  const getById = useCallback(
    (id: string) => {
      return items.find((item) => item.id === id) || null
    },
    [items],
  )

  // Update operation
  const update = useCallback(
    (id: string, updates: Partial<T>) => {
      setLoading(true)
      setError(null)
      try {
        const itemIndex = items.findIndex((item) => item.id === id)
        if (itemIndex === -1) {
          throw new Error("Item not found")
        }

        const updatedItem = { ...items[itemIndex], ...updates } as T
        const updatedItems = [...items]
        updatedItems[itemIndex] = updatedItem

        setItems(updatedItems)
        setLoading(false)
        return updatedItem
      } catch (err) {
        setError("Failed to update item")
        setLoading(false)
        throw err
      }
    },
    [items],
  )

  // Delete operation
  const remove = useCallback(
    (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const filteredItems = items.filter((item) => item.id !== id)
        setItems(filteredItems)
        setLoading(false)
        return true
      } catch (err) {
        setError("Failed to delete item")
        setLoading(false)
        throw err
      }
    },
    [items],
  )

  // Filter operation
  const filter = useCallback(
    (filterFn: (item: T) => boolean) => {
      return items.filter(filterFn)
    },
    [items],
  )

  return {
    items,
    loading,
    error,
    create,
    getAll,
    getById,
    update,
    remove,
    filter,
    setItems,
  }
}
