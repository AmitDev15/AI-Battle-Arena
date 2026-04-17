import React from 'react'
import { useArena } from '../context/ArenaContext'

export default function TopBar() {
  const { activeBattles } = useArena()

  return (
    <header className='topbar'>
      <div className='topbar-left'>
        <div className='topbar-brand-chip'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='topbar-brand-icon'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M8 21h8' />
            <path d='M12 17v4' />
            <path d='M7 4h10l-1 5a4 4 0 0 1-8 0L7 4Z' />
          </svg>
        </div>

        <div className='topbar-brand-copy'>
          <p className='topbar-kicker'>Arena Control</p>
          <p className='topbar-title'>AI Battle Arena</p>
        </div>

        <nav className='topbar-nav'>
          {['Arena', 'Leaderboard', 'Prompt Lab', 'Docs'].map((item, index) => (
            <button
              key={item}
              className={`topbar-nav-btn ${index === 0 ? 'is-active' : ''}`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className='topbar-right'>
        <label className='topbar-search'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='topbar-search-icon'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <circle cx='11' cy='11' r='8' />
            <path d='m21 21-4.3-4.3' />
          </svg>
          <input
            readOnly
            value='Search prompts, battles, docs'
            className='topbar-search-input'
          />
        </label>

        <button className='topbar-icon-btn' aria-label='Notifications'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='topbar-search-icon'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5' />
            <path d='M9 17a3 3 0 0 0 6 0' />
          </svg>
        </button>

        <div className='topbar-active-pill'>
          <span className='active-dot animate-pulse-glow' />
          Active: {activeBattles}
        </div>

        <button className='btn btn-primary topbar-cta'>New Battle</button>
      </div>
    </header>
  )
}
