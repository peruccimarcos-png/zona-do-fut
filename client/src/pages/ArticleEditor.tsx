import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import { Sparkles, Save, Eye } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function ArticleEditor() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const articleId = params.id ? parseInt(params.id) : null;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Notícias");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Buscar artigo se estiver editando
  const { data: article } = trpc.articles.listAll.useQuery(undefined, {
    enabled: !!articleId && !!user && user.role === 'admin',
  });
  
  useEffect(() => {
    if (article && articleId) {
      const currentArticle = article.find((a: any) => a.id === articleId);
      if (currentArticle) {
        setTitle(currentArticle.title);
        setContent(currentArticle.content);
        setExcerpt(currentArticle.excerpt || "");
        setCategory(currentArticle.category);
        setImageUrl(currentArticle.imageUrl || "");
        setStatus(currentArticle.status);
      }
    }
  }, [article, articleId]);
  
  const createMutation = trpc.articles.create.useMutation({
    onSuccess: () => {
      toast.success("Artigo criado com sucesso!");
      setLocation("/admin");
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar: ${error.message}`);
    },
  });
  
  const updateMutation = trpc.articles.update.useMutation({
    onSuccess: () => {
      toast.success("Artigo atualizado com sucesso!");
      setLocation("/admin");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });
  
  const generateMutation = trpc.articles.generateContent.useMutation({
    onSuccess: (data) => {
      setContent(data.content);
      setExcerpt(data.excerpt);
      toast.success("Conteúdo gerado com sucesso! Revise e edite se necessário.");
      setIsGenerating(false);
    },
    onError: (error: any) => {
      toast.error(`Erro ao gerar: ${error.message}`);
      setIsGenerating(false);
    },
  });
  
  const handleGenerateContent = () => {
    if (!title.trim()) {
      toast.error("Digite um título primeiro!");
      return;
    }
    
    setIsGenerating(true);
    generateMutation.mutate({
      title,
      category,
    });
  };
  
  const handleSave = (saveStatus: "draft" | "published") => {
    if (!title.trim() || !content.trim()) {
      toast.error("Título e conteúdo são obrigatórios!");
      return;
    }
    
    const data = {
      title,
      content,
      excerpt: excerpt || undefined,
      category,
      imageUrl: imageUrl || undefined,
      status: saveStatus,
    };
    
    if (articleId) {
      updateMutation.mutate({ id: articleId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };
  
  // Verificar autenticação e permissão
  if (!user || user.role !== 'admin') {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Acesso Negado</h1>
          <Button asChild>
            <Link href="/">Voltar para Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-chakra font-bold">
              {articleId ? "Editar Artigo" : "Novo Artigo"}
            </h1>
            <p className="text-muted-foreground mt-2">
              Use a IA para gerar conteúdo automaticamente
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin">Cancelar</Link>
          </Button>
        </div>
        
        <Card className="p-6 space-y-6">
          {/* Título */}
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Flamengo anuncia contratação de Pedro Raul"
              className="mt-2"
            />
          </div>
          
          {/* Categoria e Imagem */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Notícias">Notícias</SelectItem>
                  <SelectItem value="Análises">Análises</SelectItem>
                  <SelectItem value="Mercado da Bola">Mercado da Bola</SelectItem>
                  <SelectItem value="Brasileirão">Brasileirão</SelectItem>
                  <SelectItem value="Internacional">Internacional</SelectItem>
                  <SelectItem value="Bastidores">Bastidores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="mt-2"
              />
            </div>
          </div>
          
          {/* Botão Gerar com IA */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Gerador de Conteúdo com IA
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  A IA vai escrever uma análise completa baseada no título
                </p>
              </div>
              <Button
                onClick={handleGenerateContent}
                disabled={isGenerating || !title.trim()}
                className="bg-gradient-to-r from-primary to-accent"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar com IA
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Conteúdo */}
          <div>
            <Label htmlFor="content">Conteúdo * (Markdown)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva o conteúdo do artigo aqui ou use o gerador de IA..."
              className="mt-2 min-h-[400px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Suporta Markdown: **negrito**, *itálico*, listas, etc.
            </p>
          </div>
          
          {/* Resumo */}
          <div>
            <Label htmlFor="excerpt">Resumo (opcional)</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve resumo que aparece nas listagens..."
              className="mt-2"
              rows={3}
            />
          </div>
          
          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => handleSave("draft")}
              variant="outline"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button
              onClick={() => handleSave("published")}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Eye className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
