import React, { useState, useEffect } from 'react';
import { Skeleton, Button, Box, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const API_BASE_URL = 'https://bookish-broccoli-nue4.onrender.com';

export default function Banner() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/banner`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      // Check if the response is JSON before trying to parse it
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Resposta não é JSON:', text.substring(0, 100));
        throw new Error(`Resposta inesperada do servidor: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erro ao carregar banner: ${response.status}`);
      }
      
      if (data.success && data.imageUrl) {
        // Ensure the URL is absolute
        const imageUrl = data.imageUrl.startsWith('http') 
          ? data.imageUrl 
          : `${API_BASE_URL}${data.imageUrl}`;
          
        setBanner({
          imageUrl,
          link: data.link || '#',
          alt: data.alt || 'Banner promocional'
        });
      } else {
        throw new Error(data.message || 'Formato de resposta inválido da API');
      }
    } catch (err) {
      console.error('Erro ao carregar banner:', err);
      setError(err.message || 'Erro desconhecido ao carregar o banner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: { xs: 150, sm: 200, md: 300 } }}>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          animation="wave"
          sx={{ bgcolor: 'grey.200' }}
        />
      </Box>
    );
  }

  if (error || !banner) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          minHeight: 150,
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          border: '1px dashed',
          borderColor: 'divider',
          boxShadow: 1
        }}
      >
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Não foi possível carregar o banner.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
          sx={{ mt: 1, textTransform: 'none' }}
        >
          Tentar novamente
        </Button>
        {error && (
          <Typography 
            variant="caption" 
            color="error" 
            sx={{ 
              mt: 1,
              display: 'inline-block',
              maxWidth: '100%',
              wordBreak: 'break-word',
              textAlign: 'center'
            }}
          >
            {error}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box 
      component="a" 
      href={banner.link}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'block',
        width: '100%',
        maxWidth: '100%',
        height: 'auto',
        overflow: 'hidden',
        borderRadius: 1,
        '&:hover': {
          opacity: 0.92,
          transition: 'opacity 0.3s ease',
        },
      }}
    >
      <Box
        component="img"
        src={banner.imageUrl} 
        alt={banner.alt}
        sx={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'cover',
          maxHeight: { xs: 150, sm: 200, md: 300 },
        }}
        onError={(e) => {
          console.error('Erro ao carregar a imagem do banner:', banner.imageUrl);
          e.target.onerror = null;
          e.target.src = `https://via.placeholder.com/1200x300?text=Banner+Não+Encontrado&t=${Date.now()}`;
        }}
      />
    </Box>
  );
}
