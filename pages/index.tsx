import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import ChatDisplay from '../components/ChatDisplay'
import ChatInput from '../components/ChatInput'
import { Message } from '../types'

const Home: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      role: 'user',
      content: message,
      timestamp: Date.now()
    }
    setMessages([...messages, newMessage])
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Head>
        <title>ChatGPT</title>
        <meta name="description" content="An open source ChatGPT style UI" />
      </Head>

      <header className="px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold">ChatGPT</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {messages.length === 0 && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">What can I help with?</h1>
          </div>
        )}
        <ChatDisplay messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  )
}

export default Home