import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Post } from '../db'

const MAX_IMAGES = 5

export default function Create({ user }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [type, setType] = useState('achievement')
  const [description, setDescription] = useState('')
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length === 0) return

    if (selectedFiles.length > MAX_IMAGES) {
      setError(`คุณสามารถเลือกได้สูงสุด ${MAX_IMAGES} รูปเท่านั้น`)
    }

    const files = selectedFiles.slice(0, MAX_IMAGES)

    Promise.all(files.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })))
      .then((results) => {
        setError('')
        setImagePreviews(results)
      })
      .catch((loadError) => {
        console.error('Image load error:', loadError)
        setError('ไม่สามารถโหลดรูปภาพได้ กรุณาลองอีกครั้ง')
      })
  }

  const handleRemoveImage = (indexToRemove) => {
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    try {
      setLoading(true)
      setError('')

      const newPost = {
        title,
        type,
        description,
        image: imagePreviews[0] || null,
        images: imagePreviews,
        author: user.displayName,
        authorPhoto: user.photoURL,
        authorUid: user.uid,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        createdAt: new Date().toISOString(),
      }

      await Post.add(newPost)
      
      setTitle('')
      setType('achievement')
      setDescription('')
      setImagePreviews([])
      
      navigate('/')
    } catch (err) {
      console.error('Create post error:', err)
      setError('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Create a Post</h1>
        <p className="text-gray-600">Share your story and reach the community</p>
      </div>

      <div className="card p-8 fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Post Title
            </label>
            <input
              type="text"
              placeholder="What do you want to share?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Tell more about your post... (max 500 characters)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field h-24 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/500</p>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Post Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
            >
              <option value="achievement">Anime</option>
              <option value="question">Manga</option>
              <option value="story">Books</option>
              <option value="movies">Movies</option>
              <option value="idea">Games</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Images (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-600 text-sm">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500 text-xs mt-1">PNG, JPG, GIF up to {MAX_IMAGES} images</p>
                <p className="text-gray-500 text-xs mt-1">
                  {imagePreviews.length}/{MAX_IMAGES} selected
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 dark:bg-slate-900 dark:border-slate-700">
        <h3 className="font-bold text-blue-900 mb-2 dark:text-slate-100">💡 Tips</h3>
        <ul className="text-sm text-blue-900 space-y-1 dark:text-slate-200">
          <li>✓ Write a clear and descriptive title</li>
          <li>✓ Choose an appropriate post type</li>
          <li>✓ Add an image to make your post stand out</li>
          <li>✓ Posts with clear responses build your trust score</li>
        </ul>
      </div>
    </div>
  )
}
