// Configurações da aplicação
export const config = {
  // Configuração da API
  api: {
    // URL base da API - será substituída pelo valor da variável de ambiente ou pelo valor padrão
    baseURL: process.env.REACT_APP_API_URL || '/api',
  },
  
  // Configurações do RD Station
  rdStation: {
    // ID da conta RD Station
    accountId: '1f5b6350-3c26-4b3d-95b7-4b2c65e57204',
    // URL do script do RD Station
    scriptUrl: 'https://d335luupugsy2.cloudfront.net/js/loader-scripts/1f5b6350-3c26-4b3d-95b7-4b2c65e57204-loader.js',
  },
  
  // Outras configurações da aplicação
  app: {
    name: 'Bella Renda',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
};

export default config;
