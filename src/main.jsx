import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import './index.css'
import App from './App.jsx'
import './styles/global.css'
import { Provider } from 'react-redux'
import { store } from '../src/redux/store.jsx'
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HelmetProvider>
  </StrictMode>,
)