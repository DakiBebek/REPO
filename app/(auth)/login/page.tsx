'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError(error.message)
    } else {
      // 1. Refresh server components agar membaca cookie sesi yang baru
      router.refresh()
      
      // 2. Baru arahkan ke dashboard
      router.push('/')
    }
  }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">🔐 Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4" required />
        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">Masuk</button>
        <p className="text-center mt-4 text-sm">Belum punya akun? <Link href="/register" className="text-indigo-600">Daftar</Link></p>
      </form>
    </div>
  )
}
