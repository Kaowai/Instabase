import { configureStore } from '@reduxjs/toolkit'
import signalRReducer from './signalRSlice'

const store = configureStore({
  reducer: {
    signalR: signalRReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
