import React from 'react'

import { SuspenseWithNamespaceContext } from './CounterExample'

const Home = async () => {
  await new Promise((res) => {
    setTimeout(res, 500)
  })

  return (
    <main>
      <div>
        <h1>Namespace Store Demo</h1>
        <SuspenseWithNamespaceContext />
      </div>
    </main>
  )
}

export default Home
