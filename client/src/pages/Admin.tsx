import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Edit, Plus, Trash2, Eye } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Admin() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: articles, isLoading, refetch } = trpc.articles.listAll.useQuery(undefined, {
    enabled: !!user && user.role === 'admin',
  });
  
  const deleteMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("Artigo deletado com sucesso!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Erro ao deletar: ${error.message}`);
    },
  });
  
  // Verificar autenticação
  if (!user) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-8">
            Você precisa estar logado para acessar o painel administrativo.
          </p>
          <Button asChild>
            <a href="/api/auth/login">Fazer Login</a>
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Verificar se é admin
  if (user.role !== 'admin') {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-8">
            Você não tem permissão para acessar esta página.
          </p>
          <Button asChild>
            <Link href="/">Voltar para Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const handleDelete = (id: number, title: string) => {
    if (confirm(`Tem certeza que deseja deletar "${title}"?`)) {
      deleteMutation.mutate({ id });
    }
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-chakra font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground mt-2">Gerencie os artigos do ZONA DO FUT</p>
          </div>
          <Button asChild>
            <Link href="/admin/novo-artigo">
              <Plus className="w-4 h-4 mr-2" />
              Novo Artigo
            </Link>
          </Button>
        </div>
        
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando artigos...</p>
          </div>
        )}
        
        {!isLoading && articles && articles.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum artigo criado ainda.</p>
            <Button asChild>
              <Link href="/admin/novo-artigo">Criar Primeiro Artigo</Link>
            </Button>
          </Card>
        )}
        
        {!isLoading && articles && articles.length > 0 && (
          <div className="space-y-4">
            {articles.map((article: any) => (
              <Card key={article.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{article.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        article.status === 'published' 
                          ? 'bg-green-500/20 text-green-600' 
                          : 'bg-yellow-500/20 text-yellow-600'
                      }`}>
                        {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {article.excerpt || 'Sem resumo'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views} visualizações
                      </span>
                      <span>Categoria: {article.category}</span>
                      <span>
                        {article.publishedAt 
                          ? `Publicado em ${new Date(article.publishedAt).toLocaleDateString('pt-BR')}`
                          : `Criado em ${new Date(article.createdAt).toLocaleDateString('pt-BR')}`
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(`/admin/editar/${article.id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article.id, article.title)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
