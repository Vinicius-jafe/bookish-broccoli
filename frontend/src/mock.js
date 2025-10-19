// Mock data store for EMPRESA DE TURISMO
// Centralized so we can later swap with real API without touching components

export const STORAGE_KEYS = {
  PACKAGES: "et_packages_v1",
  LEADS: "et_leads_v1",
  ADMIN: "et_admin_auth_v1"
};

// Seed packages (inspired by focoturismo.com.br structure)
const seedPackages = [
  {
    id: "jericoacoara-villa-paihia",
    slug: "reveillon-jericoacoara-villa-paihia",
    title: "Réveillon em Jericoacoara - Villa Paihia",
    type: "nacional",
    region: "Nordeste",
    destination: "Jericoacoara - CE",
    duration: 5,
    months: ["Dez"],
    priceFrom: 4290,
    featuredHome: true,
    images: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1600&auto=format&fit=crop"
    ],
    inclusions: ["Hospedagem", "Café da manhã", "Transfer"],
    shortDescription: "Viva o Ano Novo em um dos destinos mais desejados do Brasil.",
    longDescription: "Pacote especial de Réveillon com hospedagem selecionada, café da manhã e transfers. Consulte datas e condições."
  },
  {
    id: "salvador-dia-das-maes",
    slug: "dia-das-maes-salvador",
    title: "Dia das Mães em Salvador - BA",
    type: "nacional",
    region: "Nordeste",
    destination: "Salvador - BA",
    duration: 4,
    months: ["Mai"],
    priceFrom: 1890,
    featuredHome: true,
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop"
    ],
    inclusions: ["Hospedagem", "City Tour", "Café da manhã"],
    shortDescription: "Celebre em grande estilo na capital baiana.",
    longDescription: "Um roteiro pensado para momentos especiais com experiências culturais e gastronômicas em Salvador."
  },
  {
    id: "buenos-aires-classico",
    slug: "buenos-aires-argentina",
    title: "Buenos Aires - Argentina",
    type: "internacional",
    region: "América do Sul",
    destination: "Buenos Aires - AR",
    duration: 5,
    months: ["Jun", "Jul", "Ago"],
    priceFrom: 3390,
    featuredHome: true,
    images: [
      "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1600&auto=format&fit=crop"
    ],
    inclusions: ["Hospedagem", "City Tour", "Seguro Viagem"],
    shortDescription: "Descubra a capital portenha com charme e cultura.",
    longDescription: "Voo + hospedagem + city tour clássico. Datas flexíveis e opções de passeios adicionais."
  },
  {
    id: "caribe-natal",
    slug: "natal-no-caribe-cruzeiro",
    title: "Natal no Caribe a bordo do Costa Fascinosa",
    type: "internacional",
    region: "Caribe",
    destination: "Caribe",
    duration: 7,
    months: ["Dez"],
    priceFrom: 8990,
    featuredHome: true,
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26c3e5d1e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1600&auto=format&fit=crop"
    ],
    inclusions: ["Cabine", "Refeições", "Entretenimento"],
    shortDescription: "Celebre o Natal com muito sol e mar turquesa.",
    longDescription: "Cruzeiro com experiência completa. Consulte cabines, datas e aéreo opcional saindo de SP."
  },
  {
    id: "ilhabela-pet",
    slug: "ilhabela-velinn-pet-friendly",
    title: "Ilhabela - SP no Velinn Santa Tereza (Pet Friendly)",
    type: "nacional",
    region: "Sudeste",
    destination: "Ilhabela - SP",
    duration: 3,
    months: ["Out", "Nov"],
    priceFrom: 990,
    featuredHome: false,
    images: [
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1600&auto=format&fit=crop"
    ],
    inclusions: ["Hospedagem", "Café da manhã"],
    shortDescription: "Escapada perfeita com seu pet.",
    longDescription: "Final de semana em Ilhabela em hotel pet friendly com todo conforto."
  }
];

const seedTestimonials = [
  {
    id: "t1",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    text: "Experiência incrível! Tudo muito organizado e suporte perfeito.",
    name: "Mariana Souza"
  },
  {
    id: "t2",
    image: "https://images.unsplash.com/photo-1531123414780-f742a8f6eb1d?q=80&w=1200&auto=format&fit=crop",
    text: "Viagem dos sonhos realizada com a EMPRESA DE TURISMO!",
    name: "Carlos Lima"
  },
  {
    id: "t3",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    text: "Atendimento excelente e ótimas recomendações.",
    name: "Bianca Fernandes"
  }
];

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function loadPackages() {
  const existing = getStored(STORAGE_KEYS.PACKAGES, null);
  if (existing && Array.isArray(existing) && existing.length) return existing;
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(seedPackages));
  return seedPackages;
}

export function savePackages(pkgs) {
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(pkgs));
}

export function loadTestimonials() {
  return seedTestimonials;
}

export function saveLead(lead) {
  const leads = getStored(STORAGE_KEYS.LEADS, []);
  leads.push({ ...lead, id: Date.now().toString() });
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
}

export function loginAdmin(email, password) {
  const ok = email === "admin@site.com" && password === "admin123";
  if (ok) localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify({ token: "mock-admin-token", when: Date.now() }));
  return ok;
}

export function logoutAdmin() {
  localStorage.removeItem(STORAGE_KEYS.ADMIN);
}

export function isAdmin() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN);
    return !!(raw && JSON.parse(raw)?.token);
  } catch (e) {
    return false;
  }
}

export function upsertPackage(pkg) {
  const pkgs = loadPackages();
  const idx = pkgs.findIndex(p => p.id === pkg.id);
  if (idx >= 0) {
    pkgs[idx] = pkg;
  } else {
    pkgs.push({ ...pkg, id: pkg.id || self.crypto?.randomUUID?.() || String(Date.now()) });
  }
  savePackages(pkgs);
  return pkgs;
}

export function deletePackage(id) {
  const pkgs = loadPackages().filter(p => p.id !== id);
  savePackages(pkgs);
  return pkgs;
}

export const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];