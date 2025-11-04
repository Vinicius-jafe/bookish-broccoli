import React, { useState } from 'react';

// RD Station configuration
const RD_PUBLIC_TOKEN = 'a6846919c4a05bde2b4574be8842985a';
const RD_API_URL = 'https://api.rd.services/platform/conversions';

/**
 * Sends lead data directly to RD Station API
 * @param {Object} leadData - Lead information
 * @param {string} leadData.name - Lead's name
 * @param {string} leadData.email - Lead's email
 * @param {string} [leadData.phone] - Lead's phone number (optional)
 * @param {string} [leadData.message] - Lead's message (optional)
 */
const sendLeadToRdStation = async ({ name, email, phone = '', message = '' }) => {
  try {
    const payload = {
      public_token: RD_PUBLIC_TOKEN,
      conversion_identifier: 'formulario-contato-site',
      name,
      email,
      personal_phone: phone,
      cf_message: message,
      cf_source: 'site',
      cf_medium: 'formulario_contato',
      cf_campaign: 'geral',
    };

    console.log('Enviando lead para RD Station:', payload);
    
    // Send the request without waiting for response
    fetch(RD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true, // Ensures the request completes even if user navigates away
    });
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar lead para RD Station:', error);
    return { success: false, error };
  }
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    if (!data.name || !data.email) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setFormError('Por favor, insira um endereço de e-mail válido.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare lead data
      const leadData = {
        name: data.name,
        email: data.email,
        phone: data.personal_phone || '',
        message: data.cf_message || ''
      };

      console.log('Enviando lead para RD Station...');
      
      // Send data to RD Station (fire and forget)
      await sendLeadToRdStation(leadData);
      
      // Redirect to thank you page
      window.location.href = '/obrigado';
      
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setFormError('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Entre em Contato</h2>
      
      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{formError}</span>
          <button 
            onClick={() => setFormError('')}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Fechar</span>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" viewBox="0 0 20 20" fill="currentColor">
              <title>Fechar</title>
              <path d="M14.348 5.652a1 1 0 010 1.414L11.414 10l2.934 2.934a1 1 0 11-1.414 1.414L10 11.414l-2.934 2.934a1 1 0 01-1.414-1.414L8.586 10 5.652 7.066a1 1 0 011.414-1.414L10 8.586l2.934-2.934a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </button>
        </div>
      )}
      
      {formSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{formSuccess}</span>
          <button 
            onClick={() => setFormSuccess('')}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Fechar</span>
            <svg className="fill-current h-6 w-6 text-green-500" role="button" viewBox="0 0 20 20" fill="currentColor">
              <title>Fechar</title>
              <path d="M14.348 5.652a1 1 0 010 1.414L11.414 10l2.934 2.934a1 1 0 11-1.414 1.414L10 11.414l-2.934 2.934a1 1 0 01-1.414-1.414L8.586 10 5.652 7.066a1 1 0 011.414-1.414L10 8.586l2.934-2.934a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="personal_phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone <span className="text-sm text-gray-500">(opcional)</span>
          </label>
          <input
            type="tel"
            id="personal_phone"
            name="personal_phone"
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label htmlFor="cf_message" className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem <span className="text-sm text-gray-500">(opcional)</span>
          </label>
          <textarea
            id="cf_message"
            name="cf_message"
            rows="4"
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Como podemos ajudar?"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Dados para cotação</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="cf_destino" className="block text-sm font-medium text-gray-700 mb-1">
                Destino <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cf_destino"
                name="cf_destino"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Para onde você quer viajar?"
              />
            </div>

            <div>
              <label htmlFor="cf_quantidade_pessoas" className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade de pessoas <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="cf_quantidade_pessoas"
                name="cf_quantidade_pessoas"
                min="1"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Número de viajantes"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cf_data_ida" className="block text-sm font-medium text-gray-700 mb-1">
                Data de ida <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="cf_data_ida"
                name="cf_data_ida"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="cf_data_volta" className="block text-sm font-medium text-gray-700 mb-1">
                Data de volta <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="cf_data_volta"
                name="cf_data_volta"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitting ? 'opacity-75' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : 'Enviar Mensagem'}
          </button>
        </div>
      </form>
    </div>
  );
}
