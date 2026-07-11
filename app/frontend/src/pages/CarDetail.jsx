import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCarById } from '../data/cars'
import { useCart } from '../contexts/CartContext'

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function CarDetail() {
  const { id } = useParams()
  const car = id ? getCarById(id) : undefined
  const { addToCart } = useCart()
  const navigate = useNavigate()

  if (!car) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-600">Product not found.</p>
        <Link to="/" className="mt-4 inline-block text-slate-700 hover:underline">
          Back to store
        </Link>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 text-sm font-medium text-slate-700 hover:underline"
      >
        ← Back
      </button>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid lg:grid-cols-2 lg:gap-0">
        <div className="aspect-[4/3] bg-slate-100 lg:aspect-auto lg:min-h-[420px]">
          <img src={car.image} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center p-6 md:p-10">
          <p className="text-sm font-medium text-slate-500">{car.year}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{car.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-slate-800">
            {formatPrice(car.price)}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">Storage</dt>
              <dd className="font-medium text-slate-800">{car.storage}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Chip</dt>
              <dd className="font-medium text-slate-800">{car.chip}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Display</dt>
              <dd className="font-medium text-slate-800">{car.display}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Color</dt>
              <dd className="font-medium text-slate-800">{car.color}</dd>
            </div>
          </dl>

          <p className="mt-8 text-slate-600 leading-relaxed">{car.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                addToCart(car.id, 1)
                navigate('/cart')
              }}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-slate-700"
            >
              Add to bag
            </button>
            <Link
              to="/"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              More products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
