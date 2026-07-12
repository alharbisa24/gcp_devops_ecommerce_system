import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const navClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth()
  const { totalItems } = useCart()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              A
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              Apple Store
            </span>
          </Link>

          <nav className="hidden flex-wrap items-center gap-1 md:flex">
            <NavLink to="/" className={navClass} end>
              Store
            </NavLink>
            <NavLink to="/cart" className={navClass}>
              Bag
              {totalItems > 0 && (
                <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">
                  {totalItems}
                </span>
              )}
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/orders" className={navClass}>
                  My Orders
                </NavLink>
                <span className="max-w-[140px] truncate px-2 text-sm text-slate-500">
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>
                  Log in
                </NavLink>
                <NavLink to="/register" className={navClass}>
                  Register
                </NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/cart"
              className="relative rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800"
            >
              Bag
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-xs text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to="/login"
              className="rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white"
            >
              Account
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        Apple Store — demo storefront with a modern, minimalist theme.
      </footer>
    </div>
  )
}
