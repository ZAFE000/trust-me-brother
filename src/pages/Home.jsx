import React, { useState, useEffect } from 'react'
import { Post } from '../db'

const renderStars = (score) => {
  const stars = Math.min(Math.max(Math.round(score / 2), 0), 6)
  return '⭐'.repeat(stars) || '✨'
}

const PostCard = ({ post, user, onLike, onDislike, onDelete, liked, disliked, onOpenImage, commentValue, onCommentChange, onSubmitComment, onDeleteComment, onStartEditComment, onCancelEditComment, onChangeEditText, onSubmitEditComment, editingComments, editingTexts }) => {
  const trustScore = post.likes - post.dislikes
  const isOwner = post.authorUid === user.uid
  const images = post.images?.length ? post.images : post.image ? [post.image] : []
  
  return (
    <div className="card p-6 fade-in">
      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-3 mb-4">
          {images.map((src, index) => (
            <button
              type="button"
              key={index}
              onClick={() => onOpenImage(src)}
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
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <img
            src={post.authorPhoto}
            alt={post.author}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold text-gray-800">{post.author}</h3>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full dark:bg-slate-700 dark:text-slate-100">
            {post.type}
          </span>
          {isOwner && (
            <button
              onClick={() => onDelete(post.id)}
              className="text-sm text-red-600 hover:text-red-800 font-semibold transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">{renderStars(trustScore)} Trust Score: {trustScore}</p>
      </div>

      <div className="flex gap-2 pt-4 border-t dark:border-slate-700">
        <button
          onClick={() => onLike(post.id)}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
            liked
              ? 'bg-green-600 text-white shadow-sm dark:bg-emerald-500'
              : 'bg-gray-200 text-gray-800 hover:bg-green-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-green-600'
          }`}
        >
          👍 {post.likes}
        </button>
        <button
          onClick={() => onDislike(post.id)}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-400 ${
            disliked
              ? 'bg-red-600 text-white shadow-sm dark:bg-rose-500'
              : 'bg-gray-200 text-gray-800 hover:bg-red-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-red-600'
          }`}
        >
          👎 {post.dislikes}
        </button>
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500">{(post.comments || []).length} comments</p>
        </div>

        {(post.comments || []).length > 0 && (
          <div className="space-y-3 mb-4">
            {post.comments.slice(-3).map(comment => (
              <div key={comment.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-start gap-3 mb-2">
                  {comment.authorPhoto ? (
                    <img
                      src={comment.authorPhoto}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                      {comment.author?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">{comment.author}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{new Date(comment.createdAt).toLocaleString()}</p>
                      </div>
                      {(comment.authorUid === user.uid || post.authorUid === user.uid) && (
                        <div className="flex items-center gap-2">
                          {!editingComments[comment.id] ? (
                            <>
                              <button onClick={() => onStartEditComment(post.id, comment)} className="text-xs text-blue-600 dark:text-emerald-300">Edit</button>
                              <button onClick={() => onDeleteComment(post.id, comment.id)} className="text-xs text-red-600 dark:text-rose-300">Delete</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => onSubmitEditComment(post.id, comment.id)} className="text-xs text-green-600">Save</button>
                              <button onClick={() => onCancelEditComment(comment.id)} className="text-xs text-gray-500">Cancel</button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {editingComments[comment.id] ? (
                      <textarea
                        value={editingTexts[comment.id] || ''}
                        onChange={(e) => onChangeEditText(comment.id, e.target.value)}
                        className="input-field h-20 mt-3 w-full"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 dark:text-slate-300 mt-3">{comment.text}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <textarea
            value={commentValue || ''}
            onChange={(e) => onCommentChange(post.id, e.target.value)}
            placeholder="Write a comment..."
            className="input-field h-24 resize-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onSubmitComment(post.id)}
              className="btn-primary"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home({ user }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [userVotes, setUserVotes] = useState({})
  const [commentInputs, setCommentInputs] = useState({})
  const [editingComments, setEditingComments] = useState({})
  const [editingTexts, setEditingTexts] = useState({})
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const allPosts = await Post.getAll()
      setPosts(allPosts.reverse())
      
      // Load user votes
      const votes = {}
      allPosts.forEach(post => {
        votes[post.id] = {
          liked: post.likedBy?.includes(user.uid) || false,
          disliked: post.dislikedBy?.includes(user.uid) || false,
        }
      })
      setUserVotes(votes)
    } catch (error) {
      console.error('Load posts error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      const alreadyLiked = userVotes[postId]?.liked || false
      const isDisliked = userVotes[postId]?.disliked || false

      let likedBy = post.likedBy || []
      let dislikedBy = post.dislikedBy || []

      if (alreadyLiked) {
        likedBy = likedBy.filter(id => id !== user.uid)
      } else {
        if (!likedBy.includes(user.uid)) {
          likedBy = [...likedBy, user.uid]
        }
        if (isDisliked) {
          dislikedBy = dislikedBy.filter(id => id !== user.uid)
        }
      }

      const updatedPost = {
        ...post,
        likes: likedBy.length,
        dislikes: dislikedBy.length,
        likedBy,
        dislikedBy,
      }

      await Post.update(postId, updatedPost)
      
      setPosts(posts.map(p => (p.id === postId ? updatedPost : p)))
      setUserVotes({
        ...userVotes,
        [postId]: {
          liked: !alreadyLiked,
          disliked: false,
        },
      })
    } catch (error) {
      console.error('Like error:', error)
    }
  }

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm('Delete this post? This cannot be undone.')
    if (!confirmed) return

    try {
      await Post.delete(postId)
      setPosts(posts.filter(post => post.id !== postId))
      const nextVotes = { ...userVotes }
      delete nextVotes[postId]
      setUserVotes(nextVotes)
    } catch (error) {
      console.error('Delete post error:', error)
      alert('Unable to delete post. Please try again.')
    }
  }

  const handleCommentChange = (postId, text) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: text,
    }))
  }

  const handleAddComment = async (postId) => {
    const text = (commentInputs[postId] || '').trim()
    if (!text) return

    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      const nextComments = [
        ...(post.comments || []),
        {
          id: Date.now(),
          author: user.displayName,
          authorUid: user.uid,
          authorPhoto: user.photoURL,
          text,
          createdAt: new Date().toISOString(),
        },
      ]

      await Post.update(postId, { comments: nextComments })

      setPosts(posts.map(p => p.id === postId ? { ...p, comments: nextComments } : p))
      setCommentInputs(prev => ({ ...prev, [postId]: '' }))
    } catch (error) {
      console.error('Add comment error:', error)
    }
  }

  const handleDeleteComment = async (postId, commentId) => {
    const confirmed = window.confirm('Delete this comment?')
    if (!confirmed) return

    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      const nextComments = (post.comments || []).filter(c => c.id !== commentId)

      await Post.update(postId, { comments: nextComments })

      setPosts(posts.map(p => p.id === postId ? { ...p, comments: nextComments } : p))
      setEditingComments(prev => {
        const next = { ...prev }
        delete next[commentId]
        return next
      })
      setEditingTexts(prev => {
        const next = { ...prev }
        delete next[commentId]
        return next
      })
    } catch (error) {
      console.error('Delete comment error:', error)
    }
  }

  const handleStartEditComment = (postId, comment) => {
    setEditingComments(prev => ({ ...prev, [comment.id]: true }))
    setEditingTexts(prev => ({ ...prev, [comment.id]: comment.text }))
  }

  const handleChangeEditText = (commentId, text) => {
    setEditingTexts(prev => ({ ...prev, [commentId]: text }))
  }

  const handleCancelEdit = (commentId) => {
    setEditingComments(prev => {
      const next = { ...prev }
      delete next[commentId]
      return next
    })
    setEditingTexts(prev => {
      const next = { ...prev }
      delete next[commentId]
      return next
    })
  }

  const handleSubmitEdit = async (postId, commentId) => {
    try {
      const newText = (editingTexts[commentId] || '').trim()
      if (!newText) return

      const post = posts.find(p => p.id === postId)
      if (!post) return

      const nextComments = (post.comments || []).map(c => c.id === commentId ? { ...c, text: newText, editedAt: new Date().toISOString() } : c)

      await Post.update(postId, { comments: nextComments })

      setPosts(posts.map(p => p.id === postId ? { ...p, comments: nextComments } : p))
      handleCancelEdit(commentId)
    } catch (error) {
      console.error('Edit comment error:', error)
    }
  }

  const handleDislike = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      const alreadyDisliked = userVotes[postId]?.disliked || false
      const isLiked = userVotes[postId]?.liked || false

      let likedBy = post.likedBy || []
      let dislikedBy = post.dislikedBy || []

      if (alreadyDisliked) {
        dislikedBy = dislikedBy.filter(id => id !== user.uid)
      } else {
        if (!dislikedBy.includes(user.uid)) {
          dislikedBy = [...dislikedBy, user.uid]
        }
        if (isLiked) {
          likedBy = likedBy.filter(id => id !== user.uid)
        }
      }

      const updatedPost = {
        ...post,
        likes: likedBy.length,
        dislikes: dislikedBy.length,
        likedBy,
        dislikedBy,
      }

      await Post.update(postId, updatedPost)
      
      setPosts(posts.map(p => (p.id === postId ? updatedPost : p)))
      setUserVotes({
        ...userVotes,
        [postId]: {
          liked: false,
          disliked: !alreadyDisliked,
        },
      })
    } catch (error) {
      console.error('Dislike error:', error)
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
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="card p-12 mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src="/trustme logov2.png"
              alt="Logo"
              className="w-16 h-16 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white">
              TRUST ME <br /> <span className="text-green-600 dark:text-emerald-400">BROTHER</span>
            </h1>
          </div>
          <p className="text-xl text-gray-700 dark:text-slate-300 max-w-2xl mx-auto">
            Discover what the community trusts. Vote on posts and build your reputation.
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid-auto">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-600 text-lg">No posts yet. Be the first to create one! 🚀</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              user={user}
              onLike={handleLike}
              onDislike={handleDislike}
              onDelete={handleDeletePost}
              liked={userVotes[post.id]?.liked || false}
              disliked={userVotes[post.id]?.disliked || false}
              onOpenImage={setLightboxImage}
              commentValue={commentInputs[post.id] || ''}
              onCommentChange={handleCommentChange}
              onSubmitComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onStartEditComment={handleStartEditComment}
              onCancelEditComment={handleCancelEdit}
              onChangeEditText={handleChangeEditText}
              onSubmitEditComment={handleSubmitEdit}
              editingComments={editingComments}
              editingTexts={editingTexts}
            />
          ))
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
    </div>
  )
}
