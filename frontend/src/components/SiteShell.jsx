// Agrupados para fins de separação, mas idealmente estariam em arquivos como SiteShell.jsx e Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { Separator } from "../components/ui/separator";
import { Instagram, Youtube, Mail, Phone, MapPin, Dragonfly } from "lucide-react"; // Adicionado Dragonfly
import { loadPackages as fetchPackages } from "../services/api"; // API real

// === NavBar Component (MODIFICADO) ===
export function NavBar() {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight">
          {/* Logo Bella Renda & Viagens */}
          <span className="text-xl font-serif text-primary">Bella</span> Renda & Viagens
        </Link>
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link className="hover:text-primary" to="/">Início</Link>
          <a className="hover:text-primary" href="#sobre">Sobre</a>
          <Link className="hover:text-primary" to="/pacotes">Roteiros</Link>
          <a href="#contato">
            {/* Botão Contatos com a cor primária */}
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Contatos
            </Button>
          </a>
        </nav>
        <Link to="/admin" className="text-sm">Admin</Link>
      </div>
    </header>
  );
}

// === Footer Component (MANTIDO o original, adicionado o logo no final) ===
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

// === Site Shell Component (MANTIDO) ===
export function SiteShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// === Package Card Component (MODIFICADO para o visual compacto da Home) ===
export function PackageCard({ pkg, compact = false }) {
  // Versão original para listagens (pode ser refinada depois)
  if (!compact) {
    return (
      <Card className="overflow-hidden group">
        <div className="relative">
          <AspectRatio ratio={16/9}>
            <img src={pkg.images?.[0]} alt={pkg.title} className="w-full h-full object-cover" />
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

  // Versão compacta para a HOME
  return (
    <Card className="overflow-hidden group relative border-none shadow-md">
      <AspectRatio ratio={4/3}>
        <img 
          src={pkg.images?.[0]} 
          alt={pkg.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </AspectRatio>
      {/* Área de texto sobre a imagem */}
      <div className="absolute inset-x-0 bottom-0 bg-white/80 backdrop-blur-sm p-3 text-center border-t border-primary/30">
        <div className="text-base font-semibold text-gray-800">{pkg.destination}</div>
        <Link to={`/pacotes/${pkg.slug}`}>
          <Button size="sm" className="mt-1 bg-primary hover:bg-primary/90">Ver todos</Button>
        </Link>
      </div>
    </Card>
  );
}

// === Row Component (MANTIDO, mas usando o card compacto) ===
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
  if (!pkgs.length) return null;
  
  // Define o estilo da barra de título
  const headerClasses = primaryColor 
      ? "bg-primary text-white" 
      : "bg-primary/10 text-primary";

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      <div className={`p-4 rounded-t-lg flex items-center justify-between relative ${headerClasses}`}>
        <div>
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
          <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        </div>
        <Link to="/pacotes" className="text-white hover:opacity-90">
          <Button variant="outline" className={`border-white ${primaryColor ? 'bg-primary text-white hover:bg-white hover:text-primary' : 'bg-primary text-white hover:bg-primary/90'}`}>
            Ver todos
          </Button>
        </Link>
        {/* Libélula decorativa em uma das barras (opcional) */}
        {primaryColor && <Dragonfly className="absolute -top-6 -right-6 h-28 w-28 text-primary/70 transform rotate-12 hidden md:block" />}
      </div>
      
      {/* Container dos Cards */}
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

// === Home Page Component (MODIFICADO COMPLETAMENTE) ===
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
          <div>
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
          {/* Imagens do Hero (Simulando o layout de Polaroid) */}
          <div className="relative h-64 md:h-96">
            <img 
              src={featuredImages[0]}
              alt="Viagem" 
              className="absolute w-48 h-64 object-cover rotate-3 shadow-xl border-4 border-white"
              style={{ top: '20%', left: '10%' }}
            />
            <span className="absolute bottom-1/4 left-1/4 text-base font-semibold text-gray-800 rotate-3">FRANÇA</span>
            
            <img 
              src={featuredImages[1]} 
              alt="Viagem 2" 
              className="absolute w-48 h-64 object-cover -rotate-6 shadow-xl border-4 border-white"
              style={{ top: '10%', right: '10%' }}
            />
            <span className="absolute bottom-1/4 right-1/4 text-base font-semibold text-gray-800 -rotate-6">FRANÇA</span>
            
            <Dragonfly className="absolute top-0 right-0 h-20 w-20 text-primary opacity-50 hidden md:block" />
          </div>
        </div>
      </section>

      {/* Linha Divisória */}
      <div className="w-full h-4 bg-primary/20 relative">
        <div className="absolute top-1/2 w-full border-t border-dashed border-primary/50"></div>
      </div>

      {/* 2. Roteiros Por Mulheres (Filtro Internaciona, para teste) */}
      <Row 
        title="Por mulheres" 
        subtitle="Roteiros mais procurados"
        filter={(p)=>p.type==="internacional"} // Assumindo 'internacional' como roteiros para mulheres
        primaryColor={true} // Cor rosa sólida
      />

      {/* 3. Roteiros pelo Brasil */}
      <Row 
        title="pelo Brasil" 
        subtitle="Roteiros mais procurados" 
        filter={(p)=>p.type==="nacional"}
        primaryColor={false} // Cor rosa claro
      />
      
      {/* 4. SEÇÃO "Por que viajar com a Bella Renda?" */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">Por que viajar com a Bella Renda?</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {/* Cartão 1 */}
          <Card className="p-4 text-center border-t-4 border-primary shadow-lg">
            <Dragonfly className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-lg text-primary">Momento só seu</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Longe da rotina, das cobranças, das expectativas alheias.
            </p>
          </Card>
          {/* Cartão 2 */}
          <Card className="p-4 text-center border-t-4 border-primary shadow-lg">
            <Dragonfly className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-lg text-primary">Suporte desde a reserva até o retorno</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Para que você tenha liberdade com segurança.
            </p>
          </Card>
          {/* Cartão 3 */}
          <Card className="p-4 text-center border-t-4 border-primary shadow-lg">
            <Dragonfly className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-lg text-primary">Vivências reais</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Gastronomia local, cultura autêntica e conexões.
            </p>
          </Card>
          {/* Cartão 4 */}
          <Card className="p-4 text-center border-t-4 border-primary shadow-lg">
            <Dragonfly className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-lg text-primary">Flexibilidade</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Roteiros sugeridos + opções de personalização.
            </p>
          </Card>
        </div>
      </section>
      
      <Separator className="mt-16" />
    </SiteShell>
  );
}