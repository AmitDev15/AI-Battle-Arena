import React from 'react'

/**
 * Header
 * Top navigation bar with the arena branding.
 */
export default function Header({ onClear, hasMessages }) {
  return (
    <header className='legacy-header'>
      <div className='legacy-header-left'>
        <div className='legacy-logo'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='legacy-logo-icon'
          >
            <path d='m14.5 17.5 3 3' />
            <path d='M17 17l4-4' />
            <path d='M3.5 3.5 14 14' />
            <path d='m10 4 10 10' />
            <path d='M3.5 9.5 9.5 3.5' />
          </svg>
        </div>
        <div>
          <h1 className='legacy-title'>CompareX</h1>
          <p className='legacy-subtitle'>Two models. One judge. Zero mercy.</p>
        </div>
      </div>

      <div className='legacy-header-right'>
        <div className='legacy-live-pill'>
          <span className='legacy-live-dot animate-pulse-glow' />
          <span>Live Arena</span>
        </div>

        {hasMessages && (
          <button
            id='clear-messages-btn'
            onClick={onClear}
            className='legacy-clear-btn'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='legacy-clear-icon'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6' />
            </svg>
            Clear Arena
          </button>
        )}
      </div>
    </header>
  )
}
