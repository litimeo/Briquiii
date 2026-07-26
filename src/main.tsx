import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';

const mantineTheme = createTheme({
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  headings: { fontFamily: "'Outfit', sans-serif" },
  primaryColor: 'blue',
});

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
    <MantineProvider theme={mantineTheme}>
      <App />
      <Analytics />
    </MantineProvider>
  </StrictMode>,
);


