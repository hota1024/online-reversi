import { useState } from 'react'
import { useRouter } from 'next/router'

/**
 * HomePage component.
 */
export const HomePage: React.FC = () => {
  const [nick, setNick] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const onGo = () => {
    if (nick === '') {
      setError('nickname is required')
      return
    }

    if (nick.length > 10) {
      setError('nickname length must be less than 10')
      return
    }

    if (!nick.match(/^[a-zA-Z0-9]+$/)) {
      setError('nickname is must be alphabet and number string')
      return
    }
    router.replace(`/game?nick=${nick}`)
  }

  return (
    <>
      Nickname:
      <input
        type="text"
        value={nick}
        onChange={({ target: { value } }) => setNick(value)}
      />
      <button onClick={onGo}>Go!</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </>
  )
}

export default HomePage
