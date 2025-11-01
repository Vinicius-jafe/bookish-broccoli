import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input"; // Certifique-se desta importação
import { Textarea } from "../components/ui/textarea"; // Certifique-se desta importação

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
import { SiteShell, PackageCard } from "../components/SiteShell"; 
import { loadPackages, loadPackageBySlug } from "../services/api"; // Ajustado para services/api
import { months as monthList } from "../constants/months"; // Assumindo que você moveu os meses para um arquivo separado
import { ArrowLeft, ArrowRight } from "lucide-react";
import { imageUrl } from "../services/api";

// ... useQuery e PackageCarousel (MANTIDOS) ...
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function PackageCarousel({ images = [], title }) {
  const [index, setIndex] = useState(0);
  if (!images.length) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative">
      <AspectRatio ratio={16 / 9}>
        <img
          src={imageUrl(images[index])}
          alt={`${title}-${index}`}
          className="w-full h-full object-cover rounded-md"
        />
      </AspectRatio>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
        onClick={prev}
        aria-label="Imagem anterior"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
        onClick={next}
        aria-label="Próxima imagem"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ... PackagesList (MANTIDO, mas usando a nova cor primária nos botões) ...
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
              className="mt-4 w-full bg-primary hover:bg-primary/90" 
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

// === NOVO FORMULÁRIO DE COTAÇÃO DETALHADO (Componente Auxiliar) ===
function DetailedQuotationForm({ packageName }) {
    // Efeito para carregar o script de rastreamento do RD Station
    useEffect(() => {
        // Adiciona estilos personalizados para o formulário RD Station
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos para o formulário RD Station */
            #integracao-3bd2e2520b4a83678275 .rd-form {
                font-family: inherit !important;
                color: inherit !important;
            }
            
            #integracao-3bd2e2520b4a83678275 .form-content {
                padding: 0 !important;
                background: transparent !important;
                box-shadow: none !important;
            }
            
            #integracao-3bd2e2520b4a83678275 .rd-button,
            #integracao-3bd2e2520b4a83678275 button[type="submit"] {
                background-color: #0ea5e9 !important;
                color: white !important;
                border: none !important;
                border-radius: 0.5rem !important;
                padding: 0.75rem 1.5rem !important;
                font-weight: 500 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.05em !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
                width: 100% !important;
                margin-top: 1rem !important;
            }
            
            #integracao-3bd2e2520b4a83678275 .rd-button:hover,
            #integracao-3bd2e2520b4a83678275 button[type="submit"]:hover {
                background-color: #0284c7 !important;
            }
            
            #integracao-3bd2e2520b4a83678275 .form-field {
                margin-bottom: 1rem !important;
            }
            
            #integracao-3bd2e2520b4a83678275 input[type="text"],
            #integracao-3bd2e2520b4a83678275 input[type="email"],
            #integracao-3bd2e2520b4a83678275 input[type="tel"],
            #integracao-3bd2e2520b4a83678275 input[type="number"],
            #integracao-3bd2e2520b4a83678275 textarea,
            #integracao-3bd2e2520b4a83678275 select {
                width: 100% !important;
                padding: 0.75rem !important;
                border: 1px solid #e2e8f0 !important;
                border-radius: 0.375rem !important;
                background-color: white !important;
                color: #1e293b !important;
                font-size: 0.875rem !important;
                line-height: 1.25rem !important;
            }
            
            #integracao-3bd2e2520b4a83678275 label {
                color: white !important;
                font-size: 0.875rem !important;
                font-weight: 500 !important;
                margin-bottom: 0.5rem !important;
                display: block !important;
            }
            
            #integracao-3bd2e2520b4a83678275 .header {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        // Verifica se o script já existe
        if (!document.querySelector('script[src*="loader-scripts/e472b6d1-b803-41d3-a4f8-9e9a6b2cbac0-loader"]')) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'https://d335luupugsy2.cloudfront.net/js/loader-scripts/e472b6d1-b803-41d3-a4f8-9e9a6b2cbac0-loader.js';
            document.body.appendChild(script);
        }

        // Configura o formulário do RD Station
        if (typeof RDStationForms === 'undefined') {
            const formScript = document.createElement('script');
            formScript.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
            formScript.onload = function() {
                new RDStationForms('integracao-3bd2e2520b4a83678275', 'null').createForm();
            };
            document.body.appendChild(formScript);
        } else {
            new RDStationForms('integracao-3bd2e2520b4a83678275', 'null').createForm();
        }

        // Limpeza ao desmontar o componente
        return () => {
            // Remove o script de rastreamento se necessário
            const script = document.querySelector('script[src*="loader-scripts/e472b6d1-b803-41d3-a4f8-9e9a6b2cbac0-loader"]');
            if (script) {
                document.body.removeChild(script);
            }
            // Remove os estilos personalizados
            if (style && style.parentNode) {
                style.parentNode.removeChild(style);
            }
        };
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">
                Está preparada para dizer <span className="text-primary">sim para você?</span>
            </h2>
            <p className="text-sm text-center text-muted-foreground mb-4">
                Fale com a nossa equipe e descubra o roteiro que vai fazer seu coração vibrar.
                Além de parcelamento facilitado, oferecemos atendimento personalizado.
            </p>

            <div className="space-y-3 bg-primary p-6 rounded-lg shadow-xl rd-form-container">
                <div role="main" id="integracao-3bd2e2520b4a83678275"></div>
            </div>
            
            <p className="text-sm text-center text-gray-700 pt-4">
                Porque viajar é autocuidado, é liberdade, é reencontrar quem você é 
                e o mundo espera.
            </p>
        </div>
    );
}

// === DETALHE DO PACOTE (MODIFICADO para usar o novo formulário) ===
export function PackageDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  // setPkg para null (carregando) e false (não encontrado)
  const [pkg, setPkg] = useState(null); 

  useEffect(() => {
    async function fetchPackage() {
      try {
        const found = await loadPackageBySlug(slug);
        
        if (!found) {
          toast({ title: "Pacote não encontrado" });
        }
        setPkg(found || false); // Se não encontrar, setar como false
      } catch (err) {
        console.error("Erro ao buscar pacote:", err);
        toast({ title: "Erro ao buscar pacote" });
        setPkg(false); // Em caso de erro, setar como não encontrado
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

  if (pkg === false) { // Verifica se é false (não encontrado/erro)
    return (
      <SiteShell>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold">Pacote não encontrado</h1>
          <Button className="mt-4 bg-primary hover:bg-primary/90" onClick={() => nav("/pacotes")}>Voltar para pacotes</Button>
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

            {/* Formulário de cotação */}
            <div className="sticky top-4 h-fit">
              <Card className="border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-primary p-4 text-white">
                  <h3 className="font-semibold text-lg">Solicitar Cotação</h3>
                  <p className="text-sm opacity-90">Preencha o formulário abaixo</p>
                </div>
                <div className="p-4">
                  <DetailedQuotationForm packageName={pkg.title} />
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}