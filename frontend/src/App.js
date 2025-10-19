import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/SiteShell";
import { PackagesList, PackageDetail } from "./pages/Packages";
import Admin from "./pages/Admin";
import { Toaster } from "./components/ui/sonner";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen">
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
