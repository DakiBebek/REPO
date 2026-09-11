export default function TransactionList({ transactions }: { transactions: any[] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-bold mb-4">📋 Riwayat Transaksi</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transactions.map(t => (
          <div key={t.id} className="flex justify-between items-center p-3 border-b">
            <div>
              <p className="font-medium">{t.description || t.categories?.name || 'Tanpa deskripsi'}</p>
              <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString('id-ID')}</p>
            </div>
            <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {t.type === 'income' ? '+' : '-'}Rp {Number(t.amount).toLocaleString('id-ID')}
            </p>
          </div>
        ))}
        {transactions.length === 0 && <p className="text-gray-400 text-center py-4">Belum ada transaksi</p>}
      </div>
    </div>
  )
}