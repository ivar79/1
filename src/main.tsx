import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

const rawClientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "185697391194-bekne52lhc03q1tja6ac0megt72rgsgb.apps.googleusercontent.com";
const clientId = rawClientId.replace(/\s+/g, '');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
