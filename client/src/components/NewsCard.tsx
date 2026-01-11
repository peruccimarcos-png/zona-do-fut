import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Clock, Share2 } from "lucide-react";
import { Link } from "wouter";

interface NewsCardProps {
  title: string;
  category: string;
  image: string;
  time: string;
  slug: string;
  featured?: boolean;
}

export default function NewsCard({ title, category, image, time, slug, featured = false }: NewsCardProps) {
  return (
    <Link href={`/noticia/${slug}`}>
      <a className="block h-full group">
        <Card className={`h-full overflow-hidden border-border hover:border-accent transition-all duration-300 hover:shadow-md ${featured ? 'bg-card' : 'bg-card/50'}`}>
          <div className="relative overflow-hidden aspect-video">
            <img 
              src={image} 
              alt={title} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-primary text-primary-foreground font-bold uppercase text-[10px] tracking-wider hover:bg-primary/90">
                {category}
              </Badge>
            </div>
          </div>
          
          <CardHeader className="p-4 pb-2">
            <h3 className={`font-display font-bold leading-tight group-hover:text-primary transition-colors ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
              {title}
            </h3>
          </CardHeader>
          
          <CardFooter className="p-4 pt-2 flex items-center justify-between text-muted-foreground text-xs">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{time}</span>
            </div>
            <Share2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}
