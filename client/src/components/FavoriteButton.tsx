import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type FavoriteButtonProps = {
  type: "team" | "player";
  id: number;
  name: string;
  logo?: string;
  photo?: string;
  teamName?: string;
  position?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export default function FavoriteButton({
  type,
  id,
  name,
  logo,
  photo,
  teamName,
  position,
  variant = "ghost",
  size = "icon",
  className = "",
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();

  // Queries para verificar se já é favorito
  const { data: isTeamFavorite = false, refetch: refetchTeam } = trpc.favorites.teams.isFavorite.useQuery(
    { teamId: id },
    { enabled: isAuthenticated && type === "team" }
  );

  const { data: isPlayerFavorite = false, refetch: refetchPlayer } = trpc.favorites.players.isFavorite.useQuery(
    { playerId: id },
    { enabled: isAuthenticated && type === "player" }
  );

  const isFavorite = type === "team" ? isTeamFavorite : isPlayerFavorite;

  // Mutations para adicionar/remover
  const addTeamMutation = trpc.favorites.teams.add.useMutation({
    onSuccess: () => {
      toast.success(`${name} adicionado aos favoritos!`);
      refetchTeam();
    },
    onError: () => toast.error("Erro ao adicionar aos favoritos."),
  });

  const removeTeamMutation = trpc.favorites.teams.remove.useMutation({
    onSuccess: () => {
      toast.success(`${name} removido dos favoritos!`);
      refetchTeam();
    },
    onError: () => toast.error("Erro ao remover dos favoritos."),
  });

  const addPlayerMutation = trpc.favorites.players.add.useMutation({
    onSuccess: () => {
      toast.success(`${name} adicionado aos favoritos!`);
      refetchPlayer();
    },
    onError: () => toast.error("Erro ao adicionar aos favoritos."),
  });

  const removePlayerMutation = trpc.favorites.players.remove.useMutation({
    onSuccess: () => {
      toast.success(`${name} removido dos favoritos!`);
      refetchPlayer();
    },
    onError: () => toast.error("Erro ao remover dos favoritos."),
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error("Faça login para salvar favoritos!");
      setTimeout(() => {
        window.location.href = getLoginUrl();
      }, 1500);
      return;
    }

    if (type === "team") {
      if (isFavorite) {
        removeTeamMutation.mutate({ teamId: id });
      } else {
        addTeamMutation.mutate({ teamId: id, teamName: name, teamLogo: logo });
      }
    } else {
      if (isFavorite) {
        removePlayerMutation.mutate({ playerId: id });
      } else {
        addPlayerMutation.mutate({
          playerId: id,
          playerName: name,
          playerPhoto: photo,
          teamName,
          position,
        });
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={
        addTeamMutation.isPending ||
        removeTeamMutation.isPending ||
        addPlayerMutation.isPending ||
        removePlayerMutation.isPending
      }
    >
      <Heart
        className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
      />
    </Button>
  );
}
