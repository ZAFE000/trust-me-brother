import React, { useEffect, useState } from 'react'

export default function ThemeToggle({ inline = false }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      if (window.matchMedia) return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (e) {}
    return false
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light') } catch (e) {}
  }, [isDark])

  const toggle = () => setIsDark(v => !v)

  const sizeClasses = inline ? 'h-8 w-14' : 'h-10 w-20'

  // Position: on small screens float at bottom-right; on md+ place near top-right (nav)
  const positionClasses = inline ? '' : 'fixed right-4 bottom-6 md:top-4 md:right-4 z-50'

  return (
    <button
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Toggle theme"
      className={`relative inline-flex items-center ${positionClasses} ${sizeClasses} rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400`}
    >
      <span className={`absolute inset-0 rounded-full ${isDark ? 'bg-slate-700/90' : 'bg-gray-200'}`} />
      <span className="sr-only">Toggle theme</span>
      <span className={`absolute top-1 ${isDark ? 'right-1' : 'left-1'} z-20 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-200`} />
    </button>
  )
}
