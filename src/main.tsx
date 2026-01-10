import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReadingThemeProvider } from './contexts/ReadingThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReadingThemeProvider>
      <App />
    </ReadingThemeProvider>
  </StrictMode>,
)
