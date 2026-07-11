import { Link } from 'react-router-dom'

export default function PaymentFailed() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
        !
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Payment failed</h1>
      <p className="mt-2 text-slate-600">
        Your bank declined the charge or the session timed out. No money was taken in this demo.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/checkout"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Try checkout again
        </Link>
        <Link
          to="/cart"
          className="rounded-lg border border-blue-200 px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          View cart
        </Link>
      </div>
    </div>
  )
}
