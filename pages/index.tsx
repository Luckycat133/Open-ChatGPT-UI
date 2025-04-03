import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Open-ChatGPT-UI</title>
        <meta name="description" content="An open source ChatGPT style UI" />
      </Head>

      <main className="flex-1">
        {/* 聊天界面将在这里实现 */}
      </main>
    </div>
  )
}

export default Home