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
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Open-ChatGPT-UI</title>
        <meta name="description" content="An open source ChatGPT style UI" />
      </Head>

      <main className="flex-1 flex flex-col">
        <ChatDisplay messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  )
}

export default Home