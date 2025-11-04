import React, { useEffect, useState } from 'react';

export function Banner() {
  const [bannerUrl, setBannerUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch('https://bookish-broccoli-nue4.onrender.com/api/banner');
        const data = await response.json();
        if (data.success && data.imageUrl) {
          // Remove any leading slash from imageUrl to prevent double slashes
          const cleanImageUrl = data.imageUrl.startsWith('/') ? data.imageUrl.substring(1) : data.imageUrl;
          setBannerUrl(`https://bookish-broccoli-nue4.onrender.com/${cleanImageUrl}`);
        }
      } catch (error) {
        console.error('Error loading banner:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="rounded overflow-hidden bg-gray-100 h-40 md:h-52 flex items-center justify-center">
          <div className="animate-pulse">Carregando banner...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 mt-8">
      <div className="rounded overflow-hidden bg-cover bg-center h-40 md:h-52 flex items-center relative">
        {bannerUrl ? (
          <img 
            src={bannerUrl} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
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
              />
            </div>
            <div className="md:col-span-2 text-xl md:text-2xl font-medium">
              Na Bella Renda e Viagens, transformamos sonhos em{' '}
              <span className="text-primary font-bold">passaportes.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
