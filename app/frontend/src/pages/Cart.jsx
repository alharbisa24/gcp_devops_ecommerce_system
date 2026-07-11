import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function Cart() {
  const { lines, subtotal, setQuantity, removeLine } = useCart()

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-lg text-slate-600">Your bag is empty.</p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Bag</h1>
      <p className="mt-1 text-sm text-slate-500">
        Adjust quantities or remove items before checkout.
      </p>

      <ul className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
        {lines.map((line) => (
          <li
            key={line.carId}
            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
          >
            <Link to={`/products/${line.car.id}`} className="flex shrink-0 gap-4 sm:w-2/3">
              <img src={line.car.image} alt="" className="h-24 w-36 rounded-lg object-cover" />
              <div>
                <p className="font-semibold text-slate-900 hover:text-slate-700">
                  {line.car.name}
                </p>
                <p className="text-sm text-slate-500">{line.car.year}</p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatPrice(line.car.price)} each
                </p>
              </div>
            </Link>

            <div className="flex flex-1 flex-wrap items-center justify-between gap-4 sm:justify-end">
              <div className="flex items-center gap-2">
                <label htmlFor={`qty-${line.carId}`} className="sr-only">
                  Quantity
                </label>
                <input
                  id={`qty-${line.carId}`}
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) =>
                    setQuantity(line.carId, Number(e.target.value) || 1)
                  }
                  className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-sm"
                />
              </div>
              <p className="min-w-[100px] text-right font-semibold text-slate-900">
                {formatPrice(line.car.price * line.quantity)}
              </p>
              <button
                type="button"
                onClick={() => removeLine(line.carId)}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-end gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-lg">
          <span className="text-slate-600">Subtotal </span>
          <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
        </p>
        <Link
          to="/checkout"
          className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow hover:bg-slate-700"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  )
}
