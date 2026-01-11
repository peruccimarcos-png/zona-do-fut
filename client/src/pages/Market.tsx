import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Filter, Search } from "lucide-react";

export default function Market() {
  const transfers = [
    { id: 1, player: "Kylian Mbappé", from: "PSG", to: "Real Madrid", type: "Transferência", value: "Livre", status: "Confirmado", date: "Hoje" },
    { id: 2, player: "Neymar Jr", from: "Al Hilal", to: "Santos", type: "Empréstimo", value: "-", status: "Rumor", date: "Ontem" },
    { id: 3, player: "Gustavo Scarpa", from: "Nott. Forest", to: "Atlético-MG", type: "Transferência", value: "€5M", status: "Fechado", date: "02 Dez" },
    { id: 4, player: "De La Cruz", from: "River Plate", to: "Flamengo", type: "Transferência", value: "€16M", status: "Fechado", date: "01 Dez" },
    { id: 5, player: "Lucas Paquetá", from: "West Ham", to: "Man. City", type: "Transferência", value: "€80M", status: "Travado", date: "30 Nov" },
    { id: 6, player: "Endrick", from: "Palmeiras", to: "Real Madrid", type: "Ida Definitiva", value: "-", status: "Confirmado", date: "Jul 2024" },
  ];

  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border py-12">
        <div className="container text-center">
          <Badge className="bg-accent text-accent-foreground mb-4">Atualizado em Tempo Real</Badge>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-primary mb-4">MERCADO DA BOLA</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Acompanhe todas as transferências, rumores e negociações do futebol brasileiro e internacional.
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar jogador, time..." className="pl-9" />
            </div>
            <div className="flex gap-4 w-full md:w-auto flex-1">
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="rumor">Rumores</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Liga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="br">Brasileirão</SelectItem>
                  <SelectItem value="eu">Europa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Transferências */}
        <div className="grid gap-4">
          {transfers.map((item) => (
            <Card key={item.id} className="hover:border-accent transition-colors group">
              <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center gap-4 w-full md:w-1/3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                    {item.player.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">{item.player}</h3>
                    <span className="text-xs text-muted-foreground">{item.type} • {item.date}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 w-full md:w-1/3">
                  <div className="text-right">
                    <p className="font-bold">{item.from}</p>
                  </div>
                  <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-bold">{item.to}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-1/3">
                  <span className="font-mono font-bold text-muted-foreground">{item.value}</span>
                  <Badge 
                    variant={item.status === "Confirmado" || item.status === "Fechado" ? "default" : item.status === "Rumor" ? "secondary" : "outline"}
                    className={item.status === "Confirmado" || item.status === "Fechado" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {item.status}
                  </Badge>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
