import Link from 'next/link'
import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext'

/**
 * Home component.
 */
export const Home = (): React.ReactNode => {
  const app = useContext(AppContext)

  if (!app.io) {
    return <>connecting...</>
  }

  return (
    <>
      <ul>
        <li>
          <Link href="/new">
            <a href="/new">Create room</a>
          </Link>
        </li>
        <li>
          <Link href="/join">
            <a href="/join">Join private room</a>
          </Link>
        </li>
      </ul>
    </>
  )
}

export default Home
