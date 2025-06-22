"use client"

import { useState } from 'react'
import isAuth from '../auth/isAuth'
import Remaining from './components/Remaining'

function RemainingPage() {
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const remaining = 100 - Number(amount)
    setResult(remaining)
  }

  return (
    <div className=" flex h-1/2 items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <Remaining />
      </div>
    </div>
  )
}

export default RemainingPage
