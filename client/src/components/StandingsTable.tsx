import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { footballApi, Standing } from "@/services/footballApi";
import { Loader2, Trophy } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { useEffect, useState } from "react";

export default function StandingsTable() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const data = await footballApi.getStandings();
        setStandings(data);
      } catch (error) {
        console.error("Failed to fetch standings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Tabela Brasileirão
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-center">P</TableHead>
                <TableHead className="text-center hidden sm:table-cell">J</TableHead>
                <TableHead className="text-center hidden sm:table-cell">V</TableHead>
                <TableHead className="text-center hidden sm:table-cell">SG</TableHead>
                <TableHead className="text-center hidden md:table-cell">Últimos 5</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((team) => (
                <TableRow key={team.rank} className="hover:bg-muted/50">
                  <TableCell className="font-bold text-center text-muted-foreground">
                    {team.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 group">
                      <img src={team.team.logo} alt={team.team.name} className="h-6 w-6 object-contain" />
                      <span className="font-bold text-sm">{team.team.name}</span>
                      <FavoriteButton 
                        type="team" 
                        id={team.team.id} 
                        name={team.team.name} 
                        logo={team.team.logo}
                        size="icon"
                        variant="ghost"
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-center text-primary">{team.points}</TableCell>
                  <TableCell className="text-center text-muted-foreground hidden sm:table-cell">{team.all.played}</TableCell>
                  <TableCell className="text-center text-muted-foreground hidden sm:table-cell">{team.all.win}</TableCell>
                  <TableCell className="text-center text-muted-foreground hidden sm:table-cell">{team.goalsDiff}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex justify-center gap-1">
                      {team.form.split('').map((result, i) => (
                        <span 
                          key={i} 
                          className={`
                            w-2 h-2 rounded-full 
                            ${result === 'W' ? 'bg-green-500' : result === 'D' ? 'bg-gray-400' : 'bg-red-500'}
                          `}
                          title={result === 'W' ? 'Vitória' : result === 'D' ? 'Empate' : 'Derrota'}
                        />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
