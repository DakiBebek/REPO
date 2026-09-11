'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function TransactionForm() {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [newCat, setNewCat] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => setCategories(data || []))
  }, [])

  const addCategory = async () => {
    if (!newCat) return
    const { data: { user } } = await supabase.auth.getUser()
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
    const { data } = await supabase.from('categories').insert({
      user_id: user!.id, name: newCat, color: colors[Math.floor(Math.random() * colors.length)]
    }).select().single()
    if (data) { setCategories([...categories, data]); setNewCat('') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('transactions').insert({
      user_id: user!.id, amount: Number(amount), type, description, category_id: categoryId || null
    })
    setAmount(''); setDescription(''); setCategoryId('')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-bold mb-4">➕ Tambah Transaksi</h3>
      <div className="space-y-3">
        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded">
          <option value="expense">Pengeluaran</option>
          <option value="income">Pemasukan</option>
        </select>
        <input type="number" placeholder="Jumlah (Rp)" value={amount} onChange={e => setAmount(e.target.value)}
          className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Deskripsi" value={description} onChange={e => setDescription(e.target.value)}
          className="w-full p-2 border rounded" />
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Pilih Kategori</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="text" placeholder="Kategori baru" value={newCat} onChange={e => setNewCat(e.target.value)}
            className="flex-1 p-2 border rounded" />
          <button type="button" onClick={addCategory} className="bg-gray-200 px-3 rounded">+</button>
        </div>
        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">Simpan</button>
      </div>
    </form>
  )
}