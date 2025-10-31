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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "../components/ui/carousel";
import { SiteShell, PackageCard } from "../components/SiteShell"; 
import { loadPackages, loadPackageBySlug } from "../services/api"; // Ajustado para services/api
import { months as monthList } from "../constants/months"; // Assumindo que você moveu os meses para um arquivo separado

// ... useQuery e PackageCarousel (MANTIDOS) ...
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function PackageCarousel({ images = [], title }) {
  if (!images.length) return null;
  return (
    <Carousel>
      <CarouselContent>
        {images.map((src, idx) => (
          <CarouselItem key={idx} className="pr-4">
            <AspectRatio ratio={16 / 9}>
              <img
                src={src}
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
    // Usar um action diferente no RD Station se for um formulário de contato genérico.
    const RD_IDENTIFIER = "bella-renda-cotacao-detalhada"; 

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">
                Está preparada para dizer <span className="text-primary">sim para você?</span>
            </h2>
            <p className="text-sm text-center text-muted-foreground mb-4">
                Fale com a nossa equipe e descubra o roteiro que vai fazer seu coração vibrar.
                Além de parcelamento facilitado, oferecemos atendimento personalizado.
            </p>

            <form
                id="leadFormDetailed"
                method="POST"
                action="https://www.rdstation.com.br/api/1.3/conversions"
                target="_blank"
                className="space-y-3 bg-primary p-6 rounded-lg shadow-xl"
            >
                <input type="hidden" name="token_rdstation" value="91840157086c5031777c4e425f6846be" />
                <input type="hidden" name="identificador_formulario" value={RD_IDENTIFIER} />
                <input type="hidden" name="pacoteTitulo" value={packageName || "Cotação Geral"} />
                
                <h3 className="text-white font-medium mb-4">
                    Entraremos em contato com os dados informados abaixo:
                </h3>

                <Input name="name" placeholder="Nome" required className="bg-white border-none" />
                <Input name="telefone" placeholder="Telefone" required className="bg-white border-none" />
                <Input name="email" type="email" placeholder="Email" required className="bg-white border-none" />
                <Input name="cidade_origem" placeholder="Qual sua cidade origem?" required className="bg-white border-none" />
                <Input name="destinos_desejados" placeholder="Quais destinos gostaria de conhecer?" required className="bg-white border-none" />
                <Input name="periodo_viagem" placeholder="Qual período deseja viajar?" required className="bg-white border-none" />
                <Input name="quantidade_pessoas" type="number" placeholder="Quantidade de pessoas" required className="bg-white border-none" />
                
                <Button 
                    type="submit" 
                    className="w-full bg-white text-primary hover:bg-white/90 font-bold"
                >
                    Solicitar cotação
                </Button>
            </form>
            
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
      <section className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <PackageCarousel images={pkg.images} title={pkg.title} />
          <h1 className="text-2xl font-semibold mt-4">{pkg.title}</h1>
          <div className="text-muted-foreground">
            {pkg.destination} • {pkg.duration} dias • {pkg.region}
          </div>
          <div className="mt-4">
            <div className="font-semibold text-primary">
              A partir de R$ {pkg.priceFrom?.toLocaleString("pt-BR")}
            </div>
            <div className="mt-2 text-sm">
              Inclui: {(pkg.inclusions || []).join(", ")}
            </div>
          </div>
          <p className="mt-4 text-sm md:text-base text-muted-foreground">
            {pkg.longDescription}
          </p>
        </div>

        {/* === NOVO FORMULÁRIO DE COTAÇÃO DETALHADO === */}
        <Card className="p-0 h-fit border-none shadow-lg">
          <DetailedQuotationForm packageName={pkg.title} />
        </Card>
      </section>
    </SiteShell>
  );
}