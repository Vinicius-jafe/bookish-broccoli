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
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ContactForm from '../components/ContactForm';

// Hook para ler query params
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

// Componente de carrossel isolado - Estilo igual ao do site principal
export function PackageCarousel({ images = [], title, className = '' }) {
  const carouselId = `carousel-${title?.toLowerCase().replace(/\s+/g, '-') || 'images'}`;
  
  if (!images.length) return null;
  
  return (
    <div className={`relative group ${className}`}>
      {/* Container rolável */}
      <div 
        id={carouselId}
        className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
          '&::-webkit-scrollbar': { // Chrome, Safari and Opera
            display: 'none'
          }
        }}
      >
        <div className="flex space-x-6 w-max">
          {images.map((src, idx) => (
            <div key={idx} className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] flex-shrink-0">
              <div className="relative overflow-hidden rounded-xl">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={imageUrl(src)}
                    alt={`${title || 'Imagem'} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Botão de navegação esquerda */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button 
          onClick={() => {
            const container = document.getElementById(carouselId);
            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
          }}
          className="bg-white/80 hover:bg-white text-primary rounded-full p-2 shadow-lg"
          aria-label="Voltar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>
      
      {/* Botão de navegação direita */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button 
          onClick={() => {
            const container = document.getElementById(carouselId);
            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
          }}
          className="bg-white/80 hover:bg-white text-primary rounded-full p-2 shadow-lg"
          aria-label="Avançar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
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
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold">Encontre seu próximo destino</h1>
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          {/* === FILTROS === */}
          <Card className="p-4 md:col-span-1">
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

          {/* === RESULTADOS === */}
          <div className="md:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <PackageCard key={p.id} pkg={p} compact={false} />
              ))}
            </div>
            {!filtered.length && (
              <div className="text-center text-muted-foreground py-10">
                Nenhum pacote encontrado para os filtros selecionados.
              </div>
            )}
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
        <section className="max-w-6xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => nav(-1)}
            className="mb-4 flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para pacotes
          </Button>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <PackageCarousel images={pkg.images} title={pkg.title} />

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{pkg.title}</h1>

                <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                  <span>{pkg.destination}</span>
                  <span>•</span>
                  <span>{pkg.duration} dias</span>
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
