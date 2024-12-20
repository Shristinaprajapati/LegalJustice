import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import your App component
import './index.css'; // Import your global CSS styles (if any)

const root = ReactDOM.createRoot(document.getElementById('root')); // Ensure there's a <div id="root"></div> in your public/index.html
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
