import { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import socketio from 'socket.io-client'
import { AppContext, AppContextData } from '../contexts/AppContext'

const App = ({ Component, pageProps }: AppProps): React.ReactElement => {
  const [state, setState] = useState<AppContextData>(() => ({
    name: 'NO NAME',
  }))
  const [io] = useState(() => socketio('localhost:3001'))

  useEffect(() => {
    io.on('ok', () => {
      setState({ ...state, io })
      console.log(io)
    })
  }, [state])

  return (
    <>
      <AppContext.Provider value={state}>
        <Component {...pageProps} />
      </AppContext.Provider>
    </>
  )
}

export default App
