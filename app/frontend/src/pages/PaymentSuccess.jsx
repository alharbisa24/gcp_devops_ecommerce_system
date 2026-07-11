import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { getOrderByNumber } from '../api/orders'

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(n))
}

export default function PaymentSuccess() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const initialOrder = location.state?.order ?? null
  const orderNumber = initialOrder?.order_number ?? searchParams.get('order')
  const [order, setOrder] = useState(initialOrder)
  const [isLoading, setIsLoading] = useState(!initialOrder && !!orderNumber)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialOrder || !orderNumber) return

    let cancelled = false
    getOrderByNumber(orderNumber)
      .then((data) => {
        if (!cancelled) setOrder(data)
      })
      .catch(() => {
        if (!cancelled) setError('Order details are temporarily unavailable.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [initialOrder, orderNumber])

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-blue-100 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Payment successful</h1>
      <p className="mt-2 text-slate-600">
        Thank you for your order. Your order has been saved.
      </p>
      <p className="mt-6 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900">
        Order ID: <span className="font-mono font-semibold">{orderNumber ?? '—'}</span>
      </p>
      {isLoading ? <p className="mt-4 text-sm text-slate-500">Loading order details...</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {order ? (
        <div className="mt-6 rounded-lg border border-slate-200 text-left">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Order summary</p>
            <p className="text-xs text-slate-500">Status: {order.status}</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 px-4 py-3 text-sm">
                <span className="text-slate-600">
                  {item.product_name} × {item.quantity}
                </span>
                <span className="font-medium text-slate-900">{formatPrice(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <p className="flex justify-between border-t border-slate-100 px-4 py-3 font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatPrice(order.total_amount)}</span>
          </p>
        </div>
      ) : null}
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Back to store
      </Link>
    </div>
  )
}
