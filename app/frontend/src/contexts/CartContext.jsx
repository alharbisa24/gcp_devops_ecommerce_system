/* eslint-disable react-refresh/only-export-components -- provider + hook pattern */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { cars } from '../data/cars'

const CartContext = createContext(null)

function loadInitial() {
  try {
    const raw = localStorage.getItem('cart')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitial)

  const persist = useCallback((updater) => {
    setItems((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem('cart', JSON.stringify(next))
      return next
    })
  }, [])

  const addToCart = useCallback(
    (carId, qty = 1) => {
      persist((prev) => {
        const i = prev.findIndex((x) => x.carId === carId)
        if (i === -1) return [...prev, { carId, quantity: qty }]
        const copy = [...prev]
        copy[i] = { ...copy[i], quantity: copy[i].quantity + qty }
        return copy
      })
    },
    [persist],
  )

  const setQuantity = useCallback(
    (carId, quantity) => {
      if (quantity < 1) {
        persist((prev) => prev.filter((x) => x.carId !== carId))
        return
      }
      persist((prev) =>
        prev.map((x) => (x.carId === carId ? { ...x, quantity } : x)),
      )
    },
    [persist],
  )

  const removeLine = useCallback(
    (carId) => {
      persist((prev) => prev.filter((x) => x.carId !== carId))
    },
    [persist],
  )

  const clearCart = useCallback(() => {
    persist([])
  }, [persist])

  const lines = useMemo(() => {
    return items
      .map((line) => {
        const car = cars.find((c) => c.id === line.carId)
        if (!car) return null
        return { ...line, car }
      })
      .filter(Boolean)
  }, [items])

  const totalItems = useMemo(
    () => items.reduce((n, x) => n + x.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, line) => sum + line.car.price * line.quantity, 0),
    [lines],
  )

  const value = useMemo(
    () => ({
      items,
      lines,
      totalItems,
      subtotal,
      addToCart,
      setQuantity,
      removeLine,
      clearCart,
    }),
    [
      items,
      lines,
      totalItems,
      subtotal,
      addToCart,
      setQuantity,
      removeLine,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
