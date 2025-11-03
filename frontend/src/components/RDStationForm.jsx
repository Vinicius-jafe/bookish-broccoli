import React, { useEffect, useRef, useCallback, useState } from 'react';

const RDStationForm = ({ packageName = '' }) => {
  const [formError, setFormError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const formRef = useRef(null);
  const scriptLoaded = useRef(false);
  const scriptRef = useRef(null);

  // Função para inicializar o formulário
  const initializeForm = useCallback(() => {
    if (window.RDStationForms && formRef.current) {
      try {
        // Verifica se o formulário já foi inicializado
        if (!formRef.current.hasAttribute('data-rd-form-initialized')) {
          // Desativa a renderização automática do formulário
          const form = new window.RDStationForms('integracao-3bd2e2520b4a83678275', 'null');
          form.options = {
            ...form.options,
            autoRender: false // Desativa a renderização automática
          };
          formRef.current.setAttribute('data-rd-form-initialized', 'true');
          setFormError(false);
        }
      } catch (error) {
        console.error('Erro ao inicializar o formulário do RD Station:', error);
        setFormError(true);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // Função para carregar o script do RD Station
  const loadScript = useCallback(() => {
    if (scriptLoaded.current || scriptRef.current || !document) return;
    
    // Verifica se o script já existe no documento
    const existingScript = document.querySelector('script[src*="rdstation-forms"]');
    if (existingScript) {
      scriptRef.current = existingScript;
      scriptLoaded.current = true;
      initializeForm();
      return;
    }
    
    // Cria e adiciona o script
    scriptRef.current = document.createElement('script');
    scriptRef.current.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
    scriptRef.current.async = true;
    scriptRef.current.onload = () => {
      scriptLoaded.current = true;
      initializeForm();
    };
    scriptRef.current.onerror = (error) => {
      console.error('Erro ao carregar o script do RD Station:', error);
      scriptRef.current = null;
      scriptLoaded.current = false;
      setFormError(true);
      setIsLoading(false);
    };
    document.body.appendChild(scriptRef.current);
    scriptLoaded.current = true;
  }, [initializeForm]);

  useEffect(() => {
    // Só executa no cliente
    if (typeof window === 'undefined') return;

    // Se o script já estiver carregado, apenas inicializa o formulário
    if (window.RDStationForms) {
      initializeForm();
    } else {
      loadScript();
    }

    // Verifica periodicamente se o script foi carregado (fallback)
    const checkRDStation = setInterval(() => {
      if (window.RDStationForms) {
        clearInterval(checkRDStation);
        initializeForm();
      }
    }, 1000);

    // Limpa apenas o intervalo
    return () => {
      clearInterval(checkRDStation);
    };
  }, [loadScript, initializeForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.RDStationForms) {
      const form = new window.RDStationForms('integracao-3bd2e2520b4a83678275', 'null');
      // Coleta os dados do formulário manualmente
      const formData = new FormData(e.target);
      const formValues = {};
      formData.forEach((value, key) => {
        formValues[key] = value;
      });
      // Envia os dados para o RD Station
      form.createLead(formValues);
    }
  };

  // Renderização de fallback quando há erro no carregamento do RD Station
  if (formError) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Solicitar Cotação</h3>
        <p className="text-sm text-gray-600 mb-4">
          O formulário de contato não pôde ser carregado. Por favor, entre em contato conosco diretamente pelo WhatsApp ou telefone.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
            <input 
              type="tel" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="(00) 00000-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows="3"
              placeholder="Como podemos te ajudar?"
            ></textarea>
          </div>
          <button 
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
            onClick={() => alert('Formulário de contato não está disponível no momento. Por favor, entre em contato por telefone ou WhatsApp.')}
          >
            Enviar Mensagem
          </button>
        </div>
      </div>
    );
  }

  // Mostrar carregamento enquanto o formulário está sendo carregado
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Estilos inline como fallback
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '1rem',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff',  // Fundo branco para garantir contraste
      borderRadius: '0.5rem'      // Borda arredondada
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '100%'
    },
    input: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#1f2937',  // Cor de texto mais escura para melhor contraste
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    inputFocus: {
      borderColor: '#ec4899',
      boxShadow: '0 0 0 2px rgba(236, 72, 153, 0.2)'
    },
    label: {
      display: 'block',
      marginBottom: '0.25rem',
      fontSize: '0.875rem',
      fontWeight: '600',  // Fonte mais grossa para melhor legibilidade
      color: '#1f2937'    // Cor de texto mais escura para melhor contraste
    },
    button: {
      width: '100%',
      backgroundColor: '#ec4899',
      color: 'white',
      fontWeight: '600',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      transition: 'background-color 0.2s',
      marginTop: '0.5rem'
    },
    buttonHover: {
      backgroundColor: '#db2777'
    },
    footer: {
      fontSize: '0.75rem',
      color: '#4b5563',  // Cor ligeiramente mais escura para melhor legibilidade
      textAlign: 'center',
      marginTop: '0.5rem',
      lineHeight: '1.25' // Melhora a legibilidade do texto
    }
  };

  return (
    <div style={styles.container}>
      {packageName && (
        <input 
          type="hidden" 
          name="pacoteTitulo" 
          value={packageName} 
        />
      )}
      <form 
        id="integracao-3bd2e2520b4a83678275" 
        style={styles.form}
        ref={formRef}
        onSubmit={handleSubmit}
      >
        {/* Nome */}
        <div>
          <label htmlFor="name" style={styles.label}>
            Nome*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = '#ec4899';
              e.target.style.boxShadow = '0 0 0 2px rgba(236, 72, 153, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="phone" style={styles.label}>
            Telefone*
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = '#ec4899';
              e.target.style.boxShadow = '0 0 0 2px rgba(236, 72, 153, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" style={styles.label}>
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = '#ec4899';
              e.target.style.boxShadow = '0 0 0 2px rgba(236, 72, 153, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Cidade */}
        <div>
          <label htmlFor="city" style={styles.label}>
            Qual sua cidade?*
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = '#ec4899';
              e.target.style.boxShadow = '0 0 0 2px rgba(236, 72, 153, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Destino */}
        <div>
          <label htmlFor="destination" style={styles.label}>
            Qual destino gostaria de ir?*
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            required
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = '#ec4899';
              e.target.style.boxShadow = '0 0 0 2px rgba(236, 72, 153, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ paddingTop: '0.5rem' }}>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#db2777';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#ec4899';
            }}
          >
            Enviar mensagem
          </button>
        </div>
      </form>
      
      <p style={styles.footer}>
        Ao preencher o formulário, você concorda em receber comunicações da Bella Renda & Viagens.
      </p>
    </div>
  );
};

export default RDStationForm;
