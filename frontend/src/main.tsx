import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NewSkyleApp from './NewApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NewSkyleApp />
  </StrictMode>,
)
