import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import {
  HelmetProvider,
} from "react-helmet-async"

// Add error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;">Error: ${e.error?.message || 'Unknown error'}</div>`;
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  document.body.innerHTML = `<div style="padding: 20px; color: red;">Promise rejection: ${e.reason?.message || 'Unknown error'}</div>`;
});

try {
  const container = document.getElementById("root") as HTMLDivElement;
  if (!container) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(container);
  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;">Render error: ${error.message}</div>`;
}
