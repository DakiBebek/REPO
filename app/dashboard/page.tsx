import { redirect } from 'next/navigation'

export default function Home() {
  // Otomatis arahkan siapa pun yang buka root website ke halaman login
  redirect('/login')
}
