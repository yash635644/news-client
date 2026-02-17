import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("CRITICAL: Root element not found");
  document.body.innerHTML = "<h1 style='color:red'>Critical Error: Root element missing.</h1>";
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error: any) {
    console.error("React Mount Error:", error);
    rootElement.innerHTML = `
      <div style="
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        font-family: sans-serif; 
        text-align: center;
        background-color: #f8fafc;
        color: #ef4444;
        padding: 20px;
      ">
        <h1 style="font-size: 24px; margin-bottom: 10px;">Application Failed to Load</h1>
        <p style="color: #334155; margin-bottom: 20px;">Please try refreshing the page.</p>
        <pre style="
          background: #e2e8f0; 
          padding: 15px; 
          border-radius: 8px; 
          text-align: left; 
          overflow: auto; 
          max-width: 800px;
          font-size: 12px;
          color: #0f172a;
          white-space: pre-wrap;
        ">Error: ${error?.message || String(error)}

Stack:
${error?.stack || 'No stack trace available'}</pre>
      </div>
    `;
  }
}