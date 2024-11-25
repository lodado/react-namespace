import React from 'react'

import TestComponentWithProvider from './CounterExample'

const Home = async () => {
  await new Promise((res) => {
    setTimeout(res, 500)
  })

  return (
    <main>
      <div>
        <h1>Namespace Store Demo</h1>
        <TestComponentWithProvider />
      </div>
    </main>
  )
}

export default Home
