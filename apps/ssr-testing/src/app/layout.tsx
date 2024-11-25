import React from 'react'

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
