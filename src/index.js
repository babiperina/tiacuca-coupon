import React from 'react';
import ReactDOM from 'react-dom/client';  // Importa a nova API do React 18
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Cria a raiz para renderizar o aplicativo com a nova API do React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza o aplicativo
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
