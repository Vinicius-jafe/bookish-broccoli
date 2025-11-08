// Configurações da API
const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  console.error('A variável de ambiente REACT_APP_API_URL não está definida');
}

export const API_URL = {
  BASE: API_BASE_URL,
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PROFILE: `${API_BASE_URL}/auth/me`,
  },
  BANNER: `${API_BASE_URL}/banner`,
  PACKAGES: `${API_BASE_URL}/packages`,
};

// Configurações de upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 1,
};

// Configurações de tema
export const THEME = {
  BREAKPOINTS: {
    SM: 600,
    MD: 960,
    LG: 1280,
    XL: 1920,
  },
  TRANSITIONS: {
    DURATION: 300,
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export default {
  API_URL,
  UPLOAD_CONFIG,
  THEME,
};
