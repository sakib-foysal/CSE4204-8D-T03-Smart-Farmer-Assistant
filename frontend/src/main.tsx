import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { Toaster } from './app/components/ui/sonner';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
);
