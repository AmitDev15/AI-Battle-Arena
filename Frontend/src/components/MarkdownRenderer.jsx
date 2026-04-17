import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

const monoSyntaxTheme = {
  'pre[class*="language-"]': {
    color: '#f8fafc',
    background: '#0a0a0a',
  },
  'code[class*="language-"]': {
    color: '#f8fafc',
    background: '#0a0a0a',
    fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  },
  comment: { color: '#8a8a8a', fontStyle: 'italic' },
  prolog: { color: '#8a8a8a' },
  doctype: { color: '#8a8a8a' },
  cdata: { color: '#8a8a8a' },
  punctuation: { color: '#dddddd' },
  property: { color: '#dddddd' },
  tag: { color: '#f1f1f1', fontWeight: '600' },
  boolean: { color: '#e8e8e8' },
  number: { color: '#f1f1f1' },
  constant: { color: '#f1f1f1' },
  symbol: { color: '#f1f1f1' },
  deleted: { color: '#bcbcbc' },
  selector: { color: '#dedede' },
  'attr-name': { color: '#d8d8d8' },
  string: { color: '#f4f4f4' },
  char: { color: '#f4f4f4' },
  builtin: { color: '#f1f1f1' },
  inserted: { color: '#f4f4f4' },
  operator: { color: '#e2e2e2' },
  entity: { color: '#dddddd' },
  url: { color: '#dddddd' },
  variable: { color: '#e2e2e2' },
  atrule: { color: '#f1f1f1', fontWeight: '600' },
  'attr-value': { color: '#ededed' },
  function: { color: '#ffffff', fontWeight: '600' },
  keyword: { color: '#ffffff', fontWeight: '700' },
  regex: { color: '#ededed' },
  important: { color: '#ffffff', fontWeight: '700' },
  bold: { fontWeight: '700' },
  italic: { fontStyle: 'italic' },
}

export default function MarkdownRenderer({ content, model = 'model1' }) {
  const accentColor =
    model === 'model1'
      ? 'var(--color-text-primary)'
      : 'var(--color-text-secondary)'

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const codeString = String(children).replace(/\n$/, '')
          const hasLanguage = Boolean(match)
          const isMultiline = codeString.includes('\n')

          if (hasLanguage || isMultiline) {
            return (
              <div className='md-code-block'>
                <div className='md-code-toolbar'>
                  <div className='md-code-toolbar-left'>
                    <div className='md-code-dots'>
                      <span className='md-dot md-dot-model2' />
                      <span className='md-dot md-dot-judge' />
                      <span className='md-dot md-dot-model1' />
                    </div>
                    <span
                      className='md-code-language'
                      style={{ color: accentColor }}
                    >
                      {(match?.[1] || 'code').toUpperCase()}
                    </span>
                  </div>
                  <CopyButton code={codeString} accentColor={accentColor} />
                </div>

                <SyntaxHighlighter
                  style={monoSyntaxTheme}
                  language={match?.[1] || 'text'}
                  PreTag='div'
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    background: '#0a0a0a',
                    padding: '16px',
                    fontSize: '13px',
                    lineHeight: '1.7',
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily:
                        '"JetBrains Mono", "Fira Code", Consolas, monospace',
                    },
                  }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            )
          }

          return (
            <code
              className='md-inline-code'
              style={{
                color: accentColor,
                border: '1px solid var(--color-border-soft)',
              }}
              {...props}
            >
              {children}
            </code>
          )
        },

        h1: ({ children }) => <h1 className='md-h1'>{children}</h1>,
        h2: ({ children }) => <h2 className='md-h2'>{children}</h2>,
        h3: ({ children }) => <h3 className='md-h3'>{children}</h3>,
        p: ({ children }) => <p className='md-p'>{children}</p>,
        ul: ({ children }) => <ul className='md-ul'>{children}</ul>,
        ol: ({ children }) => <ol className='md-ol'>{children}</ol>,
        li: ({ children }) => (
          <li className='md-li'>
            <span
              className='md-li-dot'
              style={{ backgroundColor: accentColor }}
            />
            <span>{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong style={{ color: accentColor }}>{children}</strong>
        ),
        em: ({ children }) => <em className='md-em'>{children}</em>,
        blockquote: ({ children }) => (
          <blockquote
            className='md-blockquote'
            style={{ borderColor: accentColor }}
          >
            {children}
          </blockquote>
        ),
        hr: () => <hr className='md-hr' />,
      }}
    >
      {content || ''}
    </ReactMarkdown>
  )
}

function CopyButton({ code, accentColor }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button onClick={handleCopy} className='copy-btn'>
      {copied ? (
        <>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='copy-btn-icon'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <polyline points='20 6 9 17 4 12' />
          </svg>
          <span style={{ color: accentColor }}>Copied!</span>
        </>
      ) : (
        <>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='copy-btn-icon'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
            <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}
