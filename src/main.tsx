import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch can be safely assigned if any library attempts setting it
try {
  const nativeFetch = window.fetch;
  if (nativeFetch) {
    let currentFetch = nativeFetch;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get() { return currentFetch; },
      set(val) { currentFetch = val; }
    });
  }
} catch {
  // ignore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

