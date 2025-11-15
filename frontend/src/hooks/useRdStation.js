import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useRdStation = () => {
  // Tenta obter a localização, mas não falha se não estiver dentro de um Router
  let pathname = '/';
  try {
    const location = useLocation();
    pathname = location.pathname;
  } catch (error) {
    // Se não estiver dentro de um Router, usa o caminho atual da janela
    pathname = window.location.pathname;
  }

  useEffect(() => {
    // Verifica se não está na rota de admin
    if (pathname !== '/admin') {
      // Função para carregar o script do RD Station
      const loadRdScript = () => {
        // Verifica se o script já foi carregado
        if (window.RDStationForms) return;

        const script = document.createElement('script');
        script.src = 'https://d335luupugsy2.cloudfront.net/js/loader-scripts/1f5b6350-3c26-4b3d-95b7-4b2c65e57204-loader.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          console.log('RD Station carregado com sucesso');
        };
        
        script.onerror = (error) => {
          console.warn('Falha ao carregar RD Station', error);
        };
        
        document.head.appendChild(script);
      };

      // Verifica se o DOM já está pronto
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadRdScript);
      } else {
        loadRdScript();
      }
    }
  }, [pathname]);

  return null;
};

export default useRdStation;