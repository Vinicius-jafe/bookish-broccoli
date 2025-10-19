import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { Separator } from "../components/ui/separator";
import { Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { loadPackages, loadTestimonials } from "../mock";

export function NavBar() {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight">EMPRESA DE TURISMO</Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link className="hover:text-primary" to="/">Home</Link>
          <Link className="hover:text-primary" to="/pacotes?tipo=nacional">Nacional</Link>
          <Link className="hover:text-primary" to="/pacotes?tipo=internacional">Internacional</Link>
          <a className="hover:text-primary" href="#sobre">Sobre nós</a>
          <a className="hover:text-primary" href="#contato">Contato</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => nav("/pacotes")}>Ver roteiros</Button>
          <Button onClick={() => nav("/admin")}>Admin</Button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-white" id="contato">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-semibold mb-2">EMPRESA DE TURISMO</div>
          <p className="text-muted-foreground">Roteiros personalizados e experiências inesquecíveis.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Links úteis</div>
          <ul className="space-y-2">
            <li><Link to="/pacotes">Pacotes</Link></li>
            <li><a href="#sobre">Sobre nós</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Contato</div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><Phone size={16}/> (84) 99999-0000</li>
            <li className="flex items-center gap-2"><Mail size={16}/> contato@empresadeturismo.com</li>
            <li className="flex items-center gap-2"><MapPin size={16}/> Rua Exemplo, 123 - Natal/RN</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Legal</div>
          <p className="text-muted-foreground">CNPJ 00.000.000/0000-00</p>
          <div className="flex gap-3 mt-3 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="hover:text-primary"><Instagram size={18}/></a>
            <a href="#" aria-label="YouTube" className="hover:text-primary"><Youtube size={18}/></a>
          </div>
        </div>
      </div>
      <div className="border-t text-center py-4 text-xs text-muted-foreground">© {new Date().getFullYear()} EMPRESA DE TURISMO. Todos os direitos reservados.</div>
    </footer>
  );
}

export function SiteShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PackageCard({ pkg }) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img src={pkg.images?.[0]} alt={pkg.title} className="w-full h-full object-cover" />
        </AspectRatio>
        <Badge className="absolute top-2 left-2 capitalize">{pkg.type}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-base leading-tight line-clamp-2">{pkg.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">{pkg.destination}</div>
        <div className="mt-2 font-semibold">A partir de R$ {pkg.priceFrom?.toLocaleString("pt-BR")}</div>
        <Link to={`/pacotes/${pkg.slug}`} className="inline-block mt-3">
          <Button>Detalhes</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function Row({ title, filter }) {
  const pkgs = loadPackages().filter(filter);
  if (!pkgs.length) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        <Link to="/pacotes" className="text-sm text-primary hover:underline">Ver todos</Link>
      </div>
      <Carousel className="w-full">
        <CarouselContent>
          {pkgs.map((p) => (
            <CarouselItem key={p.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pr-4">
              <PackageCard pkg={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}

export function Home() {
  const testimonials = loadTestimonials();
  const featured = loadPackages().filter(p => p.featuredHome);
  return (
    <SiteShell>
      <section className="bg-gradient-to-b from-muted to-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Roteiros incríveis para você viver experiências inesquecíveis.</h1>
            <p className="mt-4 text-muted-foreground">Descubra destinos nacionais e internacionais com curadoria da EMPRESA DE TURISMO.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/pacotes"><Button size="lg">Ver roteiros</Button></Link>
              <a href="#contato"><Button size="lg" variant="secondary">Fale conosco</Button></a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featured.slice(0,4).map((p) => (
              <div key={p.id} className="rounded-lg overflow-hidden shadow-sm">
                <AspectRatio ratio={4/3}><img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover"/></AspectRatio>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-12" id="sobre">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-2">Sobre nós</h2>
            <p className="text-muted-foreground">Somos especialistas em criar experiências únicas de viagem, com atendimento consultivo, transparência e os melhores parceiros do mercado.</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Atendimento rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Solicite sua cotação e nossa equipe retorna rapidamente com as melhores opções.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Row title="Roteiros mais procurados pelo Nordeste" filter={(p)=>p.type==="nacional" && p.region==="Nordeste"} />
      <Row title="Roteiros mais procurados pelo Brasil" filter={(p)=>p.type==="nacional"} />
      <Row title="Roteiros mais procurados Internacional" filter={(p)=>p.type==="internacional"} />

      <section className="max-w-6xl mx-auto px-4 mt-16">
        <h2 className="text-2xl font-semibold">Depoimentos de nossos clientes</h2>
        <p className="text-muted-foreground mt-1">A opinião dos nossos clientes é o que mais importa para nós.</p>
        <Carousel className="mt-6">
          <CarouselContent>
            {testimonials.map(t => (
              <CarouselItem key={t.id} className="basis-full md:basis-1/3 pr-4">
                <Card className="overflow-hidden">
                  <AspectRatio ratio={16/9}><img src={t.image} alt={t.name} className="w-full h-full object-cover" /></AspectRatio>
                  <CardContent className="p-4">
                    <div className="text-sm">“{t.text}”</div>
                    <div className="text-xs text-muted-foreground mt-1">{t.name}</div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="bg-card border rounded-lg p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Pronto para planejar sua próxima viagem?</h3>
            <p className="text-sm text-muted-foreground">Fale com nossa equipe e receba uma proposta personalizada.</p>
          </div>
          <a href="#contato"><Button size="lg">Solicitar cotação</Button></a>
        </div>
      </section>

      <Separator className="mt-16" />
    </SiteShell>
  );
}
