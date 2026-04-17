import React from 'react'

const EXAMPLES = [
  'Write a binary search algorithm in Python',
  'Explain how async/await works in JavaScript',
  'Implement a debounce function from scratch',
  'Sort an array using merge sort in TypeScript',
]

export default function EmptyState({ onSelectPrompt }) {
  return (
    <section className='empty-state'>
      <div className='empty-state-content'>
        <div className='empty-state-icon-wrap'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='empty-state-icon'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.7'
          >
            <path d='m14.5 17.5 3 3' />
            <path d='M17 17l4-4' />
            <path d='M3.5 3.5 14 14' />
            <path d='m10 4 10 10' />
            <path d='M3.5 9.5 9.5 3.5' />
          </svg>
        </div>

        <h2 className='empty-state-title'>Welcome to the Arena Floor</h2>
        <p className='empty-state-description'>
          Send one prompt. Two models duel in parallel. A judge grades every
          round with score-by-score reasoning.
        </p>

        <div className='legend-row'>
          <LegendDot label='Model 1' tone='model1' />
          <LegendDot label='Model 2' tone='model2' />
          <LegendDot label='Judge' tone='judge' />
        </div>

        <div className='empty-state-grid'>
          {EXAMPLES.map((prompt, index) => (
            <button
              key={index}
              id={`example-prompt-${index}`}
              onClick={() => onSelectPrompt(prompt)}
              className='example-card'
            >
              <span className='example-card-label'>
                Example Prompt
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='example-card-arrow'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M5 12h14' />
                  <path d='m12 5 7 7-7 7' />
                </svg>
              </span>
              <p className='example-card-text'>{prompt}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function LegendDot({ label, tone }) {
  return (
    <div className='legend-pill'>
      <span className={`legend-dot legend-dot-${tone}`} />
      <span className='legend-pill-text'>{label}</span>
    </div>
  )
}
