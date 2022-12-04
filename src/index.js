import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <StrictMode>
    <Auth0Provider
      domain="dev-c7foor2uqlt6xurj.eu.auth0.com"
      clientId="daai0qbc4nIqNfDFgijsaOuGSWEnxgkx"
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
  document.getElementById('root')
);