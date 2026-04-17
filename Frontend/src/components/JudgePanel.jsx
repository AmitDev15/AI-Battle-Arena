import React from 'react'

function ScoreBar({ label, value, accentColor }) {
  return (
    <div className='score-row'>
      <div className='score-row-head'>
        <span className='score-row-label'>{label.replace('_', ' ')}</span>
        <span className='score-row-value' style={{ color: accentColor }}>
          {value}/10
        </span>
      </div>
      <div className='score-track'>
        <div
          className='score-fill'
          style={{
            width: `${(value / 10) * 100}%`,
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor})`,
            transition: 'width 0.8s ease-out',
          }}
        />
      </div>
    </div>
  )
}

function ScoreRing({ score, accentColor, size = 56 }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 10) * circ

  return (
    <div className='score-ring-wrap' style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox='0 0 56 56'
        className='score-ring-svg'
      >
        <circle
          cx='28'
          cy='28'
          r={r}
          fill='none'
          stroke='rgba(148,163,184,0.26)'
          strokeWidth='3.5'
        />
        <circle
          cx='28'
          cy='28'
          r={r}
          fill='none'
          stroke={accentColor}
          strokeWidth='3.5'
          strokeLinecap='round'
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <span className='score-ring-value' style={{ color: accentColor }}>
        {score}
      </span>
    </div>
  )
}

const SCORE_KEYS = [
  'correctness',
  'completeness',
  'clarity',
  'efficiency',
  'robustness',
]

export default function JudgePanel({ judge }) {
  const {
    solution_1,
    solution_2,
    winner,
    confidence,
    reasoning,
    tie_break_reason: tieBreakReason,
  } = judge || {}

  if (!solution_1 || !solution_2) {
    return null
  }

  const isModel1Winner =
    winner?.toLowerCase().includes('model 1') ||
    winner?.toLowerCase().includes('1')
  const isTie = winner?.toLowerCase().includes('tie')
  const confidencePercent = Math.max(
    0,
    Math.min(100, Math.round((confidence || 0) * 100)),
  )

  return (
    <section className='judge-panel'>
      <div className='judge-header'>
        <div className='judge-head-left'>
          <div className='judge-icon-wrap'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='judge-icon'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='m14 13-8.5 8.5a2.12 2.12 0 0 1-3-3L11 10' />
              <path d='m16 16 6-6' />
              <path d='m8 8 6-6' />
              <path d='m9 7 8 8' />
              <path d='m21 11-8-8' />
            </svg>
          </div>
          <div>
            <p className='judge-title'>Judge Analysis</p>
            <p className='judge-subtitle'>Score card and final verdict</p>
          </div>
        </div>
        <div className='judge-confidence'>Confidence: {confidencePercent}%</div>
      </div>

      <div className='judge-grid'>
        <ScoreCard
          title='Model 1 Score'
          accentColor='var(--color-model-1)'
          scores={solution_1}
          isWinner={isModel1Winner && !isTie}
        />

        <div className='judge-verdict'>
          <p className='judge-verdict-kicker'>Final Verdict</p>
          <p className='judge-verdict-title'>
            {isTie ? 'Tie' : isModel1Winner ? 'Model 1' : 'Model 2'}
          </p>
          <p className='judge-verdict-pill'>{winner || 'No winner provided'}</p>
          {tieBreakReason && tieBreakReason !== 'No Tie' && (
            <p className='judge-tie-reason'>
              Tie-break reason: {tieBreakReason}
            </p>
          )}
        </div>

        <ScoreCard
          title='Model 2 Score'
          accentColor='var(--color-model-2)'
          scores={solution_2}
          isWinner={!isModel1Winner && !isTie}
        />
      </div>

      <div className='judge-reasoning'>
        <p className='judge-reasoning-title'>Reasoning</p>
        <p className='judge-reasoning-text'>
          {reasoning || 'No judge reasoning returned.'}
        </p>
      </div>
    </section>
  )
}

function ScoreCard({ title, scores, accentColor, isWinner }) {
  return (
    <div className='score-card'>
      <div className='score-card-head'>
        <div className='score-card-head-left'>
          <ScoreRing
            score={scores.overall_score || 0}
            accentColor={accentColor}
          />
          <div>
            <p className='score-card-title' style={{ color: accentColor }}>
              {title}
            </p>
            <p className='score-card-subtitle'>Overall score out of 10</p>
          </div>
        </div>
        {isWinner && (
          <span
            className='score-card-winner'
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Winner
          </span>
        )}
      </div>

      <div className='score-card-rows'>
        {SCORE_KEYS.map((key) => (
          <ScoreBar
            key={key}
            label={key}
            value={scores[key] ?? 0}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  )
}
