import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/SiteShell";
import { PackagesList, PackageDetail } from "./pages/Packages";
import Admin from "./pages/Admin";
import { Toaster } from "./components/ui/sonner";
import "./index.css";

// Componente para gerenciar o script de rastreamento do RD Station
function RDTracking() {
  useEffect(() => {
    // Verifica se o script já existe
    if (!document.querySelector('script[src*="loader-scripts/a96ecee2-3e0a-4e8d-aae5-d6e614ff4f87-loader"]')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://d335luupugsy2.cloudfront.net/js/loader-scripts/a96ecee2-3e0a-4e8d-aae5-d6e614ff4f87-loader.js';
      document.body.appendChild(script);
    }

    // Limpeza ao desmontar o componente
    return () => {
      const script = document.querySelector('script[src*="loader-scripts/a96ecee2-3e0a-4e8d-aae5-d6e614ff4f87-loader"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
}

function App() {
  return (
    <div className="min-h-screen">
      <RDTracking />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pacotes" element={<PackagesList />} />
          <Route path="/pacotes/:slug" element={<PackageDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
