import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import StatsChart from '@/components/StatsChart'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*, categories(name, color, icon)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
  }

  // Pastikan transactions adalah array, bahkan jika null
  const safeTransactions = transactions || []

  const totalIncome = safeTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
    
  const totalExpense = safeTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">💰 Dashboard Keuangan</h1>
          <form action="/api/auth/logout" method="post">
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
          </form>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Pemasukan</p>
            <p className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-red-600">Rp {totalExpense.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Saldo</p>
            <p className="text-2xl font-bold text-indigo-600">Rp {(totalIncome - totalExpense).toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Chart - Pastikan kirim array kosong jika null */}
        <StatsChart transactions={safeTransactions} />

        {/* Form & List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <TransactionForm />
          <TransactionList transactions={safeTransactions} />
        </div>
      </div>
    </div>
  )
}