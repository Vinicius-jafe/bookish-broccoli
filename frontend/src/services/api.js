// src/services/api.js

const API_URL = "https://bookish-broccoli-nue4.onrender.com/api"; // ✅ backend no Render
export const API_ORIGIN = API_URL.replace(/\/api$/, "");

export function imageUrl(p) {
  if (!p) return p;
  if (/^https?:\/\//i.test(p)) return p;
  const normalized = p.startsWith("/") ? p : `/${p}`;
  return `${API_ORIGIN}${normalized}`;
}

// Função auxiliar para obter o token
function getAuthHeaders() {
    const token = localStorage.getItem("admin_token");
    if (!token) {
        // Você pode optar por lançar um erro ou retornar headers vazios,
        // mas é melhor ter uma verificação de token explícita nas chamadas.
        return {}; 
    }
    return {
        "Authorization": `Bearer ${token}`,
    };
}

// --- LOGIN ---
export async function loginAdmin(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("admin_token", data.token); // Usa a chave 'admin_token'
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

// ------------------------------------------------------------------
// --- FUNÇÃO NOVA: UPLOAD DE IMAGENS ---
// ------------------------------------------------------------------
/**
 * Envia um objeto FormData contendo as imagens para o backend.
 * @param {FormData} formData O objeto FormData contendo os arquivos sob a chave 'images'.
 * @returns {Promise<{ok: boolean, paths: string[]}>} Os caminhos dos arquivos salvos.
 */
export async function uploadPackageImages(formData) {
    const authHeaders = getAuthHeaders();
    if (!authHeaders.Authorization) {
        throw new Error("Usuário não autenticado para upload.");
    }

    // Crucial: Não defina Content-Type 'multipart/form-data' manualmente.
    // O navegador faz isso automaticamente para requisições com FormData.
    const res = await fetch(`${API_URL}/packages/upload-images`, {
        method: "POST",
        headers: authHeaders, // Inclui o token de autenticação
        body: formData, 
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Falha ao enviar arquivos de imagem.");
    }

    return await res.json(); // Retorna os paths salvos no backend
}


// ------------------------------------------------------------------
// --- PACOTES (COM AUTENTICAÇÃO ADICIONADA) ---
// ------------------------------------------------------------------

// Requisição GET (não precisa de token)
export async function loadPackages() {
  const res = await fetch(`${API_URL}/packages`);
  if (!res.ok) throw new Error("Erro ao carregar pacotes");
  return await res.json();
}

// Requisição GET (não precisa de token)
export async function loadPackageBySlug(slug) {
  const res = await fetch(`${API_URL}/packages/${slug}`);
  if (res.status === 404) return null; 
  if (!res.ok) throw new Error("Erro ao carregar pacote por slug");
  return await res.json();
}

// Requisição POST/PUT (agora exige token)
export async function upsertPackage(pkg) {
  const authHeaders = getAuthHeaders();
  
  const res = await fetch(`${API_URL}/packages`, {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        ...authHeaders, // Adiciona o token aqui
    },
    body: JSON.stringify(pkg),
  });
  if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Erro ao salvar pacote. Verifique a autenticação.");
  }
  return await res.json();
}

// Requisição DELETE (agora exige token)
export async function deletePackage(id) {
  const authHeaders = getAuthHeaders();
  
  const res = await fetch(`${API_URL}/packages/${id}`, { 
      method: "DELETE",
      headers: authHeaders, // Adiciona o token aqui
  });
  if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Erro ao excluir pacote. Verifique a autenticação.");
  }
  return await res.json();
}