// src/services/api.js
const API_URL = "https://bookish-broccoli-nue4.onrender.com/api"; // ✅ backend no Render

// --- LOGIN ---
export async function loginAdmin(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("admin_token", data.token);
    return true;
  } else {
    return false;
  }
}

export function logoutAdmin() {
  localStorage.removeItem("admin_token");
}

export function isAdmin() {
  return !!localStorage.getItem("admin_token");
}

// --- PACOTES ---
export async function loadPackages() {
  const res = await fetch(`${API_URL}/packages`);
  if (!res.ok) throw new Error("Erro ao carregar pacotes");
  return await res.json();
}

// NOVO/MELHORIA: Função para carregar um único pacote por slug
export async function loadPackageBySlug(slug) {
  const res = await fetch(`${API_URL}/packages/${slug}`);
  if (res.status === 404) return null; 
  if (!res.ok) throw new Error("Erro ao carregar pacote por slug");
  return await res.json();
}

export async function upsertPackage(pkg) {
  const res = await fetch(`${API_URL}/packages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pkg),
  });
  if (!res.ok) throw new Error("Erro ao salvar pacote");
  return await res.json();
}

export async function deletePackage(id) {
  const res = await fetch(`${API_URL}/packages/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao excluir pacote");
  return await res.json();
}