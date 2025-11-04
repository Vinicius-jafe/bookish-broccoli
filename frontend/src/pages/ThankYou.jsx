import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Obrigado pelo seu contato!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Recebemos sua mensagem e entraremos em contato em breve.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Nossa equipe está trabalhando para responder o mais rápido possível.
          </p>
        </div>

        <div className="mt-10 flex flex-col space-y-4">
          <Button asChild className="w-full justify-center py-6 text-base">
            <Link to="/">
              Voltar para a Página Inicial
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full justify-center py-6 text-base">
            <Link to="/pacotes">
              Ver Nossos Pacotes
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Precisa de ajuda?{' '}
            <a href="mailto:contato@agenciadeviagens.com" className="font-medium text-blue-600 hover:text-blue-500">
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
