import React, { useEffect, useState } from 'react';

import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  Skeleton,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import logoImage from '../images/logo-final.jpg';

const API_BASE_URL = 'http://localhost:4000';

// Styled Component para o Container principal do banner
const BannerContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '350px',
  display: 'flex',
  alignItems: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down('md')]: {
    height: '280px',
  },
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  color: theme.palette.common.white,
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
}));

const LogoContainer = styled('div')(({ theme }) => ({
  flex: '0 0 250px',
  padding: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    flex: '0 0 auto',
    marginBottom: theme.spacing(3),
    maxWidth: '180px',
  },
  '& img': {
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
}));

const TextContainer = styled('div')(({ theme }) => ({
  flex: 1,
  maxWidth: '600px',
  '& h1': {
    fontSize: '2.2rem',
    fontWeight: 800,
    marginBottom: theme.spacing(1.5),
    lineHeight: 1.2,
    color: theme.palette.common.white,
    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.8rem',
    },
  },
  '& p': {
    fontSize: '1.5rem',
    marginBottom: theme.spacing(3),
    fontWeight: 600,
    color: theme.palette.primary.main,
    [theme.breakpoints.down('md')]: {
      fontSize: '1.3rem',
    },
  },
}));

export default function Banner() {
  const theme = useTheme();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/banner`);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Resposta não é JSON:', text.substring(0, 100));
        throw new Error(
          `Resposta inesperada do servidor: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Erro ao carregar banner: ${response.status}`);
      }

      if (data.success && data.imageUrl) {
        const imageUrl = data.imageUrl.startsWith('http')
          ? data.imageUrl
          : `${API_BASE_URL}${data.imageUrl}`;

        setBanner({
          imageUrl,
          link: data.link || '#',
          alt: data.alt || 'Banner promocional',
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
    setRetryCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: 400 }}>
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
          boxShadow: 1,
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
              textAlign: 'center',
            }}
          >
            {error}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <BannerContainer
      style={{
        backgroundImage: `url(${banner.imageUrl})`,
      }}
    >
      <ContentWrapper maxWidth="lg">
        <LogoContainer>
          <img
            src={logoImage}
            alt="Bella Renda & Viagens"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
            }}
          />
        </LogoContainer>
        <TextContainer>
          <h1>Na Bella Renda e Viagens</h1>
          <p>
            Transformamos sonhos em{' '}
            <span style={{ color: theme.palette.secondary.main }}>passaportes</span>.
          </p>
        </TextContainer>
      </ContentWrapper>
    </BannerContainer>
  );
}
