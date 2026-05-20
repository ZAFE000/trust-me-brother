import React, { useState, useEffect } from 'react'
import { Post } from '../db'

const renderStars = (score) => {
  const stars = Math.min(Math.max(Math.round(score / 2), 0), 6)
  return '⭐'.repeat(stars) || '✨'
}

export default function Profile({ user }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [avatarError, setAvatarError] = useState(false)
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalDislikes: 0,
    trustScore: 0,
  })
  const [lightboxImage, setLightboxImage] = useState(null)

  const profileImage = user?.photoURL || user?.providerData?.[0]?.photoURL

  useEffect(() => {
    setAvatarError(false)
    loadUserPosts()
  }, [user, profileImage])

  const loadUserPosts = async () => {
    try {
      setLoading(true)
      const allPosts = await Post.getAll()
      const userPosts = allPosts.filter(post => post.authorUid === user.uid)
      setPosts(userPosts.reverse())

      // Calculate stats
      let totalLikes = 0
      let totalDislikes = 0

      userPosts.forEach(post => {
        totalLikes += post.likes || 0
        totalDislikes += post.dislikes || 0
      })

      const trustScore = totalLikes - totalDislikes

      setStats({
        totalPosts: userPosts.length,
        totalLikes,
        totalDislikes,
        trustScore,
      })
    } catch (error) {
      console.error('Load user posts error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="card p-8 mb-8 fade-in">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profileImage && !avatarError ? (
              <img
                src={profileImage}
                alt={user?.displayName || 'Profile'}
                onError={() => setAvatarError(true)}
                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-green-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center text-white text-5xl">
                {user?.displayName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {user?.displayName}
            </h1>
            <p className="text-gray-600 mb-4">
              {user?.email}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg dark:bg-slate-900 dark:border dark:border-slate-700">
                <p className="text-2xl font-bold text-gray-800 dark:text-slate-100">{stats.totalPosts}</p>
                <p className="text-sm text-gray-600 dark:text-slate-300">Posts</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg dark:bg-emerald-950 dark:border dark:border-slate-700">
                <p className="text-2xl font-bold text-green-600 dark:text-emerald-300">{stats.totalLikes}</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Likes</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg dark:bg-rose-950 dark:border dark:border-slate-700">
                <p className="text-2xl font-bold text-red-600 dark:text-rose-300">{stats.totalDislikes}</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Dislikes</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg dark:bg-amber-950 dark:border dark:border-slate-700">
                <p className="text-2xl font-bold text-yellow-600 dark:text-amber-300">{stats.trustScore}</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Trust Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Score Display */}
        <div className="mt-8 pt-8 border-t dark:border-slate-700">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2 dark:text-slate-400">Your Trust Rating</p>
            <div className="text-5xl mb-2">{renderStars(stats.trustScore)}</div>
            <p className="text-lg font-semibold text-gray-800 dark:text-slate-100">
              {Math.min(Math.max(Math.round(stats.trustScore / 2), 0), 6)}/6 Stars
            </p>
            <p className="text-sm text-gray-700 mt-2 dark:text-slate-200 font-medium">
              Based on community response
            </p>
          </div>
        </div>
      </div>

      {/* Your Posts */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Posts</h2>

        {posts.length === 0 ? (
          <div className="card p-12 text-center fade-in">
            <p className="text-gray-600 text-lg mb-4">You haven't created any posts yet.</p>
            <a
              href="/create"
              className="btn-primary inline-block"
            >
              Create Your First Post
            </a>
          </div>
        ) : (
          <div className="grid-auto">
            {posts.map(post => (
              <div key={post.id} className="card p-6 fade-in">
                {(post.images?.length || post.image) && (
              <div className="grid grid-cols-1 gap-3 mb-4">
                {(post.images?.length ? post.images : [post.image]).map((src, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setLightboxImage(src)}
                    className="group block overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <img
                      src={src}
                      alt={`${post.title} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}

                <div className="mb-3 flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full dark:bg-slate-700 dark:text-slate-100">
                    {post.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>

                <div className="mb-4 p-3 bg-gray-100 rounded-lg dark:bg-slate-900 dark:border dark:border-slate-700">
                  <p className="text-sm text-gray-700 dark:text-slate-200">
                    {renderStars(post.likes - post.dislikes)} Trust Score: {post.likes - post.dislikes}
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t dark:border-slate-700">
                  <div className="flex-1 bg-emerald-100 p-3 rounded-lg text-center dark:bg-emerald-950 dark:border dark:border-slate-700">
                    <p className="text-2xl font-bold text-green-700 dark:text-emerald-300">👍</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">{post.likes} likes</p>
                  </div>
                  <div className="flex-1 bg-rose-100 p-3 rounded-lg text-center dark:bg-rose-950 dark:border dark:border-slate-700">
                    <p className="text-2xl font-bold text-red-700 dark:text-rose-300">👎</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">{post.dislikes} dislikes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            aria-label="Close image"
          >
            ×
          </button>
          <img
            src={lightboxImage}
            alt="Full size"
            className="max-h-full max-w-full rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* Trust Level Info */}
      <div className="mt-12 card p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-slate-100">📊 How Trust Score Works</h3>
        <div className="space-y-4 text-gray-700 dark:text-slate-300">
          <div className="flex gap-4">
            <div className="flex-shrink-0 text-2xl">👍</div>
            <div>
              <p className="font-semibold dark:text-slate-100">Likes</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">Each like increases your trust score by +1</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 text-2xl">👎</div>
            <div>
              <p className="font-semibold dark:text-slate-100">Dislikes</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">Each dislike decreases your trust score by -1</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 text-2xl">⭐</div>
            <div>
              <p className="font-semibold dark:text-slate-100">Star Rating</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">Trust score is converted to stars (every 2 points = 1 star, max 6 stars)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
