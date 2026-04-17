import React, { useCallback } from 'react'
import { ArenaProvider, useArena } from '../context/ArenaContext'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import ChatInput from '../components/ChatInput'
import './App.css'

function AppShell() {
  const { submitBattle } = useArena()

  const handleSelectPrompt = useCallback(
    (prompt) => {
      submitBattle(prompt)
    },
    [submitBattle],
  )

  return (
    <div className='app-page'>
      <div className='app-shell'>
        <div className='app-shell-ornaments'>
          <span className='shell-orb shell-orb-gold' />
          <span className='shell-orb shell-orb-cyan' />
        </div>
        <TopBar />

        <div className='app-content'>
          <Sidebar />

          <main className='app-main'>
            <ChatArea onSelectPrompt={handleSelectPrompt} />
            <ChatInput />
          </main>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ArenaProvider>
      <AppShell />
    </ArenaProvider>
  )
}
