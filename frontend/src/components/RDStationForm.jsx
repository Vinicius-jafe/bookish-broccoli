import React, { useEffect, useRef, useCallback } from 'react';

const RDStationForm = ({ packageName = '' }) => {
  const formRef = useRef(null);
  const scriptLoaded = useRef(false);

  // Referência para o script do RD Station
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
        }
      } catch (error) {
        console.error('Erro ao inicializar o formulário do RD Station:', error);
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
    scriptRef.current.onload = initializeForm;
    scriptRef.current.onerror = (error) => {
      console.error('Erro ao carregar o script do RD Station:', error);
      scriptRef.current = null;
      scriptLoaded.current = false;
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
