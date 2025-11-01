// Agrupados para fins de separação, mas idealmente estariam em arquivos como SiteShell.jsx e Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { Separator } from "../components/ui/separator";
import { Instagram, Youtube, Mail, Phone, MapPin, Airplay } from "lucide-react"; // Substituído Dragonfly por Airplay
import { loadPackages as fetchPackages, imageUrl } from "../services/api"; // API real

// === NavBar Component ===
export function NavBar() {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight">
          <span className="text-xl font-serif text-primary">Bella</span> Renda & Viagens
        </Link>
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link className="hover:text-primary" to="/">Início</Link>
          <a className="hover:text-primary" href="#sobre">Sobre</a>
          <Link className="hover:text-primary" to="/pacotes">Roteiros</Link>
          <a href="#contato">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5">
              Contatos
            </Button>
          </a>
        </nav>
        <Link to="/admin" className="text-sm">Admin</Link>
      </div>
    </header>
  );
}

// === Footer Component ===
export function Footer() {
  return (
    <footer className="mt-20 border-t bg-white" id="contato">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-semibold mb-2 text-primary">BELLA RENDA & VIAGENS</div>
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
            <li className="flex items-center gap-2"><Mail size={16}/> contato@bellarenda.com</li>
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
      <div className="border-t text-center py-4 text-xs text-muted-foreground">© {new Date().getFullYear()} BELLA RENDA & VIAGENS. Todos os direitos reservados.</div>
    </footer>
  );
}

// === Site Shell Component ===
export function SiteShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// === Package Card Component ===
export function PackageCard({ pkg, compact = false }) {
  if (!compact) {
    return (
      <Card className="overflow-hidden group">
        <div className="relative">
          <AspectRatio ratio={16/9}>
            <img src={imageUrl(pkg.images?.[0])} alt={pkg.title} className="w-full h-full object-cover" />
          </AspectRatio>
          <Badge className="absolute top-2 left-2 capitalize bg-primary hover:bg-primary/90 text-white">{pkg.type}</Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-base leading-tight line-clamp-2">{pkg.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">{pkg.destination}</div>
          <div className="mt-2 font-semibold text-primary">A partir de R$ {pkg.priceFrom?.toLocaleString("pt-BR")}</div>
          <Link to={`/pacotes/${pkg.slug}`} className="inline-block mt-3">
            <Button className="bg-primary hover:bg-primary/90">Detalhes</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden group relative border-none shadow-md">
      <AspectRatio ratio={4/3}>
        <img 
          src={imageUrl(pkg.images?.[0])} 
          alt={pkg.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </AspectRatio>
      <div className="absolute inset-x-0 bottom-0 bg-white/85 backdrop-blur-sm p-3 text-center border-t border-primary/30 rounded-t-md">
        <div className="text-base font-semibold text-gray-800">{pkg.destination}</div>
        <Link to={`/pacotes/${pkg.slug}`}>
          <Button size="sm" className="mt-1 bg-primary hover:bg-primary/90">Ver todos</Button>
        </Link>
      </div>
    </Card>
  );
}

// === Row Component ===
function Row({ title, subtitle, filter, primaryColor = false }) {
  const [pkgs, setPkgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages()
      .then(data => setPkgs(data.filter(filter)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [filter]);

  if (loading) return <div className="text-center py-6">Carregando...</div>;
  if (!pkgs.length) return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      <div className="p-4 rounded-lg bg-muted text-muted-foreground text-center text-sm">
        Nenhum pacote encontrado para esta seção.
      </div>
    </section>
  );

  const headerClasses = primaryColor ? "bg-primary text-white" : "bg-gradient-to-r from-primary/20 to-white text-primary";

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      <div className={`p-4 rounded-t-lg flex items-center justify-between relative ${headerClasses}`}>
        <div>
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
          <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        </div>
        <Link to="/pacotes" className="text-white hover:opacity-90">
          <Button variant="outline" className={`rounded-full px-5 border-white ${primaryColor ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary text-white hover:bg-primary/90'}`}>
            Ver todos
          </Button>
        </Link>
        {primaryColor && <Airplay className="absolute -top-6 -right-6 h-28 w-28 text-white/60 transform rotate-12 drop-shadow hidden md:block" />}
      </div>
      <div className="border border-t-0 p-4 pt-6">
        <Carousel className="w-full">
          <CarouselContent>
            {pkgs.map((p) => (
              <CarouselItem key={p.id} className="basis-full sm:basis-1/2 md:basis-1/3 pr-4">
                <PackageCard pkg={p} compact={true} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <p className="text-center text-xs text-gray-600 mt-4">
          Cada pacote inclui suporte especializado, opções de customização e um ambiente seguro para mulheres que decidem dizer "eu vou".
        </p>
      </div>
    </section>
  );
}

// === Contact CTA (seção do formulário exatamente como no mockup) ===
function ContactCTA() {
  return (
    <section className="max-w-3xl mx-auto px-4 mt-16">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold">Está preparada para dizer <span className="text-primary">sim para você?</span></h2>
        <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">
          Fale com a nossa equipe e descubra o roteiro que vai fazer seu coração vibrar.
          Além de parcelamento facilitado, oferecemos atendimento personalizado para que sua
          viagem seja leve, segura e inesquecível.
        </p>
      </div>

      <div className="mt-6">
        <div className="h-3 bg-primary/20 rounded-t"></div>
        <div className="bg-primary px-6 py-6">
          <h3 className="text-white text-center mb-3">Entraremos em contato com os dados informados abaixo:</h3>
          <div className="space-y-3 max-w-xl mx-auto">
            <input className="w-full rounded bg-white h-8 px-3 text-sm" placeholder="Nome" />
            <input className="w-full rounded bg-white h-8 px-3 text-sm" placeholder="Telefone" />
            <input className="w-full rounded bg-white h-8 px-3 text-sm" placeholder="Email" />
            <input className="w-full rounded bg-white h-8 px-3 text-sm" placeholder="Qual sua cidade origem?" />
            <input className="w-full rounded bg-white h-8 px-3 text-sm" placeholder="Quais destinos gostaria de conhecer?" />
            <input className="w-full rounded bg-white h-8 px-3 text-sm" placeholder="Qual período deseja viajar?" />
            <input className="w-full rounded bg-white h-8 px-3 text-sm" placeholder="Quantidade de pessoas" />
          </div>
        </div>
        <div className="h-3 bg-primary/20 rounded-b"></div>
      </div>

      <p className="text-center text-sm text-gray-700 mt-6">
        Porque viajar é autocuidado, é liberdade, é reencontrar quem você é
        <br />
        <span className="font-bold">e o mundo espera.</span>
      </p>

      <div className="mt-8 border-t pt-6">
        <div className="grid md:grid-cols-3 gap-6 items-center bg-primary/10 p-6 rounded">
          <div className="flex items-center justify-center">
            <div className="text-2xl font-serif text-primary">Bella</div>
          </div>
          <div className="md:col-span-2 text-sm text-gray-700">
            Documentação, políticas de pagamento, suporte 24h,
            grupos exclusivos para mulheres.
            Vagas limitadas por formato de viagem — garanta sua
            presença.
          </div>
        </div>
      </div>
    </section>
  );
}

// === Home Page Component ===
export function Home() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredImages, setFeaturedImages] = useState([]);
  const placeholderImages = [
    "https://via.placeholder.com/300x400/F5A7B7/FFFFFF?text=Imagem+1",
    "https://via.placeholder.com/300x400/F5A7B7/FFFFFF?text=Imagem+2",
    "https://via.placeholder.com/300x400/F5A7B7/FFFFFF?text=Imagem+3",
    "https://via.placeholder.com/300x400/F5A7B7/FFFFFF?text=Imagem+4",
  ];

  useEffect(() => {
    fetchPackages()
      .then(data => {
        setPackages(data);
        const featured = data.filter(p => p.featuredHome).slice(0, 4).map(p => p.images?.[0]);
        setFeaturedImages(featured.length > 0 ? featured : placeholderImages);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteShell>
      {/* 1. HERO SECTION */}
      <section className="bg-white border-b overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-snug">
              Viajar não é apenas <br /> um destino, é um <span className="text-primary">encontro com você!</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              Com a Bella Renda e Viagens, mulheres que sonham em explorar o mundo
              ganham um roteiro feito para se sentirem livres, seguras e inspiradas.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/pacotes">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Ver roteiros
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-64 md:h-96">
            <img 
              src={imageUrl(featuredImages[0])}
              alt="Viagem" 
              className="absolute w-48 h-64 object-cover rotate-3 shadow-xl border-4 border-white pointer-events-none select-none"
              style={{ top: '20%', left: '10%' }}
            />
            <span className="absolute bottom-1/4 left-1/4 text-base font-semibold text-gray-800 rotate-3">FRANÇA</span>
            <img 
              src={imageUrl(featuredImages[1])} 
              alt="Viagem 2" 
              className="absolute w-48 h-64 object-cover -rotate-6 shadow-xl border-4 border-white pointer-events-none select-none"
              style={{ top: '10%', right: '10%' }}
            />
            <span className="absolute bottom-1/4 right-1/4 text-base font-semibold text-gray-800 -rotate-6">FRANÇA</span>
            <Airplay className="absolute top-0 right-0 h-20 w-20 text-primary opacity-50 hidden md:block pointer-events-none" />
          </div>
        </div>
      </section>

      <div className="w-full h-4 bg-primary/20 relative">
        <div className="absolute top-1/2 w-full border-t border-dashed border-primary/50"></div>
      </div>

      <Row 
        title="Por mulheres" 
        subtitle="Roteiros mais procurados"
        filter={(p)=>p.type==="internacional"}
        primaryColor={true}
      />

      {/* Banner entre listas */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="rounded overflow-hidden bg-cover bg-center h-40 md:h-52 flex items-center" style={{backgroundImage:"url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop')"}}>
          <div className="bg-white/85 w-full h-full flex items-center">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-4 items-center w-full">
              <div className="text-2xl font-serif text-primary">Bella renda & viagens</div>
              <div className="md:col-span-2 text-xl md:text-2xl font-medium">
                Na Bella Renda e Viagens, transformamos sonhos em <span className="text-primary font-bold">passaportes.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Row 
        title="pelo Brasil" 
        subtitle="Roteiros mais procurados" 
        filter={(p)=>p.type==="nacional"}
        primaryColor={false}
      />

      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">Por que viajar com a Bella Renda?</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[ "Momento só seu", "Suporte desde a reserva até o retorno", "Vivências reais", "Flexibilidade" ].map((text, idx) => (
            <Card key={idx} className="p-4 text-center border-t-4 border-primary shadow-lg">
              <Airplay className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-lg text-primary">{text}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {idx === 0 && "Longe da rotina, das cobranças, das expectativas alheias."}
                {idx === 1 && "Para que você tenha liberdade com segurança."}
                {idx === 2 && "Gastronomia local, cultura autêntica e conexões."}
                {idx === 3 && "Roteiros sugeridos + opções de personalização."}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Seção de contato final */}
      <ContactCTA />

      <Separator className="mt-16" />
    </SiteShell>
  );
}
