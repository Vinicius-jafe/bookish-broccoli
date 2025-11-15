import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { Card } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import { AspectRatio } from '../components/ui/aspect-ratio';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';
import { SiteShell, PackageCard, ContactCTA } from '../components/SiteShell';
import { loadPackages, loadPackageBySlug, imageUrl } from '../services/api';
import { months as monthList } from '../constants/months';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Check, 
  ChevronDown, 
  MapPin, 
  MessageCircle, 
  MessageSquareText, 
  Search, 
  X 
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import ContactForm from '../components/ContactForm';

// Hook para ler query params
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

// Componente de carrossel responsivo com indicadores e navegação tátil
export function PackageCarousel({ images = [], title, className = '' }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const carouselRef = React.useRef(null);
  
  if (!images.length) return null;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Efeito para sincronizar o scroll com o índice atual
  React.useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const slide = container.children[currentIndex];
      if (slide) {
        slide.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentIndex]);

  // Navegação por toque
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Deslize para a esquerda
      nextSlide();
    }
    
    if (touchStart - touchEnd < -50) {
      // Deslize para a direita
      prevSlide();
    }
  };
  
  return (
    <div className={`relative w-full ${className}`}>
      {/* Container do carrossel */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
          '&::-webkit-scrollbar': { // Chrome, Safari and Opera
            display: 'none'
          }
        }}
      >
        {images.map((src, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 w-full snap-center"
          >
            <div className="px-2">
              <AspectRatio ratio={16 / 9} className="rounded-xl overflow-hidden">
                <img
                  src={imageUrl(src)}
                  alt={`${title || 'Imagem'} ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading={idx > 1 ? 'lazy' : 'eager'}
                />
              </AspectRatio>
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicadores */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-primary w-6' : 'bg-gray-300'
              }`}
              aria-label={`Ir para imagem ${idx + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Botões de navegação */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary rounded-full p-2 shadow-lg transition-opacity duration-300 z-10"
            aria-label="Imagem anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary rounded-full p-2 shadow-lg transition-opacity duration-300 z-10"
            aria-label="Próxima imagem"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

// Lista de pacotes
export function PackagesList() {
  const nav = useNavigate();
  const query = useQuery();
  const initialType = query.get('tipo') || 'todos';
  const [type, setType] = useState(initialType);
  const [region, setRegion] = useState('todas');
  const [term, setTerm] = useState('');
  const [duration, setDuration] = useState([1, 10]);
  const [month, setMonth] = useState('todas');

  const [pkgs, setPkgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    
    async function fetchPackages() {
      try {
        const data = await loadPackages();
        // Remove duplicates based on ID to ensure each package is unique
        if (isMounted) {
          const uniquePackages = Array.from(new Map(data.map(pkg => [pkg.id, pkg])).values());
          setPkgs(uniquePackages);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Erro ao carregar pacotes:', err);
        if (isMounted) {
          toast({ title: 'Erro ao carregar pacotes' });
          setIsLoading(false);
        }
      }
    }
    
    fetchPackages();
    
    return () => {
      isMounted = false; // Cleanup function to prevent state updates after unmount
    };
  }, []);

  const regions = useMemo(
    () => Array.from(new Set(pkgs.map((p) => p.region))).filter(Boolean),
    [pkgs]
  );

  const filtered = useMemo(() => {
    return pkgs.filter((p) => {
      if (type !== 'todos' && p.type !== type) return false;
      if (region !== 'todas' && p.region !== region) return false;
      // Este filtro de mês agora funciona, pois o backend está retornando p.months como array
      if (month !== 'todas' && !(p.months || []).includes(month)) return false;
      const dOk = p.duration >= duration[0] && p.duration <= duration[1];
      if (!dOk) return false;
      const tOk = `${p.title} ${p.destination}`.toLowerCase().includes(term.toLowerCase());
      return tOk;
    });
  }, [pkgs, type, region, month, duration, term]);

  return (
    <SiteShell>
      <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-center md:text-left">Encontre seu próximo destino</h1>
        
        {/* Filtros móveis */}
        <div className="md:hidden mt-4 mb-6">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between"
            onClick={() => document.getElementById('filters-sidebar').classList.toggle('hidden')}
          >
            <span>Filtros</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* === FILTROS === */}
          <div id="filters-sidebar" className="hidden md:block w-full md:w-1/4">
            <Card className="p-4">
            <div className="text-sm font-medium mb-2">Tipo de viagem</div>
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={(v) => setType(v || 'todos')}
              className="flex flex-wrap gap-2"
            >
              <ToggleGroupItem value="todos">Todos</ToggleGroupItem>
              <ToggleGroupItem value="nacional">Nacional</ToggleGroupItem>
              <ToggleGroupItem value="internacional">Internacional</ToggleGroupItem>
            </ToggleGroup>
            <div className="mt-4 text-sm font-medium">Destino/Região</div>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4 text-sm font-medium">Duração (dias)</div>
            <div className="px-1">
              <Slider value={duration} onValueChange={setDuration} min={1} max={30} step={1} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{duration[0]}d</span>
              <span>{duration[1]}d</span>
            </div>

            <div className="mt-4 text-sm font-medium">Mês/Temporada</div>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {monthList.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4 text-sm font-medium">Buscar</div>
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Destino, hotel..."
              className="mt-2"
            />

              <Button className="mt-4 w-full" onClick={() => nav(`/pacotes?tipo=${type}`)}>
                Aplicar filtros
              </Button>
            </Card>
          </div>

          {/* === RESULTADOS === */}
          <div className="w-full md:w-3/4">
            {/* Filtros ativos */}
            <div className="flex flex-wrap gap-2 mb-4">
              {type !== 'todos' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {type === 'nacional' ? 'Nacional' : 'Internacional'}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setType('todos')} />
                </Badge>
              )}
              {region !== 'todas' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {region}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setRegion('todas')} />
                </Badge>
              )}
              {month !== 'todas' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {month}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setMonth('todas')} />
                </Badge>
              )}
              {(type !== 'todos' || region !== 'todas' || month !== 'todas') && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs text-muted-foreground"
                  onClick={() => {
                    setType('todos');
                    setRegion('todas');
                    setMonth('todas');
                  }}
                >
                  Limpar todos
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <PackageCard key={p.id} pkg={p} compact={false} />
              ))}
            </div>
            {!filtered.length ? (
              <div className="col-span-full text-center py-10">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum pacote encontrado</h3>
                <p className="text-muted-foreground">Tente ajustar os filtros ou buscar por outro termo.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setType('todos');
                    setRegion('todas');
                    setMonth('todas');
                    setTerm('');
                    setDuration([1, 30]);
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

import logoImage from '../images/logo-final.jpg';

// Função auxiliar para obter a URL da logo
export function getLogoUrl() {
  return logoImage;
}

// Detalhe do pacote
export function PackageDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    async function fetchPackage() {
      try {
        const found = await loadPackageBySlug(slug);

        if (!found) {
          toast({ title: 'Pacote não encontrado' });
        }
        setPkg(found || false);
      } catch (err) {
        console.error('Erro ao buscar pacote:', err);
        toast({ title: 'Erro ao buscar pacote' });
        setPkg(false);
      }
    }
    fetchPackage();
  }, [slug]);

  if (pkg === null) {
    return (
      <SiteShell>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold">Carregando...</h1>
        </div>
      </SiteShell>
    );
  }

  if (pkg === false) {
    return (
      <SiteShell>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold">Pacote não encontrado</h1>
          <Button className="mt-4" onClick={() => nav('/pacotes')}>
            Voltar para pacotes
          </Button>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="bg-white">
        <section className="max-w-6xl mx-auto px-4 py-4 md:py-8">
          <Button
            variant="ghost"
            onClick={() => nav(-1)}
            className="mb-2 md:mb-4 flex items-center gap-2 text-sm px-0 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para pacotes
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="md:col-span-2 space-y-4 md:space-y-6">
              <div className="overflow-hidden rounded-xl border">
                <PackageCarousel images={pkg.images} title={pkg.title} />
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
                <h1 className="text-xl md:text-3xl font-bold text-gray-900">{pkg.title}</h1>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{pkg.destination}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{pkg.duration} dias</span>
                  </div>
                  {pkg.region && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{pkg.region}</span>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <div className="text-2xl font-bold text-primary">
                    A partir de R$ {pkg.priceFrom?.toLocaleString('pt-BR')}
                  </div>

                  {pkg.inclusions?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Inclui:</h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {pkg.inclusions.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {pkg.longDescription && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="font-semibold text-gray-900 mb-3">Sobre este pacote</h3>
                    <p className="text-gray-600 leading-relaxed">{pkg.longDescription}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Formulário de contato simplificado */}
            <div className="sticky top-4 h-fit">
              <Card className="border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-primary p-4 text-white">
                  <h3 className="font-semibold text-lg">Solicitar Cotação</h3>
                  <p className="text-sm opacity-90">Preencha o formulário abaixo</p>
                </div>
                <div className="p-4">
                  <ContactCTA compact={true} />
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
