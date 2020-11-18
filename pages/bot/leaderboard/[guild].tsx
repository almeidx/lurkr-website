import { useRouter } from 'next/router'

export default function Leaderboard() {
  const { query: { guild } } = useRouter()

  return <p>Guild ID: {guild}</p>
}
