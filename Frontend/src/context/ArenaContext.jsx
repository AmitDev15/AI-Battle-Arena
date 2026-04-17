import React, { createContext, useContext, useState, useCallback } from 'react'
import { sendPrompt } from '../services/arenaService'

/**
 * ArenaContext
 * Provides global state for the battle conversations.
 */
const ArenaContext = createContext(null)

export function ArenaProvider({ children }) {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)

  const activeBattles = messages.filter((msg) => msg.isLoading).length
  const isLoading = activeBattles > 0

  /**
   * Submits a new battle prompt.
   * Appends a loading message, then fills it in on resolution.
   */
  const submitBattle = useCallback(async (prompt) => {
    const normalizedPrompt = prompt.trim()
    if (!normalizedPrompt) return

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    // Add optimistic loading message
    setMessages((prev) => [
      ...prev,
      {
        id,
        prompt: normalizedPrompt,
        result: null,
        isLoading: true,
        error: null,
      },
    ])
    setError(null)

    try {
      const result = await sendPrompt(normalizedPrompt)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, result, isLoading: false } : msg,
        ),
      )
    } catch (err) {
      const errorMsg = err.message || 'Something went wrong. Please try again.'
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, isLoading: false, error: errorMsg } : msg,
        ),
      )
      setError(errorMsg)
    }
  }, [])

  /**
   * Clears all battle messages.
   */
  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const value = {
    messages,
    isLoading,
    activeBattles,
    error,
    submitBattle,
    clearMessages,
  }

  return <ArenaContext.Provider value={value}>{children}</ArenaContext.Provider>
}

/**
 * Hook to consume the ArenaContext.
 */
export function useArena() {
  const ctx = useContext(ArenaContext)
  if (!ctx) {
    throw new Error('useArena must be used within an ArenaProvider')
  }
  return ctx
}
