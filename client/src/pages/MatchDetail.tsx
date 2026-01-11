import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { footballApi, Match, HeadToHead, Odd } from "@/services/footballApi";
import { Calendar, Clock, Loader2, MapPin, Shield, Shirt, User, History, DollarSign, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRoute } from "wouter";
import { OddsAlertDialog } from "@/components/OddsAlertDialog";
import { BettingCalculator } from "@/components/BettingCalculator";

export default function MatchDetail() {
  const [matchRoute, params] = useRoute("/jogo/:id");
  const matchId = params?.id ? parseInt(params.id) : 0;
  
  const [matchData, setMatchData] = useState<Match | null>(null);
  const [h2hData, setH2hData] = useState<HeadToHead[]>([]);
  const [oddsData, setOddsData] = useState<Odd | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      if (!matchId) return;
      try {
        const data = await footballApi.getMatchById(matchId);
        setMatchData(data);
        
        // Buscar H2H se tivermos os IDs dos times
        if (data.teams.home.id && data.teams.away.id) {
          const h2h = await footballApi.getHeadToHead(data.teams.home.id, data.teams.away.id);
          setH2hData(h2h);
        }

        // Buscar Odds
        const odds = await footballApi.getOdds(matchId);
        setOddsData(odds);

      } catch (error) {
        console.error("Failed to fetch match details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!matchData) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h2 className="text-2xl font-bold">Partida não encontrada</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Placar Header */}
      <div className="bg-primary text-primary-foreground py-8 md:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container relative z-10">
          
          {/* Info da Liga */}
          <div className="flex justify-center items-center gap-2 mb-6 opacity-90">
            <img src={matchData.league.logo} alt={matchData.league.name} className="h-6 w-6 object-contain bg-white rounded-full p-0.5" />
            <span className="text-sm font-bold uppercase tracking-wider">{matchData.league.name} {matchData.league.round ? `• ${matchData.league.round}` : ''}</span>
          </div>

          {/* Placar */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            
            {/* Time Casa */}
            <div className="flex flex-col items-center gap-4 text-center w-1/3">
              <img src={matchData.teams.home.logo} alt={matchData.teams.home.name} className="h-20 w-20 md:h-32 md:w-32 object-contain drop-shadow-lg" />
              <h2 className="font-display font-bold text-xl md:text-3xl">{matchData.teams.home.name}</h2>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-2">
              <div className="bg-background/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/10">
                <span className="font-display font-bold text-4xl md:text-6xl tracking-widest">
                  {matchData.goals.home ?? 0} - {matchData.goals.away ?? 0}
                </span>
              </div>
              <Badge variant={matchData.fixture.status.short === 'FT' ? 'secondary' : 'destructive'} className="animate-pulse">
                {matchData.fixture.status.short === 'FT' ? 'FIM DE JOGO' : matchData.fixture.status.short === 'NS' ? 'NÃO INICIADO' : `${matchData.fixture.status.elapsed}' AO VIVO`}
              </Badge>
            </div>

            {/* Time Fora */}
            <div className="flex flex-col items-center gap-4 text-center w-1/3">
              <img src={matchData.teams.away.logo} alt={matchData.teams.away.name} className="h-20 w-20 md:h-32 md:w-32 object-contain drop-shadow-lg" />
              <h2 className="font-display font-bold text-xl md:text-3xl">{matchData.teams.away.name}</h2>
            </div>

          </div>

          {/* Info Extra */}
          <div className="flex justify-center gap-6 mt-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(matchData.fixture.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{new Date(matchData.fixture.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            {matchData.fixture.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{matchData.fixture.venue.name}, {matchData.fixture.venue.city}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Conteúdo das Abas */}
      <div className="container py-8">
        <Tabs defaultValue="summary" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="summary">Resumo</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="lineups">Escalações</TabsTrigger>
            <TabsTrigger value="h2h">Confrontos</TabsTrigger>
            <TabsTrigger value="odds">Apostas</TabsTrigger>
          </TabsList>

          {/* Aba Resumo (Eventos) */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Linha do Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-muted ml-4 md:ml-1/2 space-y-8 py-4">
                  {matchData.events?.map((event, index) => (
                    <div key={index} className={`flex items-center gap-4 ${event.team.name === matchData.teams.home.name ? 'md:flex-row-reverse md:text-right' : ''}`}>
                      
                      {/* Bolinha do Tempo */}
                      <div className="absolute left-[-9px] md:left-1/2 md:ml-[-9px] w-4 h-4 rounded-full bg-accent border-2 border-background z-10"></div>
                      
                      {/* Conteúdo do Evento */}
                      <div className={`flex-1 pl-6 md:pl-0 ${event.team.name === matchData.teams.home.name ? 'md:pr-8' : 'md:pl-8'}`}>
                        <div className="flex items-center gap-2 mb-1 justify-start md:justify-inherit">
                          <span className="font-mono font-bold text-accent text-lg">{event.time.elapsed}'</span>
                          <Badge variant="outline" className="text-[10px] uppercase">{event.type}</Badge>
                        </div>
                        <p className="font-bold text-sm">{event.player.name}</p>
                        <p className="text-xs text-muted-foreground">{event.detail} {event.assist.name && `(Ass: ${event.assist.name})`}</p>
                      </div>

                    </div>
                  ))}
                  {(!matchData.events || matchData.events.length === 0) && (
                    <div className="pl-8 text-muted-foreground">Nenhum evento registrado ainda.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Estatísticas */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Estatísticas do Jogo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {matchData.statistics?.[0]?.statistics.map((stat, index) => {
                  const homeValue = stat.value;
                  const awayValue = matchData.statistics?.[1]?.statistics[index]?.value;
                  
                  // Normalizar valores para barra de progresso
                  let homeInt = typeof homeValue === 'string' ? parseInt(homeValue) : (homeValue as number) || 0;
                  let awayInt = typeof awayValue === 'string' ? parseInt(awayValue) : (awayValue as number) || 0;
                  const total = homeInt + awayInt;
                  const homePercent = total === 0 ? 50 : (homeInt / total) * 100;

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>{homeValue ?? 0}</span>
                        <span className="text-muted-foreground font-normal uppercase text-xs tracking-wider">{stat.type}</span>
                        <span>{awayValue ?? 0}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                        <div className="bg-primary h-full transition-all duration-500" style={{ width: `${homePercent}%` }}></div>
                        <div className="bg-accent h-full transition-all duration-500" style={{ width: `${100 - homePercent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
                {(!matchData.statistics || matchData.statistics.length === 0) && (
                  <div className="text-center text-muted-foreground py-8">Estatísticas não disponíveis.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Escalações */}
          <TabsContent value="lineups">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchData.lineups?.map((lineup, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2 border-b border-border">
                    <div className="flex items-center gap-3">
                      <img src={lineup.team.logo} alt={lineup.team.name} className="h-8 w-8 object-contain" />
                      <div>
                        <CardTitle className="text-base">{lineup.team.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">Téc: {lineup.coach.name} • {lineup.formation}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                      {lineup.startXI.map((item) => (
                        <div key={item.player.id} className="flex items-center gap-3 p-3 hover:bg-muted/30">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                            {item.player.number}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.player.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{item.player.pos}</p>
                          </div>
                          <Shirt className="h-4 w-4 text-muted-foreground/30" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!matchData.lineups || matchData.lineups.length === 0) && (
                <div className="col-span-2 text-center text-muted-foreground py-8">Escalações não disponíveis.</div>
              )}
            </div>
          </TabsContent>

          {/* Aba Confrontos (H2H) */}
          <TabsContent value="h2h">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Últimos Confrontos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {h2hData.map((match) => (
                    <div key={match.fixture.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase">{match.league.name}</span>
                        <span className="text-xs text-muted-foreground">{new Date(match.fixture.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className={`flex items-center gap-3 flex-1 justify-end ${match.teams.home.winner ? 'font-bold text-primary' : ''}`}>
                          <span className="text-sm md:text-base">{match.teams.home.name}</span>
                          <img src={match.teams.home.logo} alt={match.teams.home.name} className="h-6 w-6 md:h-8 md:w-8 object-contain" />
                        </div>
                        
                        <div className="bg-muted px-3 py-1 rounded font-mono font-bold text-sm md:text-lg min-w-[60px] text-center">
                          {match.goals.home} - {match.goals.away}
                        </div>
                        
                        <div className={`flex items-center gap-3 flex-1 justify-start ${match.teams.away.winner ? 'font-bold text-primary' : ''}`}>
                          <img src={match.teams.away.logo} alt={match.teams.away.name} className="h-6 w-6 md:h-8 md:w-8 object-contain" />
                          <span className="text-sm md:text-base">{match.teams.away.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {h2hData.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">Nenhum histórico de confrontos encontrado.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Apostas (Odds) */}
          <TabsContent value="odds">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Cotações para Apostar
                </CardTitle>
                {matchData && (
                  <OddsAlertDialog 
                    homeTeam={matchData.teams.home.name} 
                    awayTeam={matchData.teams.away.name} 
                  />
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {oddsData?.bookmakers.map((bookmaker) => (
                  <div key={bookmaker.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{bookmaker.name}</h3>
                      <Badge variant="outline" className="text-xs">Melhores Odds</Badge>
                    </div>
                    
                    {bookmaker.bets.map((bet) => (
                      <div key={bet.id} className="bg-muted/30 p-4 rounded-lg border border-border/50">
                        <p className="text-sm font-medium mb-3 text-muted-foreground">{bet.name}</p>
                        <div className="grid grid-cols-3 gap-4">
                          {bet.values.map((odd, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1 bg-card p-3 rounded border border-border hover:border-primary/50 transition-colors cursor-pointer group">
                              <span className="text-xs text-muted-foreground font-medium">
                                {odd.value === 'Home' ? matchData?.teams.home.name : odd.value === 'Away' ? matchData?.teams.away.name : 'Empate'}
                              </span>
                              <span className="text-xl font-bold text-primary group-hover:scale-110 transition-transform">{odd.odd}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <Button className="w-full gap-2 font-bold" size="lg">
                      Apostar na {bookmaker.name} <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {(!oddsData || oddsData.bookmakers.length === 0) && (
                  <div className="text-center text-muted-foreground py-8">Cotações não disponíveis no momento.</div>
                )}

                <div className="mt-8">
                  <BettingCalculator defaultOdd={2.10} />
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded text-xs text-yellow-600 dark:text-yellow-400 text-center">
                  As odds podem mudar a qualquer momento. Aposte com responsabilidade. Proibido para menores de 18 anos.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </Layout>
  );
}
