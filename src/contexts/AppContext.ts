import { createContext } from 'react'

/**
 * AppContextData type.
 */
export type AppContextData = {
  name: string

  io?: SocketIOClient.Socket
}

export const defaultAppContextData: AppContextData = {
  name: 'NONAME',
}

export const AppContext = createContext(defaultAppContextData)
