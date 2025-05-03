import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Provider } from "@/components/ui/provider"
import { AuthProvider } from "./components/AuthContext"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Provider>
          <App />
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
