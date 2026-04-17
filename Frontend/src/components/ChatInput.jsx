import React, { useState } from 'react'
import { useArena } from '../context/ArenaContext'
import { useAutoResize } from '../hooks/useAutoResize'

export default function ChatInput() {
  const { submitBattle, activeBattles } = useArena()
  const [value, setValue] = useState('')
  const textareaRef = useAutoResize(value)
  const hasValue = value.trim().length > 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!hasValue) return
    submitBattle(value.trim())
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className='composer-wrap'>
      <form id='battle-form' onSubmit={handleSubmit} className='composer-form'>
        <div className='composer-icon-box'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='composer-icon'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.8'
          >
            <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
          </svg>
        </div>

        <div className='composer-input-stack'>
          <textarea
            id='battle-input'
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Drop your challenge prompt. Two models will answer and the judge will score every dimension.'
            rows={1}
            className='composer-input'
          />
          <p className='composer-help'>
            Enter to send, Shift + Enter for newline
          </p>
        </div>

        <button
          id='battle-submit-btn'
          type='submit'
          disabled={!hasValue}
          className='btn btn-primary composer-submit-btn'
        >
          <span>{activeBattles > 0 ? 'Queue' : 'Send'}</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='composer-submit-icon'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M5 12h14' />
            <path d='m12 5 7 7-7 7' />
          </svg>
        </button>
      </form>

      {activeBattles > 0 && (
        <div className='composer-status'>
          <span className='composer-status-dot-wrap'>
            <span className='composer-status-dot-ping animate-pulse-glow' />
            <span className='composer-status-dot' />
          </span>
          <span>
            {activeBattles} active battle{activeBattles > 1 ? 's' : ''} in
            progress
          </span>
        </div>
      )}
    </div>
  )
}
