import Layout from "@/components/Layout";
import NewsCard from "@/components/NewsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRoute } from "wouter";

export default function Category() {
  const [match, params] = useRoute("/:category");
  const categoryName = params?.category ? params.category.charAt(0).toUpperCase() + params.category.slice(1) : "Notícias";

  // Mock data
  const newsList = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    title: `Título da notícia ${i + 1} sobre ${categoryName} com detalhes importantes`,
    category: categoryName,
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop",
    time: `${i + 2} horas atrás`,
    slug: `noticia-${i}`,
  }));

  return (
    <Layout>
      <div className="bg-primary py-12 text-primary-foreground">
        <div className="container">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">{categoryName}</h1>
          <p className="text-primary-foreground/80 text-lg">
            As últimas notícias, resultados e análises sobre {categoryName}.
          </p>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          <Button variant="secondary" className="rounded-full">Tudo</Button>
          <Button variant="ghost" className="rounded-full">Transferências</Button>
          <Button variant="ghost" className="rounded-full">Jogos</Button>
          <Button variant="ghost" className="rounded-full">Entrevistas</Button>
          <Button variant="ghost" className="rounded-full">Opinião</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <NewsCard 
              key={news.id} 
              {...news} 
              image="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop"
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline">Carregar Mais Notícias</Button>
        </div>
      </div>
    </Layout>
  );
}
