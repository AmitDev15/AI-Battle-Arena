import React from 'react'
import SolutionCard from './SolutionCard'
import JudgePanel from './JudgePanel'

export default function BattleBlock({ message, index }) {
  const { prompt, result, isLoading, error } = message

  const winner = result?.judge?.winner || ''
  const isModel1Winner =
    winner.toLowerCase().includes('model 1') ||
    winner.toLowerCase().includes('1')
  const isModel2Winner =
    winner.toLowerCase().includes('model 2') ||
    winner.toLowerCase().includes('2')

  return (
    <article
      className='battle-block animate-fade-in-up'
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className='battle-prompt-row'>
        <div className='battle-prompt-bubble'>
          <p className='battle-prompt-label'>Your Prompt</p>
          <p>{prompt}</p>
        </div>
      </div>

      {isLoading && (
        <div className='battle-loading'>
          <div className='battle-loading-header'>
            <span className='battle-loading-dot-wrap'>
              <span className='battle-loading-dot-ping animate-pulse-glow' />
              <span className='battle-loading-dot' />
            </span>
            <span className='battle-loading-copy'>
              Both models are generating answers...
            </span>
          </div>
          <div className='battle-loading-grid'>
            {[1, 2].map((item) => (
              <div key={item} className='battle-loading-card'>
                <div className='skeleton skeleton-sm animate-shimmer' />
                <div className='skeleton skeleton-full animate-shimmer' />
                <div className='skeleton skeleton-mid animate-shimmer' />
                <div className='skeleton skeleton-box animate-shimmer' />
              </div>
            ))}
          </div>
          <div className='battle-loading-card'>
            <div className='skeleton skeleton-md animate-shimmer' />
            <div className='skeleton skeleton-full animate-shimmer' />
            <div className='skeleton skeleton-wide animate-shimmer' />
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className='battle-error'>
          <p className='battle-error-title'>Unable to complete this battle.</p>
          <p className='battle-error-text'>{error}</p>
        </div>
      )}

      {result && !isLoading && (
        <div className='battle-results'>
          <div className='battle-results-heading'>
            <div className='battle-divider' />
            <span>Model Comparison</span>
            <div className='battle-divider' />
          </div>

          <div className='battle-solutions-grid'>
            <SolutionCard
              model='model1'
              title='Model 1'
              content={result.solution_1}
              isWinner={isModel1Winner}
            />
            <SolutionCard
              model='model2'
              title='Model 2'
              content={result.solution_2}
              isWinner={isModel2Winner}
            />
          </div>

          <JudgePanel judge={result.judge} />
        </div>
      )}
    </article>
  )
}
