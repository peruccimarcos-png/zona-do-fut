import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { footballApi, Match } from "@/services/footballApi";
import { Calendar, Clock, Loader2, Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function TodayMatchesWidget() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await footballApi.getTodayMatches();
        // Mostra apenas os primeiros 3 jogos no widget
        setMatches(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch today's matches", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Jogos de Hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : matches.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum jogo programado para hoje.
          </p>
        ) : (
          <>
            {matches.map((match) => (
              <Link key={match.fixture.id} href={`/jogo/${match.fixture.id}`}>
                <a className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(match.fixture.date)}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {match.league.name}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <img src={match.teams.home.logo} alt={match.teams.home.name} className="h-5 w-5 object-contain" />
                      <span className="text-sm font-medium truncate">{match.teams.home.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={match.teams.away.logo} alt={match.teams.away.name} className="h-5 w-5 object-contain" />
                      <span className="text-sm font-medium truncate">{match.teams.away.name}</span>
                    </div>
                  </div>

                  {match.broadcast && match.broadcast.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border flex items-center gap-1.5 flex-wrap">
                      <Tv className="h-3 w-3 text-accent" />
                      <span className="text-xs text-accent font-medium">
                        {match.broadcast.map(b => b.name).join(', ')}
                      </span>
                    </div>
                  )}
                </a>
              </Link>
            ))}

            <Link href="/jogos-de-hoje">
              <Button variant="outline" className="w-full mt-2" size="sm">
                Ver Todos os Jogos
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
