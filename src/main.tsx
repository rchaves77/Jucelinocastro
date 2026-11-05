import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    console.error('Erro fatal ao renderizar a aplicação:', error);
    rootElement.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;padding:24px;text-align:center;background:#fff">
        <div>
          <h1 style="font-size:22px;color:#0F172A;margin:0 0 12px">Estamos ajustando o site</h1>
          <p style="color:#64748b;margin:0 0 20px">Recarregue a página em alguns instantes.</p>
          <button onclick="location.reload()" style="background:#E11D48;color:#fff;border:0;padding:12px 24px;border-radius:10px;font-weight:700;cursor:pointer">
            Recarregar
          </button>
        </div>
      </div>`;
  }
}
