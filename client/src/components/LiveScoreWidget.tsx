import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { footballApi, Match } from "@/services/footballApi";
import { Loader2, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function LiveScoreWidget() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await footballApi.getLiveMatches();
        setMatches(data);
      } catch (error) {
        console.error("Failed to fetch matches", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    // Atualiza a cada 60 segundos
    const interval = setInterval(fetchMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-accent/50 bg-card/50">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="font-display text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-red-500 animate-pulse" />
            AO VIVO
          </span>
          <Badge variant="outline" className="text-[10px] font-normal">
            Atualização automática
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {matches.map((match) => (
              <Link key={match.fixture.id} href={`/jogo/${match.fixture.id}`}>
                <a className="block p-3 hover:bg-accent/5 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {match.league.name}
                  </span>
                  <span className="text-[10px] font-mono text-green-500 font-bold">
                    {match.fixture.status.elapsed}'
                  </span>
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  {/* Home Team */}
                  <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    <img src={match.teams.home.logo} alt={match.teams.home.name} className="h-5 w-5 object-contain" />
                    <span className="text-xs font-bold truncate">{match.teams.home.name}</span>
                  </div>
                  
                  {/* Score */}
                  <div className="bg-muted px-2 py-1 rounded text-xs font-mono font-bold min-w-[40px] text-center">
                    {match.goals.home} - {match.goals.away}
                  </div>
                  
                  {/* Away Team */}
                  <div className="flex items-center gap-2 flex-1 justify-end overflow-hidden">
                    <span className="text-xs font-bold truncate text-right">{match.teams.away.name}</span>
                    <img src={match.teams.away.logo} alt={match.teams.away.name} className="h-5 w-5 object-contain" />
                  </div>
                  </div>
                </a>
              </Link>
            ))}
            {matches.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                Nenhum jogo ao vivo no momento.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
