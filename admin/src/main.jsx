import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import ShelterContextProvider from './context/ShelterContext.jsx'
import AppContextProvider from './context/AppContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <ShelterContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </ShelterContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)
