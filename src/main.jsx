import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { makeServer } from './api/mirage'

// Start MirageJS server in development
if (import.meta.env.MODE === 'development') {
  makeServer({ environment: 'development' })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
