import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// sets up a React development environment with SVG support and proxy rules to communicate with a backend server
// proxy configuration is especially useful for avoiding CORS issues during development
// * Seamless development: Frontend and backend can communicate without CORS (Cross-Origin Resource Sharing) issues
// * SVG as React components: Import SVGs directly as React components
// * Hot reloading: React Fast Refresh for instant updates during development
// => proxy essentially makes Vite dev server act as a middleman, forwarding API requests to your backend server while serving your React app, creating the illusion that everything runs on the same domain
// => i.e. configure Vite's development server to act as a proxy, forwarding specific requests from your frontend to your backend. From the browser's perspective, it's always talking to localhost:5173, so it never sees a cross-origin request, and CORS issues are completely avoided.

// Production vs Development Config
// typically proxy config is NOT NEEDED in production because:
// Development Setup
//     Frontend (Vite): http://localhost:5173
//     Backend (API):   http://localhost:8080
//
//   Different ports = CORS issues
//   Proxy needed to forward requests
//
// Production Setup
//     Option A: Same domain
//     Frontend: https://myapp.com
//     Backend:  https://myapp.com/api
//
//     Option B: Different domains with CORS
//     Frontend: https://myapp.com
//     Backend:  https://api.myapp.com (with CORS headers)

// What happens in production:
//   Vite builds static files (HTML, CSS, JS)
//   Proxy config is ignored - it only works in dev mode!
//   You handle routing differently:
//      Reverse proxy (nginx, Apache)
//      Same-origin deployment
//      Proper CORS headers on backend

//    Production example with nginx:
//     server {
//       location / {
//     # Serve React app
//       root /var/www/dist;
//     }
//
//       location /api {
//       # Forward to backend
//         proxy_pass http://localhost:8080;
//       }
//     }


// Is the proxy setting within vite.config.ts build inside jar file?
// => No, it's not built into the final JAR file. Vite's proxy configuration is primarily meant for development mode. It helps you route requests to different backends (such as an API) during local development, without needing to modify the source code or deal with CORS issues.


export default defineConfig({
  // svgr(): Plugin that transforms SVG files into React components
  // react(): Official Vite plugin for React support (JSX transformation, Fast Refresh, etc.)
  plugins: [svgr(), react()],
  server: {
    proxy: {  // configuration for proxying API requests during development!
      // Proxy all requests starting with `/api` to your Spring Boot backend; example: fetch request for `/api/film` gets proxied to `http://localhost:8080/api/film`
      // so in forntend code fetch('/api/users') can be written instead of fetch('http://localhost:8080/api/users')
      '/api': {
        target: 'http://localhost:8080',
        // No changeOrigin: Keeps the original Host header
      },

      // Proxy all requests starting with `/static-files` to your Spring Boot backend; example: `/static-files/film1.jpg` → `http://localhost:8080/static-files/surprise_film1.jpg`
      '/static-files': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },

      // THIS IS ABSOLUTELY REQUIRED because in my SPAConfiguration some handlers return/static/index.html as fallback to serve the SPA client-side routing (leading eventually to NotFound component)
      // when fetching this index.html, other related build files (e.g. index-Dojkaee9.js, index-DFM0NS6C.css, static assets like images, fonts) from /assets are loaded as well
      '/assets': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },

      // FAILS FAILS FAILS FAILS FAILS FAILS FAILS FAILS FAILS FAILS FAILS

      // -- ADD THIS RULE --
      //    http://localhost:5173/kinobesuch → was blocked because of a disallowed MIME type (“text/html”).
      //    http://localhost:5173/static-files/surprise_film44.jpg → NotFound
      //    http://localhost:5173/assets/index-Dojkaee9.js → code
      // Proxy requests for bundled assets (JS, CSS, etc.) and root files to Spring Boot.
      // This regex matches:
      //   - /favicon.ico, /manifest.json, etc.
      //   - /index-*.js, /index-*.css and other hashed assets
      //   - /assets/*
      // It avoids proxying Vite's own internal requests (like @vite/client).

      // '^/(assets|src|index.*\.js|.*\.css|.*\.ico|.*\.png|.*\.svg|.*\.jpg|manifest\.json)': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      // }

      // ---------------

      // // Add this to catch asset requests that get misdirected !!!
      //    http://localhost:5173/kinobesuch → fine
      //    http://localhost:5173/static-files/surprise_film44.jpg → NS_ERROR_CORRUPTED_CONTENT
      //    http://localhost:5173/assets/index-Dojkaee9.js → NotFound

      // '/static-files/assets': {
      //   target: 'http://localhost:5173',  // Route back to Vite
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/static-files/, ''), // Remove /static-files prefix
      // },

      // ---------------

      //    http://localhost:5173/kinobesuch → fine
      //    http://localhost:5173/static-files/surprise_film44.jpg → NS_ERROR_CORRUPTED_CONTENT
      //    http://localhost:5173/assets/index-Dojkaee9.js → NotFound

      // '/static-files': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      //   onProxyRes: (proxyRes) => {
      //     if (proxyRes.statusCode === 404) {
      //       proxyRes.statusCode = 200;
      //       proxyRes.headers['content-type'] = 'text/html';
      //     }
      //   },
      // },

      // ---------------

      //    http://localhost:5173/kinobesuch → fine
      //    http://localhost:5173/static-files/surprise_film44.jpg → NS_ERROR_CORRUPTED_CONTENT
      //    http://localhost:5173/assets/index-Dojkaee9.js → NotFound

      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:8080',
      //     changeOrigin: true,
      //   },
      //   '/static-files': {
      //     target: 'http://localhost:8080',
      //     changeOrigin: true,
      //     // The rewrite function below is important for handling the fallback
      //     rewrite: (path) => path.replace(/^\/static-files/, '/static-files'),
      //   },
      // },
      // // The historyApiFallback is an important part of handling these redirects
      // // for single-page applications. This tells the dev server to serve
      // // the index.html for any request that doesn't match an existing file.
      // historyApiFallback: {
      //   rewrites: [
      //     { from: /^\/static-files\/.*$/, to: '/index.html' },
      //   ],
      // },

      // ---------------

      //    http://localhost:5173/kinobesuch → fine
      //    http://localhost:5173/static-files/surprise_film44.jpg → NS_ERROR_CORRUPTED_CONTENT
      //    http://localhost:5173/assets/index-Dojkaee9.js → NotFound

      // '/static-files': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      //   onProxyRes: (proxyRes) => {
      //     if (proxyRes.statusCode === 404) {
      //       proxyRes.statusCode = 200;
      //       proxyRes.headers['content-type'] = 'text/html';
      //     }
      //   },
      // },

      // FAILS FAILS FAILS FAILS FAILS FAILS FAILS FAILS FAILS FAILS FAILS

    },

  }
})

// changeOrigin: Deep Dive
// ~~~~~~~~~~~~~~~~~~~~~~~
// changeOrigin controls whether the proxy "lies" to the target server about where the request came from
// Without changeOrigin: "Hi, I'm forwarding this request from localhost:5173"
// With changeOrigin: "Hi, I'm making this request directly to you (localhost:8080)"
// Most modern backends don't care about the Host header for simple API calls, but many production servers, security systems, and routing mechanisms do rely on it. When in doubt, use changeOrigin: true - it's the safer default and rarely causes issues while often preventing mysterious errors

// changeOrigin does NOT influence what's shown in the browser's address bar.
//    When you open a static image, the browser address bar always shows the original URL (=URL the browser initially requested) you requested, regardless of proxy settings
//    From the browser's point of view:
//       It made a request to localhost:3000/static-files/image.jpg
//       It got an image back
//       It displays the image with that URL
//    The browser has no idea that proxying happened - it's completely transparent. The proxy is purely a development convenience to avoid CORS issues.
// changeOrigin only affects the HTTP headers sent in the background request to the target server
