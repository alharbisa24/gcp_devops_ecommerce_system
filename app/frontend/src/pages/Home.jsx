import { Link } from 'react-router-dom'
import { cars } from '../data/cars'

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function Home() {
  return (
    <div>
      <section className="mb-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-6 py-12 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
          Apple Store demo
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Discover the latest Apple products.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
          Shop iPhone, Mac, iPad, Watch, AirPods, and Vision Pro with a polished storefront experience.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow hover:bg-slate-100"
        >
          Create an account
        </Link>
      </section>

      <h2 className="mb-6 text-xl font-semibold text-slate-800">Featured products</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <li key={car.id}>
            <Link
              to={`/products/${car.id}`}
              className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <div className="aspect-[3/2] overflow-hidden bg-slate-100">
                <img
                  src={car.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{car.name}</p>
                    <p className="text-sm text-slate-500">{car.year}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-slate-800">
                    {formatPrice(car.price)}
                  </p>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {car.description}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-slate-700 group-hover:underline">
                  View details
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
