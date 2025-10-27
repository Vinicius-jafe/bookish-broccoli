import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../hooks/use-toast";
import { SiteShell } from "../components/SiteShell";
import { isAdmin, loginAdmin, logoutAdmin, loadPackages, upsertPackage, deletePackage } from "../api";

function PackageForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(
    initial || {
      id: "",
      slug: "",
      title: "",
      type: "nacional",
      region: "",
      destination: "",
      duration: 3,
      months: [],
      priceFrom: 0,
      featuredHome: false,
      images: [],
      inclusions: [],
      shortDescription: "",
      longDescription: "",
    }
  );

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.slug)
      form.slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    if (typeof form.duration === "string")
      form.duration = parseInt(form.duration || "0", 10);
    if (typeof form.priceFrom === "string")
      form.priceFrom = parseFloat(form.priceFrom || "0");

    try {
      await upsertPackage(form);
      toast({ title: "Pacote salvo", description: form.title });
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      toast({ title: "Erro ao salvar pacote" });
    }
  };

  return (
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm">Título</label>
        <Input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm">Slug</label>
        <Input
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          placeholder="auto"
        />
      </div>
      <div>
        <label className="text-sm">Tipo</label>
        <Select value={form.type} onValueChange={(v) => set("type", v)}>
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
        <Input
          value={form.region}
          onChange={(e) => set("region", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">Destino</label>
        <Input
          value={form.destination}
          onChange={(e) => set("destination", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">Duração (dias)</label>
        <Input
          type="number"
          min={1}
          max={30}
          value={form.duration}
          onChange={(e) => set("duration", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">Meses (separe por vírgula)</label>
        <Input
          value={(form.months || []).join(",")}
          onChange={(e) =>
            set(
              "months",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
      </div>
      <div>
        <label className="text-sm">Preço a partir de</label>
        <Input
          type="number"
          min={0}
          step="0.01"
          value={form.priceFrom}
          onChange={(e) => set("priceFrom", e.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm">Imagens (URLs separadas por vírgula)</label>
        <Textarea
          value={(form.images || []).join(",")}
          onChange={(e) =>
            set(
              "images",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm">Inclusões (separe por vírgula)</label>
        <Input
          value={(form.inclusions || []).join(",")}
          onChange={(e) =>
            set(
              "inclusions",
              e.target.value
                .split(",")
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
          onChange={(e) => set("shortDescription", e.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm">Descrição longa</label>
        <Textarea
          value={form.longDescription}
          onChange={(e) => set("longDescription", e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 md:col-span-2">
        <input
          id="featuredHome"
          type="checkbox"
          checked={!!form.featuredHome}
          onChange={(e) => set("featuredHome", e.target.checked)}
        />
        <label htmlFor="featuredHome" className="text-sm">
          Destaque na Home
        </label>
      </div>
      <div className="md:col-span-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}

export default function Admin() {
  const nav = useNavigate();
  const [logged, setLogged] = useState(isAdmin());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);

  // 🔄 Carregar pacotes do backend
  useEffect(() => {
    loadPackages()
      .then(setData)
      .catch((err) => console.error("Erro ao carregar pacotes:", err));
  }, []);

  const doLogin = async (e) => {
    e.preventDefault();
    const ok = await loginAdmin(email, password);
    if (ok) {
      toast({ title: "Login realizado" });
      setLogged(true);
    } else {
      toast({ title: "Credenciais inválidas" });
    }
  };

  const doLogout = () => {
    logoutAdmin();
    setLogged(false);
    nav("/");
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
            <div className="text-xs text-muted-foreground">
              Use admin@site.com / admin123
            </div>
          </form>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Gerenciar Pacotes</h1>
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
                {p.destination} • {p.type} • R${" "}
                {p.priceFrom?.toLocaleString("pt-BR")}
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startEdit(p)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await deletePackage(p.id);
                    toast({ title: "Excluído" });
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
      </section>
    </SiteShell>
  );
}
