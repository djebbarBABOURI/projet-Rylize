import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { UtilisateurAuthContextProvider } from "./context/UtilisateurAuthContext.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UtilisateurAuthContextProvider>
        <App />
      </UtilisateurAuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
