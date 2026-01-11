import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Heart, Star, Trophy, X, LogIn } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth();
  
  const { data: favoriteTeams = [], refetch: refetchTeams } = trpc.favorites.teams.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  const { data: favoritePlayers = [], refetch: refetchPlayers } = trpc.favorites.players.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  const removeTeamMutation = trpc.favorites.teams.remove.useMutation({
    onSuccess: () => {
      toast.success("Time removido dos favoritos!");
      refetchTeams();
    },
    onError: () => {
      toast.error("Erro ao remover time dos favoritos.");
    }
  });
  
  const removePlayerMutation = trpc.favorites.players.remove.useMutation({
    onSuccess: () => {
      toast.success("Jogador removido dos favoritos!");
      refetchPlayers();
    },
    onError: () => {
      toast.error("Erro ao remover jogador dos favoritos.");
    }
  });

  if (loading) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-muted/50 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <LogIn className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="font-display font-bold text-3xl">Faça Login</h1>
            <p className="text-muted-foreground">
              Para salvar seus times e jogadores favoritos, você precisa estar logado.
            </p>
            <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
              Entrar Agora
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Cabeçalho do Perfil */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-primary to-accent rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl">Meu Perfil</h1>
              <p className="text-muted-foreground">{user?.email || "Usuário"}</p>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Times Favoritos */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-primary" />
            <h2 className="font-display font-bold text-2xl">Meus Times</h2>
            <Badge variant="secondary" className="ml-2">{favoriteTeams.length}</Badge>
          </div>

          {favoriteTeams.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  Você ainda não favoritou nenhum time.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Navegue pelas notícias e adicione seus times favoritos!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteTeams.map((team) => (
                <Card key={team.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {team.teamLogo && (
                          <img 
                            src={team.teamLogo} 
                            alt={team.teamName} 
                            className="w-10 h-10 object-contain"
                          />
                        )}
                        <CardTitle className="text-lg">{team.teamName}</CardTitle>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeTeamMutation.mutate({ teamId: team.teamId })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Separator className="mb-8" />

        {/* Jogadores Favoritos */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Star className="text-accent fill-accent" />
            <h2 className="font-display font-bold text-2xl">Meus Jogadores</h2>
            <Badge variant="secondary" className="ml-2">{favoritePlayers.length}</Badge>
          </div>

          {favoritePlayers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  Você ainda não favoritou nenhum jogador.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Acompanhe as estatísticas e adicione seus craques favoritos!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {favoritePlayers.map((player) => (
                <Card key={player.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col items-center text-center gap-3">
                      {player.playerPhoto && (
                        <img 
                          src={player.playerPhoto} 
                          alt={player.playerName} 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-base">{player.playerName}</CardTitle>
                        {player.teamName && (
                          <p className="text-xs text-muted-foreground mt-1">{player.teamName}</p>
                        )}
                        {player.position && (
                          <Badge variant="outline" className="mt-2 text-[10px]">
                            {player.position}
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePlayerMutation.mutate({ playerId: player.playerId })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
