import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Facebook, Share2, Twitter, User } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function NewsDetail() {
  const [match, params] = useRoute("/noticia/:slug");
  const slug = params?.slug || "";

  // Buscar artigo real do banco de dados
  const { data: article, isLoading } = trpc.articles.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
          <Link href="/">
            <a className="text-accent hover:underline">Voltar para a home</a>
          </Link>
        </div>
      </Layout>
    );
  }

  // Dados do artigo
  const news = {
    title: article.title,
    subtitle: article.excerpt || "",
    category: article.category,
    author: "Redação Zona do Fut",
    date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('pt-BR') : "",
    time: article.publishedAt ? new Date(article.publishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : "",
    image: article.imageUrl || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
    content: article.content
  };

  return (
    <Layout>
      <article className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Conteúdo Principal */}
          <div className="lg:col-span-8">
            <div className="space-y-4 mb-8">
              <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-bold px-3 py-1">
                {news.category}
              </Badge>
              <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight text-primary">
                {news.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {news.subtitle}
              </p>
              
              <div className="flex items-center justify-between py-4 border-y border-border">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-foreground">{news.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{news.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{news.time}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-8 shadow-lg">
              <img 
                src={news.image} 
                alt={news.title}
                className="object-cover w-full h-full"
              />
            </div>

            <div 
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-accent prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            <Separator className="my-12" />

            {/* Seção de Comentários (Placeholder) */}
            <div className="bg-muted/30 p-6 rounded-lg border border-border">
              <h3 className="font-display font-bold text-xl mb-4">Comentários</h3>
              <p className="text-muted-foreground text-sm mb-4">Participe da discussão com outros torcedores.</p>
              <Button className="w-full sm:w-auto">Entrar para comentar</Button>
            </div>
          </div>

          {/* Sidebar (Reutilizada ou Específica) */}
          <aside className="lg:col-span-4 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-lg mb-4">Leia Também</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Link key={i} href="#">
                      <a className="block group">
                        <div className="flex gap-3">
                          <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={`https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=200&auto=format&fit=crop`} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              alt="Thumb"
                            />
                          </div>
                          <div>
                            <Badge variant="outline" className="text-[10px] mb-1">Brasileirão</Badge>
                            <h4 className="font-bold text-sm leading-snug group-hover:text-accent transition-colors">
                              Técnico do Flamengo fala sobre pressão após derrota
                            </h4>
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Banner Lateral */}
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 text-center">
              <h3 className="font-display font-bold text-xl text-primary mb-2">Quer receber notícias no Zap?</h3>
              <p className="text-sm text-muted-foreground mb-4">Entre no nosso grupo VIP e não perca nada!</p>
              <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold">
                Entrar no Grupo
              </Button>
            </div>
          </aside>

        </div>
      </article>
    </Layout>
  );
}
