import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from '../firebase'
import { auth } from '../firebase'
import ThemeToggle from './ThemeToggle'

export default function Layout({ children, user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const profileImage = user?.photoURL || user?.providerData?.[0]?.photoURL

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Navbar */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-[90px]">

            {/* LEFT: Logo */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <img
                 src="public/trustme logov3.png"
                 alt="Trust Me Brother"
                  className="
                  w-20 
                  h-20 
                  object-contain
                 bg-transparent
                 transition-all
                 duration-300
                  hover:scale-105
                 "
                  style={{
                 backgroundColor: 'transparent',
                  imageRendering: 'auto',
                 }}/>
                <span className="text-2xl font-bold text-green-600 hover:text-green-700 transition dark:text-emerald-400">
                  TRUST ME BROTHER
                </span>
              </Link>
            </div>

            {/* RIGHT: Nav + User */}
            <div className="flex items-center gap-8">
              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-6">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/create', label: 'Create' },
                  { to: '/voting', label: 'Voting' },
                  { to: '/profile', label: 'Profile' },
                ].map((link) => {
                  const active = location.pathname === link.to
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`text-gray-700 dark:text-slate-200 px-3 py-1 rounded-md transition ${active ? 'bg-gray-100 dark:bg-slate-800 border-b-2 border-green-500 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-green-600'}`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              {/* User area */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:inline-flex items-center">
                  <ThemeToggle inline />
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  {profileImage && (
                    <img
                      src={profileImage}
                      alt={user.displayName || 'Profile'}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    {user?.displayName?.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex gap-4 pb-4 mt-4 border-t pt-4 dark:border-slate-800">
            <Link to="/" className="text-gray-700 hover:text-green-600 text-sm font-medium dark:text-slate-200 dark:hover:text-green-400">
              Home
            </Link>
            <Link to="/create" className="text-gray-700 hover:text-green-600 text-sm font-medium dark:text-slate-200 dark:hover:text-green-400">
              Create
            </Link>
            <Link to="/voting" className="text-gray-700 hover:text-green-600 text-sm font-medium dark:text-slate-200 dark:hover:text-green-400">
              Voting
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-green-600 text-sm font-medium dark:text-slate-200 dark:hover:text-green-400">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-8 border-t dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-gray-600 text-sm dark:text-slate-400">
            © 2026 Trust Me Brother. Built with React & Firebase.
          </p>
        </div>
      </footer>
    </div>
  )
}

