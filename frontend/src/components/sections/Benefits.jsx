import React from 'react';
import { MapPin, Phone, ShieldCheck, Star } from 'lucide-react';

export function Benefits() {
  const iconColor = "hsl(207, 74%, 36%)"; // nova cor
  const benefits = [
    {
      icon: <MapPin className="w-8 h-8" style={{ color: iconColor }} />,
      title: "Roteiros Exclusivos",
      description: "Criados por quem conhece cada destino"
    },
    {
      icon: <Phone className="w-8 h-8" style={{ color: iconColor }} />,
      title: "Suporte 24h",
      description: "Assistência em português durante toda a viagem"
    },
    {
      icon: <ShieldCheck className="w-8 h-8" style={{ color: iconColor }} />,
      title: "Segurança",
      description: "Todas as medidas para sua tranquilidade"
    },
    {
      icon: <Star className="w-8 h-8" style={{ color: iconColor }} />,
      title: "Experiências Únicas",
      description: "Momentos que ficarão na memória"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Por que viajar com a gente?</h2>
          <p className="text-muted-foreground">Oferecemos uma experiência completa e personalizada para você</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "hsl(207, 74%, 36%, 0.1)" }} // fundo com 10% de opacidade
              >
                {benefit.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
