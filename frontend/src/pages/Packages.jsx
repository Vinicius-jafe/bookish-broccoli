import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { Card } from "../components/ui/card";
import { toast } from "../hooks/use-toast";
import { AspectRatio } from "../components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "../components/ui/carousel";
import { SiteShell, PackageCard } from "../components/SiteShell"; 
import { loadPackages, loadPackageBySlug, imageUrl } from "../services/api";
import { months as monthList } from "../constants/months";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Hook para ler query params
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

// Componente de carrossel isolado
function PackageCarousel({ images = [], title }) {
  if (!images.length) return null;
  return (
    <Carousel>
      <CarouselContent>
        {images.map((src, idx) => (
          <CarouselItem key={idx} className="pr-4">
            <AspectRatio ratio={16 / 9}>
              <img
                src={imageUrl(src)}
                alt={`${title}-${idx}`}
                className="w-full h-full object-cover rounded-md"
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

// Lista de pacotes
export function PackagesList() {
  const nav = useNavigate();
  const query = useQuery();
  const initialType = query.get("tipo") || "todos";
  const [type, setType] = useState(initialType);
  const [region, setRegion] = useState("todas");
  const [term, setTerm] = useState("");
  const [duration, setDuration] = useState([1, 10]);
  const [month, setMonth] = useState("todas");

  const [pkgs, setPkgs] = useState([]); // estado para pacotes

  useEffect(() => {
    async function fetchPackages() {
      try {
        const data = await loadPackages();
        setPkgs(data);
      } catch (err) {
        console.error("Erro ao carregar pacotes:", err);
        toast({ title: "Erro ao carregar pacotes" });
      }
    }
    fetchPackages();
  }, []);

  const regions = useMemo(() => Array.from(new Set(pkgs.map(p => p.region))).filter(Boolean), [pkgs]);

  const filtered = useMemo(() => {
    return pkgs.filter(p => {
      if (type !== "todos" && p.type !== type) return false;
      if (region !== "todas" && p.region !== region) return false;
      // Este filtro de mês agora funciona, pois o backend está retornando p.months como array
      if (month !== "todas" && !(p.months || []).includes(month)) return false; 
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
              onValueChange={(v) => setType(v || "todos")}
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
                {regions.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4 text-sm font-medium">Duração (dias)</div>
            <div className="px-1">
              <Slider value={duration} onValueChange={setDuration} min={1} max={30} step={1} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{duration[0]}d</span><span>{duration[1]}d</span>
            </div>

            <div className="mt-4 text-sm font-medium">Mês/Temporada</div>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {monthList.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
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

            <Button 
              className="mt-4 w-full" 
              onClick={() => nav(`/pacotes?tipo=${type}`)}>
              Aplicar filtros
            </Button>
          </Card>

          {/* === RESULTADOS === */}
          <div className="md:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(p => (<PackageCard key={p.id} pkg={p} compact={false} />))}
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
          toast({ title: "Pacote não encontrado" });
        }
        setPkg(found || false);
      } catch (err) {
        console.error("Erro ao buscar pacote:", err);
        toast({ title: "Erro ao buscar pacote" });
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
          <Button className="mt-4" onClick={() => nav("/pacotes")}>
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
                    A partir de R$ {pkg.priceFrom?.toLocaleString("pt-BR")}
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
                    <p className="text-gray-600 leading-relaxed">
                      {pkg.longDescription}
                    </p>
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
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Seu nome</label>
                      <Input 
                        type="text" 
                        id="name" 
                        placeholder="Nome completo" 
                        className="w-full"
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Seu email</label>
                      <Input 
                        type="email" 
                        id="email" 
                        placeholder="seu@email.com" 
                        className="w-full"
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                      <Input 
                        type="tel" 
                        id="phone" 
                        placeholder="(00) 00000-0000" 
                        className="w-full"
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                      <Textarea 
                        id="message" 
                        placeholder="Gostaria de mais informações sobre este pacote..." 
                        className="w-full min-h-[100px]"
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Enviar solicitação
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Ao preencher o formulário, você concorda em receber comunicações da Bella Renda & Viagens.
                    </p>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}