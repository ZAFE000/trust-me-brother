import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Poll } from '../db'

const PollCard = ({ poll, user, onVote, onDelete, hasVoted, userVote }) => {
  const totalVotes = poll.votes.reduce((a, b) => a + b, 0)
  const timeRemaining = new Date(poll.endTime) - new Date()
  const isActive = timeRemaining > 0
  const isOwner = poll.createdBy === user.uid

  return (
    <div className="card p-6 fade-in">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">{poll.question}</h3>
          <p className="text-xs text-gray-500">
            {Math.floor(timeRemaining / (1000 * 60 * 60))} hours remaining
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => onDelete(poll.id)}
            className="text-sm text-red-600 hover:text-red-800 font-semibold transition"
          >
            Delete
          </button>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {poll.options.map((option, index) => {
          const votes = poll.votes[index] || 0
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
          const isSelected = userVote === index

          return (
            <button
              key={index}
              onClick={() => isActive && onVote(poll.id, index)}
              disabled={!isActive || hasVoted}
              className="w-full text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className={`p-4 rounded-lg border-2 transition ${
                isSelected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-green-300'
              } ${!isActive ? 'bg-gray-100' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{option}</span>
                  <span className="text-sm font-bold text-gray-600">
                    {percentage}% ({votes})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {hasVoted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm text-center">
          ✓ You voted for: {poll.options[userVote]}
        </div>
      )}

      {!isActive && (
        <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm text-center">
          Poll ended
        </div>
      )}
    </div>
  )
}

export default function Voting({ user }) {
  const navigate = useNavigate()
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [userVotes, setUserVotes] = useState({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showMyPollsOnly, setShowMyPollsOnly] = useState(false)
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadPolls()
  }, [])

  const loadPolls = async () => {
    try {
      setLoading(true)
      const allPolls = await Poll.getAll()
      setPolls(allPolls.reverse())

      // Load user votes
      const votes = {}
      allPolls.forEach(poll => {
        const voterIndex = poll.voters?.indexOf(user.uid) ?? -1
        if (voterIndex !== -1) {
          votes[poll.id] = voterIndex
        }
      })
      setUserVotes(votes)
    } catch (error) {
      console.error('Load polls error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (pollId, optionIndex) => {
    if (userVotes[pollId] !== undefined) return

    try {
      const poll = polls.find(p => p.id === pollId)
      if (!poll) return

      const updatedVotes = [...poll.votes]
      updatedVotes[optionIndex] = (updatedVotes[optionIndex] || 0) + 1

      const updatedVoters = [...(poll.voters || []), user.uid]

      const updatedPoll = {
        ...poll,
        votes: updatedVotes,
        voters: updatedVoters,
      }

      await Poll.update(pollId, updatedPoll)

      setPolls(polls.map(p => (p.id === pollId ? updatedPoll : p)))
      setUserVotes({
        ...userVotes,
        [pollId]: optionIndex,
      })
    } catch (error) {
      console.error('Vote error:', error)
    }
  }

  const handleDeletePoll = async (pollId) => {
    const confirmed = window.confirm('Delete this poll? This cannot be undone.')
    if (!confirmed) return

    try {
      await Poll.delete(pollId)
      setPolls(polls.filter(poll => poll.id !== pollId))
      const nextVotes = { ...userVotes }
      delete nextVotes[pollId]
      setUserVotes(nextVotes)
    } catch (error) {
      console.error('Delete poll error:', error)
      alert('Unable to delete poll. Please try again.')
    }
  }

  const handleCreatePoll = async (e) => {
    e.preventDefault()

    if (!formData.question.trim()) {
      alert('Question is required')
      return
    }

    if (formData.options.some(opt => !opt.trim())) {
      alert('All options must be filled')
      return
    }

    try {
      setCreating(true)

      const newPoll = {
        question: formData.question,
        options: formData.options.map(opt => opt.trim()),
        votes: new Array(formData.options.length).fill(0),
        voters: [],
        createdBy: user.uid,
        createdByName: user.displayName,
        createdAt: new Date().toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }

      await Poll.add(newPoll)

      setFormData({
        question: '',
        options: ['', ''],
      })
      setShowCreateForm(false)
      await loadPolls()
    } catch (error) {
      console.error('Create poll error:', error)
      alert('Failed to create poll')
    } finally {
      setCreating(false)
    }
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ''],
    })
  }

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index),
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner"></div>
      </div>
    )
  }

  const visiblePolls = showMyPollsOnly
    ? polls.filter(poll => poll.createdBy === user.uid)
    : polls

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Voting</h1>
          <p className="text-gray-600">Participate in community polls and have your voice heard</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowMyPollsOnly(false)}
              className={`px-4 py-2 rounded-xl font-semibold ${showMyPollsOnly ? 'bg-gray-200 text-gray-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              All Polls
            </button>
            <button
              type="button"
              onClick={() => setShowMyPollsOnly(true)}
              className={`px-4 py-2 rounded-xl font-semibold ${showMyPollsOnly ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-700'}`}
            >
              My Polls
            </button>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            + Create Poll
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="card p-8 mb-8 fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Poll</h2>
          <form onSubmit={handleCreatePoll} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Poll Question
              </label>
              <input
                type="text"
                placeholder="What do you want to ask?"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="input-field"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="input-field flex-1"
                      maxLength={50}
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {formData.options.length < 5 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-3 text-green-600 hover:text-green-700 font-semibold text-sm"
                >
                  + Add Option
                </button>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Poll'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Polls Grid */}
      <div className="grid-auto">
        {visiblePolls.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-600 text-lg">
              {showMyPollsOnly
                ? 'You have no polls yet. Create one to see it here.'
                : 'No polls yet. Create one to get started! 🗳️'}
            </p>
          </div>
        ) : (
          visiblePolls.map(poll => (
            <PollCard
              key={poll.id}
              poll={poll}
              user={user}
              onVote={handleVote}
              onDelete={handleDeletePoll}
              hasVoted={userVotes[poll.id] !== undefined}
              userVote={userVotes[poll.id]}
            />
          ))
        )}
      </div>
    </div>
  )
}
