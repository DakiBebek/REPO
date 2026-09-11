'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function TransactionList({ transactions }: { transactions: any[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return
    
    setDeletingId(id)
    
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    
    if (error) {
      alert('Gagal menghapus: ' + error.message)
    } else {
      router.refresh()
    }
    
    setDeletingId(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">📋 Riwayat Transaksi</h3>
        <p className="text-gray-400 text-center py-8">Belum ada transaksi</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-bold mb-4 text-lg">📋 Riwayat Transaksi</h3>
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {transactions.map(t => (
          <div 
            key={t.id} 
            className={`flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition ${
              deletingId === t.id ? 'opacity-50' : ''
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {t.categories?.icon && <span>{t.categories.icon}</span>}
                <p className="font-medium">
                  {t.description || t.categories?.name || 'Tanpa kategori'}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                📅 {formatDate(t.date)}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <p className={`font-bold text-lg ${
                t.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {t.type === 'income' ? '+' : '-'}Rp {Number(t.amount).toLocaleString('id-ID')}
              </p>
              
              <button
                onClick={() => handleDelete(t.id)}
                disabled={deletingId === t.id}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                title="Hapus transaksi"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
