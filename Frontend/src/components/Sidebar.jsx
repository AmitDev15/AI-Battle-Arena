import React from 'react'
import { useArena } from '../context/ArenaContext'

export default function Sidebar() {
  const { messages, clearMessages } = useArena()

  return (
    <aside className='sidebar'>
      <div className='sidebar-brand-card'>
        <p className='sidebar-brand-title'>Arena Deck</p>
        <p className='sidebar-brand-subtitle'>Operator Console</p>
        <p className='sidebar-tier-badge'>Premium Tier Enabled</p>
      </div>

      <nav className='sidebar-nav'>
        <NavItem
          active
          label='Launch Battle'
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='sidebar-icon-svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M12 5v14M5 12h14' />
            </svg>
          }
          onClick={clearMessages}
        />
        <NavItem label='History' icon={<DotIcon />} />
        <NavItem label='Models' icon={<DotIcon />} />
        <NavItem label='Settings' icon={<DotIcon />} />
      </nav>

      <div className='sidebar-stat-card'>
        <p className='sidebar-card-label'>Active Sessions</p>
        <p className='sidebar-stat-value'>{messages.length}</p>
      </div>

      <div className='sidebar-tip-card'>
        <p className='sidebar-tip-text'>
          Weekly usage is at 73%. Upgrade for unlimited tournaments.
        </p>
      </div>

      <div className='sidebar-footer'>
        <button className='btn btn-primary sidebar-upgrade-btn'>
          Upgrade to Pro
        </button>
      </div>
    </aside>
  )
}

function NavItem({ label, icon, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`sidebar-nav-item ${active ? 'is-active' : ''}`}
    >
      <span className='sidebar-nav-icon'>{icon}</span>
      {label}
    </button>
  )
}

function DotIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='sidebar-icon-svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <circle cx='12' cy='12' r='8' />
      <path d='M12 8v4l2.5 2.5' />
    </svg>
  )
}
