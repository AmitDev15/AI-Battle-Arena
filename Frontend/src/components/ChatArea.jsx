import React from 'react'
import { useArena } from '../context/ArenaContext'
import { useChatScroll } from '../hooks/useChatScroll'
import BattleBlock from './BattleBlock'
import EmptyState from './EmptyState'

/**
 * ChatArea
 * Scrollable battle conversation area.
 */
export default function ChatArea({ onSelectPrompt }) {
  const { messages } = useArena()
  const scrollRef = useChatScroll(messages.length)

  const panelClasses = 'chat-area-panel'

  if (messages.length === 0) {
    return (
      <div ref={scrollRef} className={panelClasses}>
        <div className='chat-area-content'>
          <EmptyState onSelectPrompt={onSelectPrompt} />
        </div>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className={panelClasses}>
      <div className='chat-area-content chat-area-feed'>
        {messages.map((msg, i) => (
          <BattleBlock key={msg.id} message={msg} index={i} />
        ))}
        <div className='chat-area-bottom-spacer' />
      </div>
    </div>
  )
}
