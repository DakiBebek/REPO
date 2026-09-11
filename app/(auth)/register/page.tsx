'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError(error.message)
    } else {
      // 1. Refresh server components agar membaca cookie sesi yang baru
      router.refresh()
      
      // 2. Baru arahkan ke dashboard
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">📝 Daftar Akun</h1>
        {msg && <p className="text-sm mb-4 text-blue-600">{msg}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg mb-3" required />
        <input type="password" placeholder="Password (min 6 char)" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4" required minLength={6} />
        <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700">Daftar</button>
        <p className="text-center mt-4 text-sm">Sudah punya akun? <Link href="/login" className="text-purple-600">Login</Link></p>
      </form>
    </div>
  )
}
