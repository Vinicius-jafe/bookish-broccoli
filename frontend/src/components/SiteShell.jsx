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
import { Testimonials } from "./sections/Testimonials";
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
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          {/* Logo principal */}
          <img 
            src={logoFinal} 
            alt="Bella Renda & Viagens" 
            
            className="h-16 w-auto" 
          />
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
  // ALTERADO: Header principal com a cor primária (rosa) e a variante light com gradiente (para "pelo Brasil")
  const headerClasses = primaryColor ? "bg-primary text-white" : "bg-primary/20 text-primary"; 
  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      {/* Removido o rounded-t-lg e a borda de baixo para ficar igual às imagens */}
      <div className={`p-4 flex items-center justify-between relative ${headerClasses}`}>
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
        {/* Adicionando a imagem de libélula no canto direito (Apenas para a seção principal - rosa) */}
        {primaryColor && 
          <img 
            src={icLibVoando} 
            alt="Libélula" 
            className="absolute top-0 right-0 h-28 w-28 text-white/60 transform rotate-12 drop-shadow hidden md:block" 
            style={{ top: '-1rem', right: '-1.5rem', transform: 'scaleX(-1) rotate(12deg)' }} 
          />
        }
      </div>
      {/* Removida a borda para ficar igual às imagens (os cards já têm shadow/border) */}
      <div className="p-4 pt-6">
        <Carousel className="w-full">
          <CarouselContent>
            {/* LINHA 214 ORIGINALMENTE DAVA ERRO. CORRIGIDO ASSIM: */}
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

// ... (Resto do código do arquivo SiteShell.jsx)

// === Contact CTA (seção do formulário - ALTERADO para ficar igual a 4.png no layout da Home) ===
function ContactCTA() {
  // Efeito para carregar o formulário RD Station
  useEffect(() => {
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
  }, []);
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
        {/* Removido o h-3 bg-primary/20 e a div de baixo para replicar o layout 4.png */}
        <div className="bg-primary px-6 py-6 rounded-lg shadow-xl">
          <h3 className="text-white text-center mb-3">Entraremos em contato com os dados informados abaixo:</h3>
          <div className="space-y-3 max-w-xl mx-auto">
            <div role="main" id="integracao-3bd2e2520b4a83678275"></div>
     
          </div>
        </div>
        {/* Removido o h-3 bg-primary/20 */}
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
      <section className="relative bg-white border-b overflow-hidden">
        {/* Apenas a libélula */}
        <div className="absolute inset-0 z-0">
          <img 
            src={icLibVoando} 
            alt="" 
            className="absolute w-1/2 h-auto 
max-w-lg"
            style={{
              transform: 'scaleX(-1)',
              top: '50%',
              right: '5%',
              transformOrigin: 'center',
              maxHeight: '90%',
             
              opacity: 0.7
            }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div className="text-gray-800">
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
            {featuredImages.slice(0, 2).map((img, index) => (
              <div key={index} className={`absolute ${index === 0 ? 'rotate-3' : '-rotate-6'}`}
                style={{
                  
                  top: index === 0 ? '20%' : '10%',
                  left: index === 0 ? '10%' : 'auto',
                  right: index === 0 ? 'auto' : '10%',
                  zIndex: 10 - index
                }}>
      
                <img 
                  src={imageUrl(img)} 
                  alt={`Destino ${index + 1}`} 
                  className="w-48 h-64 object-cover shadow-xl border-4 border-white"
                />
         
                <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-base font-semibold text-white bg-black/50 px-3 py-1 rounded-full">
                  {index === 0 ?
'FRANÇA' : 'ITÁLIA'}
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

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img 
            src={icLibVoando1} 
            alt="" 
            className="w-full h-full object-cover opacity-5"
          
          />
        </div>
        <Row 
          title="Por mulheres" 
          subtitle="Roteiros mais procurados"
          filter={(p)=>p.type==="internacional"}
          primaryColor={true}
        />
      </div>

      {/* Banner entre listas (Fundo da imagem 3.jpg) */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
     
        <div className="rounded overflow-hidden bg-cover bg-center h-40 md:h-52 flex items-center" style={{backgroundImage:"url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop')"}}>
          <div className="bg-white/85 w-full h-full flex items-center">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-4 items-center w-full">
              <div className="flex items-center gap-4">
                <img 
                  src={logoFinal} 
                  alt="Bella Renda & Viagens" 
                  className="h-12 w-auto opacity-90"
                />
                <div className="text-2xl font-serif text-primary">Bella renda & viagens</div>
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
        <div className="relative z-10">
          <Benefits />
        </div>
      </div>

      {/* Popular Packages */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
          
            src={icLibVoando1} 
            alt="" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative z-10">
          <Row 
            title="ROTEIROS MAIS PROCURADOS"
      
            subtitle="Os destinos preferidos das nossas viajantes"
            filter="popular"
          >
            {packages.filter(pkg => pkg.isPopular).map((pkg) => (
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

      {/* Seção de contato final */}
      <ContactCTA />
      
      {/* Seção de Benefícios */}
      <Benefits />
      
      {/* Seção de Depoimentos */}
      <Testimonials />
      
      {/* Seção CTA Final */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Pronta para sua próxima aventura?</h2>
          <p className="mb-8 text-primary-foreground/90">Entre em contato agora mesmo e comece a planejar sua viagem dos sonhos</p>
          <a href="#contato">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg">
      
              Fale com um especialista
            </Button>
          </a>
        </div>
      </div>
    </SiteShell>
  );
}