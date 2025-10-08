import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import GlobalStyles from './styles/GlobalStyles';

const root = ReactDOM.createRoot(document.getElementById('root'));

if (import.meta.env.DEV) {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <GlobalStyles />
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  root.render(
    <BrowserRouter>
      <AuthProvider>
        <GlobalStyles />
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}