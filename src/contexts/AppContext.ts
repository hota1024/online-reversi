import { createContext } from 'react'

/**
 * AppContextData type.
 */
export type AppContextData = {
  connection: boolean

  name: string
}

export const defaultAppContextData: AppContextData = {
  connection: false,
  name: 'NONAME',
}

export const AppContext = createContext(defaultAppContextData)
