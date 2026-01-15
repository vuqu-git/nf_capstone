import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import App2 from "./App2.tsx";
import axios from "axios";

// Axios automatically detects a cookie named XSRF-TOKEN and sets the X-XSRF-TOKEN header with the cookie value on modifying requests (POST, PUT, DELETE):
axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true; // Add this line
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      {/*<BrowserRouter>*/}
      {/*  <App />*/}
      {/*</BrowserRouter>*/}

      <App2 />

  </StrictMode>,
)
