import React from "react";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logoFinal from "../images/logo-final.jpg";
import libelula from "../images/IC-LIB-2.png";

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden" style={{ backgroundColor: "#C25475" }}>
      {/* Botão Voltar */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center text-white hover:underline z-10"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Voltar para o site
      </Link>

      {/* Conteúdo Central */}
      <div className="relative z-10 max-w-lg mx-auto">
        {/* Logo */}
        <img
          src={logoFinal}
          alt="Bella Renda & Viagens"
          className="w-48 mx-auto mb-8"
        />

        {/* Mensagem */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">OBRIGADA PELO SEU CONTATO!</h1>
          
          <p className="text-white text-lg mb-6">
            Sua mensagem foi enviada com sucesso! Em breve nossa equipe entrará em contato.
          </p>
          
          <p className="text-white/90 mb-6">
            Enquanto isso, não deixe de nos seguir nas redes sociais para ficar por dentro de todas as novidades e promoções!
          </p>

          <div className="flex flex-col space-y-4">
            <Button
              asChild
              className="bg-white text-[#C25475] hover:bg-white/90 font-bold py-6 text-lg rounded-xl"
            >
              <a
                href="https://instagram.com/bellarendaeviagens"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <span>SEGUIR NO INSTAGRAM</span>
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-6 text-lg rounded-xl"
            >
              <Link to="/">
                VOLTAR PARA O SITE
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Libélula no canto inferior esquerdo */}
      <div className="absolute bottom-0 left-0 w-40 md:w-56 opacity-80 z-0">
        <img 
          src={libelula} 
          alt="" 
          className="w-full h-auto"
        />
      </div>

      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
