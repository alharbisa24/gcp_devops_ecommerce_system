import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createOrder } from '../api/orders'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function Checkout() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { lines, subtotal, clearCart } = useCart()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState([])

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-600">Nothing to checkout.</p>
        <Link to="/cart" className="mt-4 inline-block text-slate-700 hover:underline">
          View bag
        </Link>
      </div>
    )
  }

  function goSuccess(order) {
    clearCart()
    navigate(`/payment/success?order=${encodeURIComponent(order.order_number)}`, {
      replace: true,
      state: { order },
    })
  }

  function goFailed() {
    navigate('/payment/failed', { replace: true })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setValidationErrors([])
    setIsSubmitting(true)

    try {
      const order = await createOrder({
        user_id: isAuthenticated ? user.id : null,
        user_email: isAuthenticated ? user.email : 'guest@example.com',
        user_name: isAuthenticated ? (user.full_name || user.username || name) : name,
        shipping_address: `${address}, ${city}`,
        items: lines.map((line) => ({
          item_id: line.car.id,
          title: line.car.name,
          price: line.car.price,
          quantity: line.quantity,
          image: line.car.image,
          model: line.car.model,
        })),
      })
      goSuccess(order)
    } catch (err) {
      setError(err.message || 'Unable to place order. Please try again.')
      setValidationErrors(err.validationErrors ?? [])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-5 lg:gap-10">
      <div className="lg:col-span-3">
        <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-1 text-sm text-slate-500">
          Demo checkout — no real payment is processed.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="co-name" className="block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="co-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>
          <div>
            <label htmlFor="co-address" className="block text-sm font-medium text-slate-700">
              Street address
            </label>
            <input
              id="co-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>
          <div>
            <label htmlFor="co-city" className="block text-sm font-medium text-slate-700">
              City
            </label>
            <input
              id="co-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p>{error}</p>
              {validationErrors.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {validationErrors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? 'Placing order...' : 'Place order'}
          </button>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-center text-xs text-slate-500">
              Demo: simulate a declined card without clearing the bag.
            </p>
            <button
              type="button"
              onClick={goFailed}
              className="mt-2 w-full rounded-full border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Simulate payment failed
            </button>
          </div>
        </form>
      </div>

      <aside className="mt-10 lg:col-span-2 lg:mt-0">
        <div className="sticky top-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((line) => (
              <li key={line.carId} className="flex justify-between gap-2 text-slate-600">
                <span>
                  {line.car.name} × {line.quantity}
                </span>
                <span className="shrink-0 font-medium text-slate-800">
                  {formatPrice(line.car.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 flex justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-900">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </p>
        </div>
      </aside>
    </div>
  )
}
