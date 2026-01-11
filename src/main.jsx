import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CounterContextProvider } from './Context/CounterContext.jsx'
import AuthContextProvider from './Context/AuthContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CounterContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </CounterContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
)