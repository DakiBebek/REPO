'use client'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function StatsChart({ transactions }: { transactions: any[] }) {
  // Data per kategori untuk pie chart
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      const name = t.categories?.name || 'Lainnya'
      const existing = acc.find((x: any) => x.name === name)
      if (existing) existing.value += Number(t.amount)
      else acc.push({ name, value: Number(t.amount), color: t.categories?.color || '#8884d8' })
      return acc
    }, [])

  // Data per bulan untuk bar chart
  const monthlyData = transactions.reduce((acc: any, t) => {
    const month = new Date(t.date).toLocaleString('id-ID', { month: 'short' })
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 }
    if (t.type === 'income') acc[month].income += Number(t.amount)
    else acc[month].expense += Number(t.amount)
    return acc
  }, {})

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">📊 Pengeluaran per Kategori</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {categoryData.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">📈 Pemasukan vs Pengeluaran</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={Object.values(monthlyData)}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Pemasukan" />
            <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}