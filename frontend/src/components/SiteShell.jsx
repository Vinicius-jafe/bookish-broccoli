// Agrupados para fins de separação, mas idealmente estariam em arquivos como SiteShell.jsx e Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { Separator } from "../components/ui/separator";
import { Instagram, Youtube, Mail, Phone, MapPin, Airplay, Star, ShieldCheck } from "lucide-react";
import { Benefits } from "./sections/Benefits";
import { loadPackages as fetchPackages, imageUrl } from "../services/api"; // API real

// Importando as imagens
import logoFinal from '../images/logo-final.jpg';
import icLibVoando from '../images/IC-LIB-VOANDO.png';
import icLibVoando1 from '../images/IC-LIB-VOANDO-1.png';
import icLib3 from '../images/IC-LIB-3.png';
// === NavBar Component ===
export function NavBar() {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex-shrink-0">
            <img 
              src={logoFinal} 
              alt="Bella Renda & Viagens" 
              className="h-16 w-auto" 
            />
          </Link>
          
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8">
              <Link className="text-gray-700 hover:text-primary transition-colors" to="/">Início</Link>
              <a className="text-gray-700 hover:text-primary transition-colors" href="#sobre">Sobre</a>
              <Link className="text-gray-700 hover:text-primary transition-colors" to="/pacotes">Roteiros</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <a href="#contato" className="hidden md:block">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                  Contatos
                </Button>
              </a>
              <Link to="/admin" className="text-sm text-gray-600 hover:text-primary">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// === Footer Component ===
export function Footer() {
  return (
    <footer className="mt-20 border-t bg-footer" id="contato">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <img src={logoFinal} alt="Bella Renda & Viagens" className="h-16 w-auto mb-4 opacity-90" />
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
            <a href="#" aria-label="Instagram" className="hover:text-foreground"><Instagram size={18}/></a>
            <a href="#" aria-label="YouTube" className="hover:text-foreground"><Youtube size={18}/></a>
          </div>
        </div>
      </div>
      <div className="border-t text-center py-4 text-xs text-foreground/80">© {new Date().getFullYear()} BELLA RENDA & VIAGENS.
Todos os direitos reservados.</div>
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

// === Package Card Component (ALTERADO: Estilo compacto para seguir a imagem) ===
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

  // ESTILO COMPACTO (ALTERADO PARA FICAR IGUAL A IMAGEM 1.jpg e 2.png)
  return (
    <Card className="overflow-hidden group relative border-none shadow-md">
      <AspectRatio ratio={4/3}>
        <img 
          src={imageUrl(pkg.images?.[0])} 
          alt={pkg.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </AspectRatio>
      {/* Container branco semi-transparente no fundo */}
      <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-3 text-center rounded-t-md">
    
        <div className="text-base font-semibold text-gray-800">{pkg.destination}</div>
        <Link to={`/pacotes/${pkg.slug}`}>
          {/* Botão de cor primária mais escura (--button-on-primary) para contraste no fundo claro */}
          <Button size="sm" className="mt-1 bg-[hsl(var(--button-on-primary))] hover:bg-[hsl(var(--button-on-primary)/0.9)] text-white">Ver todos</Button>
        </Link>
      </div>
    </Card>
  );
}

// === Row Component (ALTERADO: Header e bordas para combinar com a imagem) ===
// ... (Código anterior do arquivo SiteShell.jsx)

// === Row Component (CORRIGIDO: Sintaxe do map) ===
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
  // Usar a cor primária personalizada se for fornecida, senão usar a cor padrão do tema
  const headerStyle = typeof primaryColor === 'string' 
    ? { backgroundColor: primaryColor, color: 'white' }
    : primaryColor === true
    ? { backgroundColor: 'hsl(340, 45%, 54%)', color: 'white' } // Cor rosa padrão
    : {};
    
  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      {/* Removido o rounded-t-lg e a borda de baixo para ficar igual às imagens */}
      <div 
        className={`p-4 flex items-center justify-between relative ${!primaryColor ? 'bg-primary/20 text-primary' : ''}`}
        style={headerStyle}
      >
        <div>
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
          <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        </div>
        <Link to="/pacotes" className="text-white hover:opacity-90">
          <Button 
            variant="outline" 
            // Botão Ver todos com fundo rosa escuro/forte
            className={`rounded-full px-5 border-white 
              ${primaryColor 
                ? 'bg-white text-primary hover:bg-white/90' // Botão branco no fundo rosa
                : 'bg-primary text-white hover:bg-primary/90' // Botão rosa no fundo rosa claro
              }`}
          >
 
            Ver todos
          </Button>
        </Link>
      </div>
      <div className="p-4 pt-6">
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

// Contact CTA section with RD Station form
function ContactCTA() {
  // O script do RD Station é gerenciado pelo componente RDStationForm

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
        <div className="bg-primary px-6 py-6 rounded-lg shadow-xl">
          <h3 className="text-white text-center mb-6">Entre em contato conosco para mais informações</h3>
          <div id="integracao-3bd2e2520b4a83678275" className="max-w-xl mx-auto">
            <form 
              id="form-integracao-3bd2e2520b4a83678275" 
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-1">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">Telefone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-1">Mensagem</label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
                  placeholder="Conte-nos sobre o que você está procurando..."
                ></textarea>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-white text-primary font-semibold py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
                >
                  Enviar mensagem
                </button>
              </div>
            </form>
          </div>
        </div>
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
  const [featuredPackages, setFeaturedPackages] = useState([]);
  useEffect(() => {
    fetchPackages()
      .then(data => {
        setPackages(data);
        const featured = data.filter(p => p.featuredHome).slice(0, 4);
        setFeaturedPackages(featured.length > 0 ? featured : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <SiteShell>
      {/* 1. HERO SECTION */}
      <section className="relative bg-white border-b overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={require('../images/png_muito.png')} 
            alt="" 
            className="w-full h-full object-cover"
            style={{
              opacity: 0.5
            }}
          />
        </div>
        
        {/* libelula Image */}
        <div className="absolute inset-0 z-5 pointer-events-none">
          <img 
            src={icLibVoando} 
            alt="" 
            className="absolute w-40 h-auto md:w-48 lg:w-56"
            style={{
              scale: '6',
              top: '50%',
              right: '35%',
              transform: 'scaleX(-1) rotate(10deg)',
              opacity: 0.9
            }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div className="text-gray-800 relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            
              Viajar não é apenas <br /> um destino, é um <span className="text-primary">encontro com você!</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Com a Bella Renda e Viagens, mulheres que sonham em explorar o mundo
              ganham um roteiro feito para se sentirem livres, seguras e inspiradas.
            </p>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3 text-lg font-semibold shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              Ver roteiros
            </Button>
          </div>
          
 
          {/* Imagens sobrepostas */}
          <div className="relative h-64 md:h-96 mt-10 md:mt-0">
            {featuredPackages.slice(0, 2).map((pkg, index) => (
              <div key={pkg._id} className={`absolute ${index === 0 ? 'rotate-3' : '-rotate-6'}`}
                style={{
                  top: index === 0 ? '20%' : '10%',
                  left: index === 0 ? '10%' : 'auto',
                  right: index === 0 ? 'auto' : '10%',
                  zIndex: 10 - index
                }}>
      
                <img 
                  src={imageUrl(pkg.images?.[0] || placeholderImages[index])} 
                  alt={pkg.title || `Destino ${index + 1}`} 
                  className="w-48 h-64 object-cover shadow-xl border-4 border-white"
                />
         
                <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-base font-semibold text-white bg-black/50 px-3 py-1 rounded-full whitespace-nowrap">
                  {pkg.destination?.toUpperCase() || `DESTINO ${index + 1}`}
                </span>
              </div>
            ))}
            <Airplay className="absolute top-0 right-0 h-20 w-20 text-white/30 hidden md:block" />
          </div>
        </div>
      </section>

      <div className="w-full h-4 bg-primary/20 relative">
 
        <div className="absolute top-1/2 w-full border-t border-dashed border-primary/50"></div>
      </div>

      <div className="relative">
        <Row 
          title="Por mulheres" 
          subtitle="Roteiros mais procurados"
          filter={(p) => p.featuredHome === true}
          primaryColor={true}
        />
      </div>

      {/* Banner entre listas com imagem local */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="rounded overflow-hidden bg-cover bg-center h-40 md:h-52 flex items-center relative">
          <img 
            src={require('../images/png_muito.png')} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="bg-white/85 w-full h-full flex items-center relative z-10">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-4 items-center w-full">
              <div className="flex items-center gap-4">
                <img 
                  src={logoFinal} 
                  alt="Bella Renda & Viagens" 
                  className="h-12 w-auto opacity-90"
                />
              </div>
      
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

      <div className="relative">
        <div className="absolute inset-0 z-0">
          <img 
            src={icLib3} 
            alt="" 
       
            className="w-full h-full object-cover opacity-5"
          />
        </div>
      </div>

      {/* Popular Packages */}
      <div className="relative overflow-hidden">
        <div className="relative z-10">
          <Row 
            title="Roteiros Internacionais"
            subtitle="Descubra destinos incríveis pelo mundo"
            filter={(p) => p.type === 'internacional'}
            primaryColor="hsl(208, 74%, 36%)"
            buttonColor="hsl(210, 67%, 21%)"
          >
            {packages.filter(pkg => pkg.type === 'internacional').map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </Row>
        </div>
    
      </div>

      <section className="max-w-6xl mx-auto px-4 mt-16 relative">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">Por que viajar com a Bella Renda?</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6 relative z-10">
          {/* ALTERADO: Estilo dos Cards de Benefícios (Fundo principal/rosa escuro) */}
          {[ "Momento só seu", "Suporte desde a reserva até o retorno", "Vivências reais", "Flexibilidade" ].map((text, idx) => (
          
            <Card key={idx} className="p-6 text-center bg-primary text-white shadow-lg hover:shadow-xl transition-shadow group">
              <div className="flex justify-center mb-4 h-16">
                <img 
                  src={icLib3} 
                  alt="" 
                
                  className="h-full w-auto object-contain transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="font-bold text-lg text-primary-foreground">{text}</h3>
              <p className="text-sm text-primary-foreground/90 mt-2">
                {idx === 0 && "Longe da rotina, das cobranças, das expectativas alheias."}
   
                {idx === 1 && "Para que você tenha liberdade com segurança."}
                {idx === 2 && "Gastronomia local, cultura autêntica e conexões."}
                {idx === 3 && "Roteiros sugeridos + opções de personalização."}
              </p>
            </Card>
 
          ))}
        </div>
      </section>

      {/* Seção de Benefícios */}
      <Benefits />
      
      {/* Seção de contato final */}
      <ContactCTA />
    </SiteShell>
  );
}