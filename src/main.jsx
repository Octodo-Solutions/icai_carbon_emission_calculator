import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#1A1E2E',
          color: '#fff',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      }}
    />
  </React.StrictMode>,
)
