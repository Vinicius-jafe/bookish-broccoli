// Admin.jsx (ou o nome do seu arquivo)
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { SiteShell } from '../components/SiteShell';
import {
  isAdmin,
  loginAdmin,
  logoutAdmin,
  loadPackages,
  upsertPackage,
  deletePackage,
  uploadPackageImages, // 👈 NOVO: Função para enviar as imagens ao backend
} from '../services/api';
// ====================================================================
// COMPONENTE PACKAGEFORM ATUALIZADO
// ====================================================================

function PackageForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(
    initial || {
      id: '',
      slug: '',
      title: '',
      type: 'nacional',
      region: '',

      destination: '',
      duration: 3,
      months: [],
      priceFrom: 0,
      featuredHome: false,
      images: [], // Continua sendo um array de URLs/caminhos
      inclusions: [],

      shortDescription: '',
      longDescription: '',
    }
  );
  const [selectedFiles, setSelectedFiles] = useState(null); // 👈 NOVO: Estado para armazenar os arquivos do input
  const [isUploading, setIsUploading] = useState(false);
  // 👈 NOVO: Estado para controle de loading

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const handleFileChange = (e) => {
    // Armazena a lista de arquivos selecionados no estado
    setSelectedFiles(e.target.files);
  };

  const handleUploadImages = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({ title: 'Atenção', description: 'Nenhuma imagem selecionada para upload.' });
      return null;
    }

    setIsUploading(true);
    const formData = new FormData();
    // Adiciona cada arquivo ao FormData com a chave 'images' (deve coincidir com o multer)
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    try {
      // Chama a nova função da API
      const result = await uploadPackageImages(formData);
      toast({ title: 'Upload Concluído', description: `${result.paths.length} imagens enviadas.` });

      // Retorna os novos caminhos para serem adicionados ao form.images
      return result.paths;
    } catch (err) {
      console.error('Erro no upload de imagens:', err);
      toast({ title: 'Erro no Upload', description: err.message || 'Falha ao enviar arquivos.' });
      return null;
    } finally {
      setIsUploading(false);
      setSelectedFiles(null);
      // Limpa o estado de arquivos após a tentativa
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    // 1. Processar o Upload de Imagens (se houver arquivos novos)
    let finalImagePaths = form.images;
    if (selectedFiles && selectedFiles.length > 0) {
      const uploadedPaths = await handleUploadImages();
      if (uploadedPaths) {
        // Adiciona os novos caminhos aos caminhos existentes do pacote
        finalImagePaths = [...form.images, ...uploadedPaths];
      } else {
        // Se o upload falhar, aborta o salvamento do pacote
        return;
      }
    }

    // 2. Lógica para slugify, campos numéricos, etc. (mantida)
    let finalSlug =
      form.slug ||
      (form.title
        ? form.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : '');

    let finalDuration =
      typeof form.duration === 'string' ? parseInt(form.duration || '0', 10) : form.duration;
    let finalPriceFrom =
      typeof form.priceFrom === 'string' ? parseFloat(form.priceFrom || '0') : form.priceFrom;
    const finalForm = {
      ...form,
      slug: finalSlug,
      duration: finalDuration,
      priceFrom: finalPriceFrom,
      images: finalImagePaths, // 👈 Usa a lista de paths atualizada
    };
    // 3. Salvar o Pacote
    try {
      await upsertPackage(finalForm);
      toast({ title: 'Pacote salvo', description: finalForm.title });
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      toast({ title: 'Erro ao salvar pacote' });
    }
  };
  return (
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
      {/* ... Campos existentes (Título, Slug, Tipo, Região, Destino, Duração, Preço, Meses) ... */}
      <div>
        <label className="text-sm">Título</label>
        <Input value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
      <div>
        <label className="text-sm">Slug</label>
        <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto" />
      </div>
      <div>
        <label className="text-sm">Tipo</label>
        <Select value={form.type} onValueChange={(v) => set('type', v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nacional">Nacional</SelectItem>
            <SelectItem value="internacional">Internacional</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm">Região</label>
        <Input value={form.region} onChange={(e) => set('region', e.target.value)} />
      </div>
      <div>
        <label className="text-sm">Destino</label>

        <Input value={form.destination} onChange={(e) => set('destination', e.target.value)} />
      </div>
      <div>
        <label className="text-sm">Duração (dias) - 0 para ilimitado</label>
        <Input
          type="number"
          min={0}
          value={form.duration}
          onChange={(e) =>
            set('duration', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)
          }
        />
      </div>
      <div>
        <label className="text-sm">Meses (separe por vírgula)</label>

        <Input
          value={(form.months || []).join(',')}
          onChange={(e) =>
            set(
              'months',

              e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
      </div>
      <div>
        <label className="text-sm">Preço a partir de</label>
        <Input
          type="text"
          inputMode="decimal"
          value={form.priceFrom?.toString().replace('.', ',') || ''}
          onChange={(e) => {
            // Allow only numbers and comma as decimal separator
            const value = e.target.value.replace(/[^0-9,]/g, '');
            // Replace comma with dot for storage
            const numericValue = value.replace(',', '.');
            set('priceFrom', numericValue ? parseFloat(numericValue) : 0);
          }}
          placeholder="0,00"
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* NOVO CAMPO: UPLOAD DE ARQUIVOS */}
      {/* ------------------------------------------------------------------- */}

      <div className="md:col-span-2">
        <label className="text-sm block">Enviar Novas Imagens</label>
        <Input
          type="file"
          multiple // Permite a seleção de múltiplos arquivos
          accept="image/jpeg,image/png,image/gif" // Aceita apenas tipos de imagem
          onChange={handleFileChange}
        />
        {selectedFiles && (
          <p className="text-xs text-muted-foreground mt-1">
            Arquivos selecionados: **{selectedFiles.length}**
          </p>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* CAMPO DE IMAGENS
EXISTENTES (Apenas visualização/remoção de paths) */}
      {/* ------------------------------------------------------------------- */}
      <div className="md:col-span-2">
        <label className="text-sm">Imagens Existentes (Paths)</label>
        <Textarea
          value={(form.images || []).join('\n')} // Mostra um path por linha
          placeholder="Os caminhos das imagens salvas aparecerão aqui. Edite para remover."
          onChange={(e) =>
            set(
              'images',
              e.target.value

                .split('\n') // Divide por quebra de linha
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
        <p className="text-xs text-muted-foreground mt-1">
          Se você enviar novas imagens, os caminhos serão adicionados acima. Edite este campo para
          remover imagens existentes.
        </p>
      </div>
      {/* ... Demais campos existentes (Inclusões, Descrições) ... */}
      <div className="md:col-span-2">
        <label className="text-sm">Inclusões (separe por vírgula)</label>
        <Input
          value={(form.inclusions || []).join(',')}
          onChange={(e) =>
            set(
              'inclusions',

              e.target.value
                .split(',')
                .map((s) => s.trim())

                .filter(Boolean)
            )
          }
        />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm">Descrição curta</label>
        <Input
          value={form.shortDescription}
          onChange={(e) => set('shortDescription', e.target.value)}
        />
      </div>

      <div className="md:col-span-2">
        <label className="text-sm">Descrição longa</label>
        <Textarea
          value={form.longDescription}
          onChange={(e) => set('longDescription', e.target.value)}
        />
        </div>
      <div className="flex items-center gap-2 md:col-span-2">
        <input
          id="featuredHome"
          type="checkbox"
          checked={!!form.featuredHome}
          onChange={(e) => set('featuredHome', e.target.checked)}
        />
        <label htmlFor="featuredHome" className="text-sm">
          Destaque na Home
        </label>
      </div>
      <div className="md:col-span-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isUploading}>
          Cancelar
        </Button>

        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Enviando Imagens...' : 'Salvar Pacote'}
        </Button>
      </div>
    </form>
  );
}

// ====================================================================
// BANNER MANAGEMENT COMPONENT
// ====================================================================
function BannerManagement() {
  const [currentBanner, setCurrentBanner] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Constante do novo endereço
  const API_BASE_URL = 'http://177.153.60.151:4000';
  const BANNER_API_URL = `${API_BASE_URL}/api/banner`;

  useEffect(() => {
    fetchCurrentBanner();
  }, []);

  const fetchCurrentBanner = async () => {
    try {
      // MUDANÇA AQUI
      const response = await fetch(BANNER_API_URL);
      const data = await response.json();
      if (data.success && data.imageUrl) {
        const cleanImageUrl = data.imageUrl.startsWith('/')
          ? data.imageUrl.substring(1)
          : data.imageUrl;
        // MUDANÇA AQUI
        setCurrentBanner(`${API_BASE_URL}/${cleanImageUrl}`);
      }
    } catch (error) {
      console.error('Erro ao carregar banner:', error);
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast({
        title: 'Atenção',
        description: 'Por favor, selecione um arquivo antes de enviar.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('banner', selectedFile);

    setIsUploading(true);
    try {
      // MUDANÇA AQUI
      const response = await fetch(BANNER_API_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        const cleanImageUrl = data.imageUrl.startsWith('/')
          ? data.imageUrl.substring(1)
          : data.imageUrl;
        // MUDANÇA AQUI
        setCurrentBanner(`${API_BASE_URL}/${cleanImageUrl}`);
        setSelectedFile(null);
        // Reset file input
        document.getElementById('banner-upload').value = '';
        toast({
          title: 'Sucesso',
          description: 'Banner atualizado com sucesso!',
          variant: 'default',
        });
      } else {
        throw new Error(data.message || 'Erro ao atualizar o banner');
      }
    } catch (error) {
      console.error('Erro ao enviar banner:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o banner. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Gerenciar Banner</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Banner Atual:</h3>
          {currentBanner ? (
            <div className="relative w-full h-40 overflow-hidden rounded-md border">
              <img src={currentBanner} alt="Banner atual" className="w-full h-full object-cover" />
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum banner definido</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Selecionar novo banner:</label>
            <Input
              id="banner-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tamanho recomendado: 1200x400px. Formatos: JPG, PNG, WEBP
            </p>
          </div>
          <Button type="submit" disabled={!selectedFile || isUploading} className="w-full">
            {isUploading ? 'Enviando...' : 'Enviar Banner'}
          </Button>
        </form>
      </div>
    </Card>
  );
}

// ====================================================================
// COMPONENTE ADMIN
// ====================================================================
export default function Admin() {
  // ... código do componente Admin (mantido o mesmo)
  const nav = useNavigate();
  const [logged, setLogged] = useState(isAdmin());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  // 🔄 Carregar pacotes do backend
  useEffect(() => {
    if (logged) {
      loadPackages()
        .then(setData)
        .catch((err) => console.error('Erro ao carregar pacotes:', err));
    }
  }, [logged]);
  const doLogin = async (e) => {
    e.preventDefault();
    const ok = await loginAdmin(email, password);
    if (ok) {
      toast({ title: 'Login realizado' });
      setLogged(true);
      loadPackages()
        .then(setData)
        .catch((err) => console.error('Erro ao carregar pacotes:', err));
    } else {
      toast({ title: 'Credenciais inválidas' });
    }
  };
  const doLogout = () => {
    logoutAdmin();
    setLogged(false);
    nav('/');
  };
  const startEdit = (pkg) => {
    setEditing(pkg || null);
    setShowForm(true);
  };
  const onSaved = async () => {
    const list = await loadPackages();
    setData(list);
    setShowForm(false);
    setEditing(null);
  };
  if (!logged) {
    return (
      <SiteShell>
        <div className="max-w-sm mx-auto px-4 py-16">
          <h1 className="text-2xl font-semibold mb-4">Área Administrativa</h1>
          <form onSubmit={doLogin} className="space-y-3">
            <div>
              <label className="text-sm">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        </div>

        {/* Banner Management Section */}
        <BannerManagement />

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Pacotes</h2>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => startEdit(null)}>
              Novo pacote
            </Button>

            <Button onClick={doLogout}>Sair</Button>
          </div>
        </div>

        {showForm && (
          <Card className="p-4 mt-6">
            <PackageForm
              initial={editing}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
              onSaved={onSaved}
            />
          </Card>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {data.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="font-medium line-clamp-2">{p.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {p.destination} • {p.type} • R$ {p.priceFrom?.toLocaleString('pt-BR')}
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="secondary" onClick={() => startEdit(p)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await deletePackage(p.id);
                    toast({ title: 'Excluído' });
                    const list = await loadPackages();
                    setData(list);
                  }}
                >
                  Excluir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}

// === FORMULÁRIO DE COTAÇÃO DETALHADO ===
function DetailedQuotationForm({ packageName }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Gostaria de mais informações sobre o pacote: ${packageName}`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aqui você pode adicionar a lógica para enviar o formulário
      // Por enquanto, apenas simulamos um envio
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        success: true,
        message: 'Solicitação enviada com sucesso! Em breve entraremos em contato.',
      });

      // Limpa o formulário após o envio
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: `Gostaria de mais informações sobre o pacote: ${packageName}`,
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Título principal do formulário */}
      <h2 className="text-xl font-bold text-center text-primary-foreground">
        Está preparada para dizer <span className="text-white">sim para você?</span>
      </h2>

      {/* Subtítulo */}
      <p className="text-sm text-center text-white/80 mb-6">
        Fale com a nossa equipe e descubra o roteiro que vai fazer seu coração vibrar. Além de
        parcelamento facilitado, oferecemos atendimento personalizado.
      </p>

      {/* Formulário de contato */}
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="package" value={packageName} />
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
            />
            </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
              Mensagem
            </label>
            <textarea
              id="message"
              name="message"
              rows="3"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
              placeholder="Conte-nos sobre o que você está procurando..."
            ></textarea>
          </div>
          {/* Mensagem de status do envio */}
          {submitStatus.message && (
            <div
              className={`p-3 rounded text-sm ${
                submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-primary font-semibold py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </div>
        </form>
      </div>

      {/* Rodapé do formulário */}
      <p className="text-sm text-center text-white/70 mt-4">
        Porque viajar é autocuidado, é liberdade, é reencontrar quem você é e o mundo espera.
      </p>
    </div>
  );
}

// === DETALHE DO PACOTE (MODIFICADO para usar o novo formulário) ===
export function PackageDetail() {
  // ... código restante de PackageDetail
  // ... mantido para completude do arquivo Packages.jsx ...
  const { slug } = useParams();
  const nav = useNavigate();

  // Constante do novo endereço
  const API_BASE_URL_IP = 'http://177.153.60.151:4000/api';

  // Function to load package by slug
  const loadPackageBySlug = async (slug) => {
    try {
      // MUDANÇA AQUI
      const response = await fetch(`${API_BASE_URL_IP}/packages/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch package');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading package:', error);
      return null;
    }
  };
  // setPkg para null (carregando) e false (não encontrado)
  const [pkg, setPkg] = useState(null);
  useEffect(() => {
    async function fetchPackage() {
      try {
        const found = await loadPackageBySlug(slug);

        if (!found) {
          toast({ title: 'Pacote não encontrado' });
        }
        setPkg(found || false); // Se não encontrar, setar como false
      } catch (err) {
        console.error('Erro ao buscar pacote:', err);
        toast({ title: 'Erro ao buscar pacote' });
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

  if (pkg === false) {
    // Verifica se é false (não encontrado/erro)
    return (
      <SiteShell>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold">Pacote não encontrado</h1>
          <Button className="mt-4 bg-primary hover:bg-primary/90" onClick={() => nav('/pacotes')}>
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

            {/* Formulário de cotação */}
            <div className="sticky top-4 h-fit">
              <Card className="border border-gray-200 shadow-lg overflow-hidden">
                {/* Removido o header simples, o DetailedQuotationForm renderiza todo o bloco da imagem 4.png */}
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
