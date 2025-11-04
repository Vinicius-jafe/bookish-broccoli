import React, { useState } from 'react';

// 1. Definição do objeto de estilos (styles)
const styles = {
  button: {
    width: '100%',
    padding: '0.75rem 1rem', // py-3 px-4
    backgroundColor: '#ec4899', // pink-500
    color: 'white',
    borderRadius: '0.375rem', // rounded-md
    fontWeight: '600', // font-semibold
    transition: 'background-color 0.15s ease-in-out',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    lineHeight: '1.5',
  },
  footer: {
    marginTop: '1rem',
    fontSize: '0.75rem', // text-xs
    color: '#6b7280', // text-gray-500
    textAlign: 'center',
    padding: '0 1.5rem 1.5rem', // Adiciona padding para o rodapé se for exibido fora da div principal
  },
};

const RDStationForm = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const packageName = props.packageTitle || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    // Coleta os dados do formulário
    const formData = new FormData(e.target);
    const formValues = {};
    formData.forEach((value, key) => {
      formValues[key] = value;
    });

    // Já temos packageName definido no escopo do componente

    // Prepara o payload da API
    const apiPayload = {
      event_type: "CONVERSION",
      event_family: "CDP",
      payload: {
        conversion_identifier: "integracao-3bd2e2520b4a83678275",
        name: formValues.name,
        email: formValues.email,
        personal_phone: formValues.phone,
        city: formValues.city,
        state: formValues.state || '',
        country: 'Brasil',
        cf_destino: formValues.destination || packageName,
        cf_origem: 'Site',
        cf_origem_url: typeof window !== 'undefined' ? window.location.href : '',
        ...(packageName && { cf_pacote: packageName }),
        cf_meio_captacao: 'Formulário de Contato',
        traffic_source: 'direct',
        traffic_medium: 'form',
        traffic_campaign: 'website',
        traffic_value: 'formulario-contato'
      }
    };

    // Log detalhado do payload
    console.log('Payload a ser enviado para a API v3:', JSON.stringify(apiPayload, null, 2));

    try {
      // Envia a requisição para o endpoint do backend
      const response = await fetch('http://localhost:3001/api/rdstation/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(apiPayload),
      });
      
      // Lê a resposta uma única vez
      const responseText = await response.text();
      let responseData = {};
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.warn('Não foi possível fazer parse da resposta JSON:', e);
        responseData = { error: responseText };
      }
      
      const logData = {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        headers: Object.fromEntries(response.headers.entries())
      };
      
      console.log('Resposta do servidor RD Station:', logData);

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Mensagem enviada com sucesso! Em breve entraremos em contato.'
        });
        e.target.reset(); // Limpa o formulário
      } else {
        console.error("Erro ao enviar para o RD Station:", logData);
        
        let customErrorMsg = 'Erro ao enviar o formulário. ';
        
        if (response.status === 401) {
          customErrorMsg += 'Token de acesso inválido ou expirado.';
        } else if (response.status === 400) {
          customErrorMsg += 'Dados inválidos. Verifique os campos do formulário.';
        } else if (response.status === 404) {
          customErrorMsg += 'Recurso não encontrado. Verifique o identificador de conversão.';
        } else if (response.status >= 500) {
          customErrorMsg += 'Erro no servidor do RD Station. Tente novamente mais tarde.';
        }
        
        if (responseData.error) {
          customErrorMsg += ' ' + (responseData.error.message || JSON.stringify(responseData.error));
        } else if (responseData.errors) {
          customErrorMsg += ' ' + responseData.errors.map(err => err.message || JSON.stringify(err)).join(', ');
        }
        
        throw new Error(customErrorMsg);
      }
    } catch (error) {
      console.error('Erro de rede/processamento:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou entre em contato por telefone.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar mensagem de sucesso/erro após envio
  if (submitStatus.message) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className={`p-4 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="text-center font-medium">{submitStatus.message}</p>
          {!submitStatus.success && (
            <button
              onClick={() => setSubmitStatus({ success: false, message: '' })}
              className="mt-3 w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors font-semibold"
            >
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    // Opcional: encapsular o formulário e o rodapé na mesma div para manter o padding/sombra consistente
    <div className="bg-white rounded-lg shadow-md"> 
      <form 
        onSubmit={handleSubmit}
        className="p-6" // Remove o padding/sombra daqui, pois a div pai já aplica
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Solicitar Cotação</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
            <input 
              type="text" 
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Seu nome completo"
              disabled={isSubmitting} // Desabilita durante o envio
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
            <input 
              type="email" 
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="seu@email.com"
              disabled={isSubmitting} // Desabilita durante o envio
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
            <input 
              type="tel" 
              id="phone"
              name="phone"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="(00) 00000-0000"
              disabled={isSubmitting} // Desabilita durante o envio
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Cidade/Estado*</label>
            <input 
              type="text" 
              id="city"
              name="city"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Sua cidade e estado"
              disabled={isSubmitting} // Desabilita durante o envio
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destino de Interesse</label>
            <input 
              type="text" 
              id="destination"
              name="destination"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Para onde você quer viajar?"
              defaultValue={packageName}
              disabled={isSubmitting} // Desabilita durante o envio
            />
          </div>

          <div style={{ paddingTop: '0.5rem' }}>
            <button
              type="submit"
              style={styles.button}
              disabled={isSubmitting}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#db2777'; // pink-600
              }}
              onMouseOut={(e) => {
                // Mantém a cor original se não estiver desabilitado
                if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = '#ec4899'; // pink-500
                }
              }}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </div>
        </div>
      </form>
      
      <p style={styles.footer}>
        Ao preencher o formulário, você concorda em receber comunicações da Bella Renda & Viagens.
      </p>
    </div>
  );
};

export default RDStationForm;