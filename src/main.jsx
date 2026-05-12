import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import SiteUnavailable from './components/SiteUnavailable.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/*
        Temporary public-site bypass: render the neutral unavailable screen instead of the
        normal routed application. To restore the original site later, swap this component
        back to <App /> and re-add the import above.
      */}
      <SiteUnavailable />
    </BrowserRouter>
  </StrictMode>,
)
