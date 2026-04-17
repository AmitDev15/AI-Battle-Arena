import React from 'react'
import MarkdownRenderer from './MarkdownRenderer'

export default function SolutionCard({ model, title, content, isWinner }) {
  const cfg = {
    model1: {
      accent: 'var(--color-model-1)',
      accentSoft: 'var(--color-model-1-soft)',
      label: 'Solution 1',
    },
    model2: {
      accent: 'var(--color-model-2)',
      accentSoft: 'var(--color-model-2-soft)',
      label: 'Solution 2',
    },
  }

  const c = cfg[model]

  return (
    <div
      className='solution-card'
      style={{
        borderColor: isWinner ? c.accent : 'var(--color-border-soft)',
      }}
    >
      <div className='solution-card-header'>
        <div className='solution-card-left'>
          <span className='solution-dot' style={{ background: c.accent }} />
          <p className='solution-title' style={{ color: c.accent }}>
            {title}
          </p>
          <span
            className='solution-badge'
            style={{ background: c.accentSoft, color: c.accent }}
          >
            {c.label}
          </span>
          {isWinner && (
            <span
              className='solution-winner-badge'
              style={{
                borderColor: c.accent,
                color: c.accent,
                background: c.accentSoft,
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='solution-winner-icon'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z' />
              </svg>
              WINNER
            </span>
          )}
        </div>
        <p className='solution-subtitle'>Generated answer</p>
      </div>

      <div className='solution-body'>
        <MarkdownRenderer content={content} model={model} />
      </div>
    </div>
  )
}
