import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './components/SiteShell';
import { PackagesList, PackageDetail } from './pages/Packages';
import Admin from './pages/Admin';
import About from './pages/About';
import ThankYou from './pages/ThankYou';
import { Toaster } from './components/ui/sonner';
import './index.css';

function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pacotes" element={<PackagesList />} />
          <Route path="/pacotes/:slug" element={<PackageDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/obrigado" element={<ThankYou />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
