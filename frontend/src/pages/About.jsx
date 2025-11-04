import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';
import logoImage from '../images/logo-final.jpg';
import backgroundImage from '../images/IC-LIB-3.png';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-rose-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-rose-900 mb-6">Sobre Nós</h1>
          <p className="text-xl text-rose-800 max-w-3xl mx-auto">Conheça nossa história e nossa paixão por criar experiências inesquecíveis</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Our Story */}
        <div className="mb-20 relative overflow-hidden rounded-2xl bg-rose-50">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: `url(${backgroundImage})`
            }}
          />
          
          <div className="relative grid md:grid-cols-2 gap-12 items-center p-8 md:p-12">
            {/* Text Content */}
            <div className="relative z-10 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl">
              <h2 className="text-3xl font-bold text-rose-900 mb-6">Nossa Empresa</h2>
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-lg">Viagens planejadas com cuidado e exclusividade</p>
                <p>A Bella Renda & Viagens transforma cada jornada em uma experiência autêntica e inesquecível. Criamos roteiros personalizados para garantir conforto e segurança. Cuidamos de tudo, do planejamento ao retorno, para que você aproveite cada destino sem preocupações.</p>
              </div>
            </div>
            
            {/* Logo */}
            <div className="relative z-10 flex justify-center items-center p-4">
              <div className="bg-white/90 p-6 rounded-xl shadow-lg">
                <img 
                  src={logoImage} 
                  alt="Bella Renda & Viagens"
                  className="max-w-xs h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-rose-50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-rose-900 mb-4">Pronto para sua próxima aventura?</h2>
          <p className="text-xl text-rose-800 mb-8 max-w-2xl mx-auto">Nossa equipe está pronta para transformar seus sonhos em realidade.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-6 text-lg">
              <Link to="/pacotes">
                Ver Nossos Pacotes
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50 px-8 py-6 text-lg">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 mr-2" />
                Siga-nos no Instagram
              </a>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
