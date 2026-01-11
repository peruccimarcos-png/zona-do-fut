import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { footballApi, Match } from "@/services/footballApi";
import { Calendar, Clock, Loader2, Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function TodayMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState<string>("Todos");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await footballApi.getTodayMatches();
        setMatches(data);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Filtrar jogos por liga selecionada
  const filteredMatches = selectedLeague === "Todos" 
    ? matches 
    : matches.filter(match => match.league.name === selectedLeague);

  // Extrair ligas únicas para os botões de filtro
  const uniqueLeagues = Array.from(new Set(matches.map(m => m.league.name)));

  // Agrupar jogos por liga
  const matchesByLeague = filteredMatches.reduce((acc, match) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) {
      acc[leagueName] = [];
    }
    acc[leagueName].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  return (
    <Layout>
      <div className="container py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="font-display text-4xl font-bold">Jogos de Hoje</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {formatDate(new Date().toISOString())}
          </p>
        </div>

        {/* Filtros por Campeonato */}
        {!loading && matches.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">Filtrar por campeonato:</p>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedLeague === "Todos" ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2"
                onClick={() => setSelectedLeague("Todos")}
              >
                Todos ({matches.length})
              </Badge>
              {uniqueLeagues.map((league) => {
                const count = matches.filter(m => m.league.name === league).length;
                return (
                  <Badge 
                    key={league}
                    variant={selectedLeague === league ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2"
                    onClick={() => setSelectedLeague(league)}
                  >
                    {league} ({count})
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-16">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        ) : matches.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Nenhum jogo programado</h2>
              <p className="text-muted-foreground">
                Não há jogos agendados para hoje. Volte amanhã para conferir a programação!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(matchesByLeague).map(([leagueName, leagueMatches]) => (
              <div key={leagueName}>
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={leagueMatches[0].league.logo} 
                    alt={leagueName} 
                    className="h-8 w-8 object-contain"
                  />
                  <h2 className="font-display text-2xl font-bold">{leagueName}</h2>
                  <Badge variant="secondary" className="ml-auto">
                    {leagueMatches.length} {leagueMatches.length === 1 ? 'jogo' : 'jogos'}
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {leagueMatches.map((match) => (
                    <Link key={match.fixture.id} href={`/jogo/${match.fixture.id}`}>
                      <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                        <CardContent className="p-6">
                          {/* Horário e Rodada */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-primary font-bold">
                              <Clock className="h-5 w-5" />
                              <span className="text-xl">{formatTime(match.fixture.date)}</span>
                            </div>
                            {match.league.round && (
                              <Badge variant="outline">{match.league.round}</Badge>
                            )}
                          </div>

                          {/* Times */}
                          <div className="space-y-4 mb-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={match.teams.home.logo} 
                                alt={match.teams.home.name} 
                                className="h-10 w-10 object-contain"
                              />
                              <span className="text-lg font-bold flex-1">{match.teams.home.name}</span>
                            </div>
                            
                            <div className="flex items-center justify-center">
                              <span className="text-2xl font-display text-muted-foreground">VS</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <img 
                                src={match.teams.away.logo} 
                                alt={match.teams.away.name} 
                                className="h-10 w-10 object-contain"
                              />
                              <span className="text-lg font-bold flex-1">{match.teams.away.name}</span>
                            </div>
                          </div>

                          {/* Onde Assistir */}
                          {match.broadcast && match.broadcast.length > 0 && (
                            <div className="pt-4 border-t border-border">
                              <div className="flex items-center gap-2 mb-2">
                                <Tv className="h-4 w-4 text-accent" />
                                <span className="text-sm font-medium text-muted-foreground">Onde Assistir:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {match.broadcast.map((channel, index) => (
                                  <Badge key={index} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                    {channel.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
