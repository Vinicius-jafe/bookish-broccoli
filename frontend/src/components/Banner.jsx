import React, { useEffect, useState } from 'react';

export function Banner() {
  const [bannerUrl, setBannerUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch('https://bookish-broccoli-nue4.onrender.com/api/banner');
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar banner: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.imageUrl) {
          // Remove any leading slash from imageUrl to prevent double slashes
          const cleanImageUrl = data.imageUrl.startsWith('/') 
            ? data.imageUrl.substring(1) 
            : data.imageUrl;
          setBannerUrl(`https://bookish-broccoli-nue4.onrender.com/${cleanImageUrl}`);
        }
      } catch (error) {
        console.error('Error loading banner:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanner();
  }, []);

  // Função para recarregar o banner
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    fetch('https://bookish-broccoli-nue4.onrender.com/api/banner')
      .then(response => {
        if (!response.ok) throw new Error('Falha ao carregar o banner');
        return response.json();
      })
      .then(data => {
        if (data.success && data.imageUrl) {
          const cleanImageUrl = data.imageUrl.startsWith('/') 
            ? data.imageUrl.substring(1) 
            : data.imageUrl;
          setBannerUrl(`https://bookish-broccoli-nue4.onrender.com/${cleanImageUrl}`);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="rounded overflow-hidden bg-gray-100 h-40 md:h-52 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mb-2"></div>
            <p className="text-gray-600">Carregando banner...</p>
          </div>
        </div>
      </section>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="rounded overflow-hidden bg-rose-50 border border-rose-200 h-40 md:h-52 flex flex-col items-center justify-center p-4 text-center">
          <p className="text-rose-600 mb-3">Não foi possível carregar o banner.</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
          >
            Tentar novamente
          </button>
          <p className="text-xs text-gray-500 mt-2">Erro: {error}</p>
        </div>
      </section>
    );
  }

  // Estado padrão (banner carregado)
  return (
    <section className="max-w-6xl mx-auto px-4 mt-8">
      <div className="rounded overflow-hidden bg-cover bg-center h-40 md:h-52 flex items-center relative shadow-md">
        {bannerUrl ? (
          <img 
            src={bannerUrl} 
            alt="Banner promocional" 
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              console.error('Erro ao carregar a imagem do banner');
              e.target.style.display = 'none';
              setError('Erro ao carregar a imagem do banner');
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-rose-100"></div>
        )}
        
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="bg-white/30 w-full h-full flex items-center relative z-10">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-4 items-center w-full">
            <div className="flex items-center gap-4">
              <img 
                src={require('../images/logo-final.jpg')} 
                alt="Bella Renda & Viagens" 
                className="h-12 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
    
            <div className="md:col-span-2 text-xl md:text-2xl font-medium text-gray-800">
              Na Bella Renda e Viagens, transformamos sonhos em <span className="text-rose-600 font-bold">passaportes.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
