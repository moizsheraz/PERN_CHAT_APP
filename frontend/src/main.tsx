import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import { Provider } from 'react-redux'
import SocketContextProvider from "./features/Socket/socket"

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <SocketContextProvider>
    <App />
    </SocketContextProvider>
  </Provider>,
    </BrowserRouter>
  </React.StrictMode>,
)
