import SocketIO from 'socket.io-client'
import { useEffect, useState } from 'react'
import { State } from '../types/State'
import { Mode } from '../types/Mode'
import { Board, Color, GameResult, Point, Tile } from 'reversi-core'
import { BoardController } from '../components/Board'
import { Player } from '../types/Player'

/**
 * Home component.
 */
export const Home = (): React.ReactNode => {
  const [state, setState] = useState<State>('connecting')
  const [mode, setMode] = useState<Mode>('watcher')
  const [board, setBoard] = useState(new Board())
  const [onPut, setOnPut] = useState<(point: Point) => void>()
  const [me, setMe] = useState<Player>()
  const [enemy, setEnemy] = useState<Player>()
  const [turn, setTurn] = useState<Color>()
  const [result, setResult] = useState<GameResult>()
  const [lastPut, setLastPut] = useState<Point>()

  const reload = () => {
    location.reload()
  }

  useEffect(() => {
    const io = SocketIO('http://192.168.3.5:3001')

    setInterval(() => {
      io.emit('heartbeat')
    }, 100)

    let name = 'unnamed'
    const matched = location.search.match(/nick=(.*)/)
    if (matched) {
      console.log(matched[1])
      name = matched[1]
    }

    setOnPut(() => (point: Point) => {
      io.emit('put', point)
    })

    io.emit('client', name)

    io.on('ok', () => {
      setState('waiting')
    })

    io.on('state', (state: State) => {
      setState(state)
      console.log('state', state)
    })

    io.on('mode', (mode: Mode) => {
      setMode(mode)
      console.log('mode', mode)
    })

    io.on('board', (board: Tile[]) => {
      setBoard(new Board(8, 8, board))
    })

    io.on('me', (me) => {
      setMe(me)
    })

    io.on('enemy', (enemy) => {
      setEnemy(enemy)
    })

    io.on('turn', (turn) => {
      setTurn(turn)
    })

    io.on('finish', (result) => {
      setResult(result)
    })

    io.on('put', (point) => {
      setLastPut(point)
    })
  }, [])

  if (state === 'connecting') {
    return <div>Connecting...</div>
  }

  if (state === 'waiting') {
    return <div>Waiting for other player...</div>
  }

  if (state === 'deleted') {
    return (
      <div>
        Deleted from connection. Please{' '}
        <a onClick={reload} href={location.href}>
          reload this page.
        </a>
      </div>
    )
  }

  return (
    <>
      <div className="container">
        <BoardController
          board={board}
          state={state}
          mode={mode}
          me={me}
          enemy={enemy}
          turn={turn}
          result={result}
          lastPut={lastPut}
          onPut={onPut}
        />
      </div>
      <style global jsx>{`
        html,
        body {
          padding: 0;
          margin: 0;
        }

        .container {
          width: 100%;
          height: 100vh;

          display: flex;

          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  )
}

export default Home
