'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function TransactionForm() {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // Format: YYYY-MM-DD
  const [categories, setCategories] = useState<any[]>([])
  const [newCat, setNewCat] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    if (data) setCategories(data)
  }

  const addCategory = async () => {
    if (!newCat.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
    const { data } = await supabase.from('categories').insert({
      user_id: user!.id,
      name: newCat.trim(),
      color: colors[Math.floor(Math.random() * colors.length)]
    }).select().single()
    
    if (data) {
      setCategories([...categories, data])
      setNewCat('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('transactions').insert({
      user_id: user!.id,
      amount: Number(amount),
      type,
      description: description.trim(),
      category_id: categoryId || null,
      date: date || new Date().toISOString().split('T')[0]
    })

    if (error) {
      alert('Gagal menyimpan transaksi: ' + error.message)
    } else {
      // Reset form
      setAmount('')
      setDescription('')
      setCategoryId('')
      setDate(new Date().toISOString().split('T')[0])
      router.refresh()
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="font-bold text-lg">➕ Tambah Transaksi</h3>
      
      {/* Tipe Transaksi */}
      <div>
        <label className="block text-sm font-medium mb-1">Tipe</label>
        <select 
          value={type} 
          onChange={e => setType(e.target.value)} 
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="expense">💸 Pengeluaran</option>
          <option value="income">💰 Pemasukan</option>
        </select>
      </div>

      {/* Jumlah */}
      <div>
        <label className="block text-sm font-medium mb-1">Jumlah (Rp)</label>
        <input 
          type="number" 
          placeholder="0" 
          value={amount} 
          onChange={e => setAmount(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          required 
          min="1"
        />
      </div>

      {/* Tanggal */}
      <div>
        <label className="block text-sm font-medium mb-1">Tanggal</label>
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          required 
        />
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi (Opsional)</label>
        <input 
          type="text" 
          placeholder="Contoh: Makan siang" 
          value={description} 
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm font-medium mb-1">Kategori</label>
        <select 
          value={categoryId} 
          onChange={e => setCategoryId(e.target.value)} 
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tambah Kategori Baru */}
      <div>
        <label className="block text-sm font-medium mb-1">Atau Buat Kategori Baru</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Nama kategori" 
            value={newCat} 
            onChange={e => setNewCat(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="button" 
            onClick={addCategory}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Tombol Submit */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-medium"
      >
        {loading ? 'Menyimpan...' : '💾 Simpan Transaksi'}
      </button>
    </form>
  )
}
