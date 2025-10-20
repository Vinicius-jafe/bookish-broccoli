import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../hooks/use-toast";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { SiteShell, PackageCard } from "../components/SiteShell";
import { loadPackages, months as monthList } from "../mock";

// === HOOK para ler query params ===
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

// === COMPONENTE DE CARROSSEL ISOLADO ===
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

// === LISTA DE PACOTES ===
export function PackagesList() {
  const nav = useNavigate();
  const query = useQuery();
  const initialType = query.get("tipo") || "todos";
  const [type, setType] = useState(initialType);
  const [region, setRegion] = useState("todas");
  const [term, setTerm] = useState("");
  const [duration, setDuration] = useState([1, 10]);
  const [month, setMonth] = useState("todas");

  const pkgs = loadPackages();
  const regions = useMemo(() => Array.from(new Set(pkgs.map(p => p.region))), [pkgs]);

  const filtered = pkgs.filter(p => {
    if (type !== "todos" && p.type !== type) return false;
    if (region !== "todas" && p.region !== region) return false;
    if (month !== "todas" && !(p.months || []).includes(month)) return false;
    const dOk = p.duration >= duration[0] && p.duration <= duration[1];
    if (!dOk) return false;
    const tOk = `${p.title} ${p.destination}`.toLowerCase().includes(term.toLowerCase());
    return tOk;
  });

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
              <Slider value={duration} onValueChange={setDuration} min={1} max={10} step={1} />
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

            <Button className="mt-4 w-full" onClick={() => nav(`/pacotes?tipo=${type}`)}>
              Aplicar filtros
            </Button>
          </Card>

          {/* === RESULTADOS === */}
          <div className="md:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(p => (<PackageCard key={p.id} pkg={p} />))}
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

// === DETALHE DO PACOTE ===
export function PackageDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const pkg = loadPackages().find(p => p.slug === slug);

  if (!pkg) {
    return (
      <SiteShell>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold">Pacote não encontrado</h1>
          <Button className="mt-4" onClick={() => nav("/pacotes")}>Voltar para pacotes</Button>
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
            <div className="font-semibold">
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

        {/* === FORMULÁRIO HTML PARA RD STATION === */}
        <Card className="p-4 h-fit">
          <div className="font-semibold mb-2">Solicite uma cotação</div>
          <form
            id="leadForm"
            method="POST"
            action="https://www.rdstation.com.br/api/1.3/conversions"
            target="_blank"
            className="space-y-3"
          >
            <input type="hidden" name="token_rdstation" value="91840157086c5031777c4e425f6846be" />
            <input type="hidden" name="identificador_formulario" value="teste-05ebb39ac6d504bd28b0" />
            <input type="hidden" name="pacoteTitulo" value={pkg.title} />

            <div>
              <label className="text-sm">Nome</label>
              <Input name="name" required />
            </div>
            <div>
              <label className="text-sm">Email</label>
              <Input name="email" type="email" required />
            </div>
            <div>
              <label className="text-sm">Telefone</label>
              <Input name="telefone" required />
            </div>
            <div>
              <label className="text-sm">Mensagem</label>
              <Textarea
                name="mensagem"
                placeholder="Quero mais informações sobre datas e valores."
              />
            </div>
            <Button type="submit" className="w-full">Solicitar cotação</Button>
          </form>
        </Card>
      </section>
    </SiteShell>
  );
}
