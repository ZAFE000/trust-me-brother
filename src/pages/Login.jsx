import React from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, auth, googleProvider } from '../firebase'
// ThemeToggle intentionally removed from this page — toggle lives in navbar

export default function Login() {
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 login-page">
      <div className="text-center">
        {/* Hero Section */}
        <h1 className="text-6xl md:text-7xl font-black mb-4 text-gray-800 leading-tight">
          TRUST ME <br /> <span className="text-green-600">BROTHER</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Share your truth, vote on what matters, and build your trust score.
        </p>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-auto fade-in">
          <div className="mb-8">
            <img
              src="/trustme logo.png"
              alt="Welcome"
              className="w-24 h-24 mx-auto mb-4 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h2>
            <p className="text-gray-600 text-sm">
              Sign in with Google to get started
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.461,2.268,15.365,1.25,12.545,1.25c-6.343,0-11.5,5.157-11.5,11.5c0,6.343,5.157,11.5,11.5,11.5c6.343,0,11.5-5.157,11.5-11.5C24,13.75,23.685,11.893,23.111,10.239H12.545z" />
            </svg>
            Login with Google
          </button>

          <p className="text-gray-500 text-xs mt-6">
            By signing in, you agree to our Terms of Service
          </p>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-bold text-gray-800">Create Posts</h3>
            <p className="text-sm text-gray-600 mt-2">
              Share your stories and build your portfolio
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="font-bold text-gray-800">Trust Score</h3>
            <p className="text-sm text-gray-700 mt-2 dark:text-slate-200 font-medium">
              Earn stars based on community response
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🗳️</div>
            <h3 className="font-bold text-gray-800">Vote</h3>
            <p className="text-sm text-gray-600 mt-2">
              Participate in polls and decide together
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
