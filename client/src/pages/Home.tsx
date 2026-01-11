import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import NewsCard from "@/components/NewsCard";
import LiveScoreWidget from "@/components/LiveScoreWidget";
import StandingsTable from "@/components/StandingsTable";
import TodayMatchesWidget from "@/components/TodayMatchesWidget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Flame, TrendingUp, Trophy, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  // Buscar artigos reais do banco de dados
  const { data: articles } = trpc.articles.list.useQuery({ limit: 12 });
  
  // Dados mockados para exemplo (fallback)
  const featuredNews = articles && articles.length > 0 ? articles.slice(0, 4).map((article: any) => ({
    id: article.id,
    title: article.title,
    category: article.category,
    image: article.imageUrl || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop",
    time: new Date(article.publishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    slug: article.slug,
    featured: true
  })) : [
    {
      id: 1,
      title: "BOMBA: Palmeiras fecha com atacante de peso para a Libertadores!",
      category: "Mercado",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop",
      time: "10 min atrás",
      slug: "palmeiras-fecha-atacante",
      featured: true
    },
    {
      id: 2,
      title: "Flamengo anuncia novo técnico após saída polêmica",
      category: "Brasileirão",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
      time: "30 min atrás",
      slug: "flamengo-novo-tecnico"
    },
    {
      id: 3,
      title: "Real Madrid prepara oferta milionária por joia do Santos",
      category: "Mundo",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
      time: "1 hora atrás",
      slug: "real-madrid-oferta-santos"
    },
    {
      id: 4,
      title: "Neymar de volta ao Brasil? Entenda os rumores",
      category: "Bastidores",
      image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop",
      time: "2 horas atrás",
      slug: "neymar-volta-brasil"
    }
  ];

  const latestNews = articles && articles.length > 4 ? articles.slice(4, 8).map((article: any) => ({
    id: article.id,
    title: article.title,
    category: article.category,
    image: article.imageUrl || "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=800&auto=format&fit=crop",
    time: new Date(article.publishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    slug: article.slug
  })) : [
    {
      id: 5,
      title: "Corinthians vence clássico com gol nos acréscimos",
      category: "Brasileirão",
      image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=800&auto=format&fit=crop",
      time: "3 horas atrás",
      slug: "corinthians-vence-classico"
    },
    {
      id: 6,
      title: "Messi brilha na MLS e quebra mais um recorde histórico",
      category: "Mundo",
      image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800&auto=format&fit=crop",
      time: "4 horas atrás",
      slug: "messi-recorde-mls"
    },
    {
      id: 7,
      title: "São Paulo divulga lista de relacionados para a final",
      category: "Copa do Brasil",
      image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=800&auto=format&fit=crop",
      time: "5 horas atrás",
      slug: "sao-paulo-relacionados"
    },
    {
      id: 8,
      title: "Vasco consegue efeito suspensivo e terá torcida em São Januário",
      category: "Brasileirão",
      image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=800&auto=format&fit=crop",
      time: "6 horas atrás",
      slug: "vasco-efeito-suspensivo"
    }
  ];

  const marketUpdates = [
    { player: "Mbappé", from: "PSG", to: "Real Madrid", status: "Confirmado" },
    { player: "De La Cruz", from: "River", to: "Flamengo", status: "Rumor Quente" },
    { player: "Scarpa", from: "Forest", to: "Atlético-MG", status: "Fechado" },
    { player: "Di Maria", from: "Benfica", to: "Rosário", status: "Especulação" },
  ];

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative bg-primary py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent"></div>
        
        <div className="container relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4 text-center md:text-left">
            <Badge variant="outline" className="border-accent text-accent mb-2 animate-pulse">
              <span className="mr-2">●</span> AO VIVO: Acompanhe o Mercado da Bola
            </Badge>
            <h1 className="font-display font-bold text-4xl md:text-6xl text-white tracking-tight">
              FUTEBOL SEM <span className="text-accent">ENROLAÇÃO</span>.
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
              Notícias rápidas, resultados e tudo o que acontece no mundo da bola em tempo real.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                Ver Últimas Notícias
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10">
                Tabelas & Jogos
              </Button>
            </div>
          </div>
          
          {/* Elemento Decorativo ou Imagem Hero */}
          <div className="hidden md:block relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/53/53283.png" 
              alt="Bola de Futebol" 
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl opacity-90 rotate-12 hover:rotate-0 transition-transform duration-700"
              style={{ filter: "invert(1)" }}
            />
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Coluna Principal (Notícias) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Destaques Principais */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-2xl flex items-center gap-2">
                  <Flame className="text-accent fill-accent" />
                  Bombando Agora
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredNews.map((news, index) => (
                  <div key={news.id} className={index === 0 ? "md:col-span-2" : ""}>
                    <NewsCard {...news} featured={index === 0} />
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Feed de Notícias */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-2xl flex items-center gap-2">
                  <Clock className="text-primary" />
                  Últimas do Dia
                </h2>
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  Ver todas <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestNews.map((news) => (
                  <NewsCard key={news.id} {...news} />
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Widget Jogos de Hoje */}
            <TodayMatchesWidget />

            {/* Widget Placar ao Vivo */}
            <LiveScoreWidget />

            {/* Tabela de Classificação */}
            <StandingsTable />
            
            {/* Widget Mercado da Bola */}
            <Card className="border-accent/50 bg-accent/5 overflow-hidden">
              <CardHeader className="bg-accent/10 border-b border-accent/20 pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2 text-primary">
                  <TrendingUp className="h-5 w-5" />
                  Mercado da Bola
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {marketUpdates.map((item, idx) => (
                    <div key={idx} className="p-4 hover:bg-accent/5 transition-colors flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">{item.player}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.from} <span className="text-accent font-bold">→</span> {item.to}
                        </p>
                      </div>
                      <Badge variant={item.status === "Confirmado" || item.status === "Fechado" ? "default" : "outline"} className="text-[10px]">
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-3 bg-accent/10 border-t border-accent/20 text-center">
                <Link href="/mercado">
                  <a className="text-xs font-bold text-primary hover:underline">Ver todas as transferências</a>
                </Link>
              </div>
            </Card>

            {/* Widget Mais Lidas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Mais Lidas da Semana
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer group">
                      <span className="font-display font-bold text-2xl text-muted-foreground/30 group-hover:text-accent transition-colors">
                        0{i}
                      </span>
                      <div>
                        <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                          Torcida do Flamengo protesta no CT após derrota no clássico
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categorias / Tags */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Navegue por Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["Brasileirão", "Libertadores", "Flamengo", "Palmeiras", "Corinthians", "Seleção", "Neymar", "CR7", "Messi", "Champions"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Banner Publicidade (Placeholder) */}
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
              <span className="text-muted-foreground text-sm font-medium">Espaço Publicitário</span>
            </div>

          </aside>
        </div>
      </div>
    </Layout>
  );
}
