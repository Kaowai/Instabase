import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as signalR from '@microsoft/signalr'

interface SignalRState {
  isConnected: boolean
  connectionId: string | null
}

const initialState: SignalRState = {
  isConnected: false,
  connectionId: null
}

let connection: signalR.HubConnection | null = null

const signalRSlice = createSlice({
  name: 'signalR',
  initialState,
  reducers: {
    setConnectionId(state, action: PayloadAction<string>) {
      state.connectionId = action.payload
    },
    setIsConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload
    }
  }
})

export const { setConnectionId, setIsConnected } = signalRSlice.actions

export const initializeSignalR = (url: string) => async (dispatch: any) => {
  // If already connected, don't create new connection
  if (connection?.state === signalR.HubConnectionState.Connected) return

  // If there's an existing connection, stop it first
  if (connection) {
    await connection.stop()
    connection = null
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(url, {
      withCredentials: false,
      transport: signalR.HttpTransportType.WebSockets,
      skipNegotiation: true
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 20000]) // Retry intervals
    .configureLogging(signalR.LogLevel.Debug) // Add logging for debugging
    .build()

  // Set up connection event handlers
  connection.onclose(() => {
    console.log('SignalR connection closed')
    dispatch(setIsConnected(false))
    dispatch(setConnectionId(null))
  })

  connection.onreconnecting(() => {
    console.log('SignalR attempting to reconnect...')
    dispatch(setIsConnected(false))
  })

  connection.onreconnected((connectionId) => {
    console.log('SignalR reconnected with ID:', connectionId)
    dispatch(setIsConnected(true))
    dispatch(setConnectionId(connectionId || ''))
  })

  try {
    await connection.start()
    console.log('SignalR connected successfully')
    dispatch(setConnectionId(connection.connectionId || ''))
    dispatch(setIsConnected(true))

    // Set up message handler after successful connection
    connection.on('ReceiveNotification', (message: string) => {
      try {
        const parsedMessage = JSON.parse(message)
        console.log('Received notification:', parsedMessage)
        // Dispatch any necessary actions here
      } catch (error) {
        console.error('Error parsing notification:', error)
      }
    })
  } catch (err) {
    console.error('Error starting SignalR connection:', err)
    dispatch(setIsConnected(false))
    dispatch(setConnectionId(null))
    connection = null
  }
}

export const disconnectSignalR = () => async (dispatch: any) => {
  if (connection) {
    try {
      await connection.stop()
      console.log('SignalR disconnected successfully')
    } catch (err) {
      console.error('Error disconnecting SignalR:', err)
    } finally {
      dispatch(setIsConnected(false))
      dispatch(setConnectionId(null))
      connection = null
    }
  }
}

export const getSignalRConnection = () => connection

export default signalRSlice.reducer
