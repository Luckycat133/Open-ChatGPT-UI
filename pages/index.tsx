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

      {/* Keep header simple, potentially adjust styling later if needed */}
      <header className="px-6 py-3">
        <span className="text-lg font-medium">ChatGPT</span>
      </header>

      {/* Center content vertically and horizontally */}
      <main className="flex-1 flex flex-col items-center justify-start pt-16 px-4">
        {/* Always display the heading */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold">What can I help with?</h1>
        </div>
        {/* Place ChatInput directly below the heading */}
        <ChatInput onSendMessage={handleSendMessage} />
        {/* ChatDisplay is removed for now to match the initial state image */}
        {/* <ChatDisplay messages={messages} /> */}
      </main>
    </div>
  )
}

export default Home