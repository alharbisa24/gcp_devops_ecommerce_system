import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserOrders } from '../api/orders'
import { useAuth } from '../contexts/AuthContext'

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(n))
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function MyOrders() {
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setIsLoading(false)
      return
    }

    let cancelled = false
    getUserOrders(user.id)
      .then((data) => {
        if (!cancelled) setOrders(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load your orders right now.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, user?.id])

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
        <p className="mt-3 text-slate-600">Sign in to view your saved orders and order details.</p>
        <Link to="/login" className="mt-6 inline-block rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
          Log in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review your completed purchases, shipment details, and the items in each order.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading your orders...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
          You have no completed orders yet.
        </div>
      ) : null}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{order.order_number}</p>
                <p className="text-sm text-slate-500">Placed {formatDate(order.created_at)}</p>
              </div>
              <div className="text-sm text-slate-600">
                <p><span className="font-medium text-slate-900">Status:</span> {order.status}</p>
                <p><span className="font-medium text-slate-900">Total:</span> {formatPrice(order.total_amount)}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Items</h2>
                <ul className="mt-3 divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-800">{item.title}</p>
                        <p className="text-slate-500">{item.model ?? 'Apple device'} × {item.quantity}</p>
                      </div>
                      <span className="text-slate-900">{formatPrice(item.subtotal)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <h2 className="font-semibold text-slate-900">Shipping</h2>
                <p className="mt-2">{order.user_name}</p>
                <p>{order.user_email}</p>
                <p className="mt-2 whitespace-pre-line">{order.shipping_address || 'No shipping address provided.'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
