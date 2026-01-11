import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ExternalLink, Star, Trophy, XCircle } from "lucide-react";

interface Bookmaker {
  id: number;
  rank: number;
  name: string;
  logo: string;
  rating: number;
  bonus: string;
  pros: string[];
  cons: string[];
  color: string;
  link: string;
}

const BOOKMAKERS: Bookmaker[] = [
  {
    id: 1,
    rank: 1,
    name: "Bet365",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Bet365_Logo.svg/1200px-Bet365_Logo.svg.png",
    rating: 5.0,
    bonus: "R$ 500 em Créditos de Aposta",
    pros: ["Melhores Odds do mercado", "Transmissão ao vivo de jogos", "App excelente"],
    cons: ["Design um pouco datado"],
    color: "bg-[#00703c]",
    link: "#"
  },
  {
    id: 2,
    rank: 2,
    name: "Betano",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Betano_Logo.png/1200px-Betano_Logo.png",
    rating: 4.8,
    bonus: "100% até R$ 1.000 + R$ 20 Grátis",
    pros: ["Missões com recompensas", "SuperOdds diárias", "Interface muito moderna"],
    cons: ["Rollover do bônus pode ser alto"],
    color: "bg-[#ff6b00]",
    link: "#"
  },
  {
    id: 3,
    rank: 3,
    name: "Sportingbet",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Sportingbet_logo.svg/2560px-Sportingbet_logo.svg.png",
    rating: 4.5,
    bonus: "Bônus de até R$ 750",
    pros: ["Marca muito confiável", "Saque via PIX rápido", "Fácil para iniciantes"],
    cons: ["Odds médias"],
    color: "bg-[#003399]",
    link: "#"
  },
  {
    id: 4,
    rank: 4,
    name: "Betfair",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Betfair_logo.svg/2560px-Betfair_logo.svg.png",
    rating: 4.4,
    bonus: "100% até R$ 200 no Exchange",
    pros: ["Maior bolsa de apostas (Exchange)", "Cashout parcial e total", "Odds turbinadas"],
    cons: ["Curva de aprendizado maior"],
    color: "bg-[#ffb80c]",
    link: "#"
  },
  {
    id: 5,
    rank: 5,
    name: "KTO",
    logo: "https://logovectorseek.com/wp-content/uploads/2021/08/kto-logo-vector.png",
    rating: 4.2,
    bonus: "Aposta Grátis de até R$ 200",
    pros: ["Primeira aposta sem risco", "Malandrinha (Loteria)", "Suporte em português rápido"],
    cons: ["Menos mercados asiáticos"],
    color: "bg-[#000000]",
    link: "#"
  }
];

export default function BettingRanking() {
  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Ranking 2024</Badge>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Melhores Casas de Apostas
            </h1>
            <p className="text-xl text-muted-foreground">
              Analisamos as principais plataformas para você escolher a melhor opção. 
              Aproveite os bônus exclusivos de boas-vindas.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {BOOKMAKERS.map((bookmaker) => (
              <Card key={bookmaker.id} className="overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Rank & Logo Section */}
                    <div className="relative md:w-64 p-6 flex flex-col items-center justify-center bg-muted/10 border-b md:border-b-0 md:border-r border-border/50">
                      <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-3 py-1 rounded-br-lg font-bold text-sm flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> #{bookmaker.rank}
                      </div>
                      <div className="h-16 w-full flex items-center justify-center mb-4">
                        {/* Placeholder para logo real, usando texto estilizado se imagem falhar */}
                        <div className={`text-2xl font-black ${bookmaker.name === 'Bet365' ? 'text-[#00703c]' : bookmaker.name === 'Betano' ? 'text-[#ff6b00]' : 'text-foreground'}`}>
                          {bookmaker.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(bookmaker.rating) ? 'fill-current' : 'opacity-30'}`} 
                          />
                        ))}
                        <span className="text-foreground font-bold ml-2">{bookmaker.rating}</span>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Bônus de Boas-vindas</h3>
                        <div className="text-2xl md:text-3xl font-black text-primary">
                          {bookmaker.bonus}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-bold mb-2 flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-3 w-3" /> PRÓS
                          </h4>
                          <ul className="space-y-1">
                            {bookmaker.pros.map((pro, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold mb-2 flex items-center gap-1 text-red-600 dark:text-red-400">
                            <XCircle className="h-3 w-3" /> CONTRAS
                          </h4>
                          <ul className="space-y-1">
                            {bookmaker.cons.map((con, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="block h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Action Section */}
                    <div className="md:w-64 p-6 flex flex-col items-center justify-center bg-muted/5 border-t md:border-t-0 md:border-l border-border/50">
                      <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform mb-3" size="lg">
                        PEGAR BÔNUS <ExternalLink className="ml-2 h-5 w-5" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        T&C Aplicáveis. 18+
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-bold">Como escolhemos as melhores casas?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-card p-4 rounded-lg border border-border">
                <h3 className="font-bold mb-2">🔒 Segurança</h3>
                <p className="text-sm text-muted-foreground">Apenas listamos sites licenciados e com reputação comprovada no mercado brasileiro.</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <h3 className="font-bold mb-2">💰 Odds Justas</h3>
                <p className="text-sm text-muted-foreground">Comparamos as cotações para garantir que você tenha o melhor retorno possível.</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <h3 className="font-bold mb-2">⚡ Saque Rápido</h3>
                <p className="text-sm text-muted-foreground">Priorizamos casas que aceitam PIX e pagam os ganhos em minutos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
