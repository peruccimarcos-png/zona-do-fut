import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OddsAlertDialogProps {
  homeTeam: string;
  awayTeam: string;
}

export function OddsAlertDialog({ homeTeam, awayTeam }: OddsAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [targetOdd, setTargetOdd] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("home");

  const handleSaveAlert = () => {
    if (!targetOdd || isNaN(parseFloat(targetOdd))) {
      toast.error("Por favor, insira um valor válido para a odd.");
      return;
    }

    // Aqui seria a integração com o backend para salvar o alerta
    // Como é um frontend estático, vamos simular o sucesso
    
    toast.success("Alerta criado com sucesso!", {
      description: `Você será notificado quando a odd de ${selectedTeam === 'home' ? homeTeam : selectedTeam === 'away' ? awayTeam : 'Empate'} atingir ${targetOdd}.`,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    });
    
    setOpen(false);
    setTargetOdd("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="h-4 w-4" />
          Criar Alerta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Configurar Alerta de Odds
          </DialogTitle>
          <DialogDescription>
            Receba uma notificação quando a cotação atingir o valor desejado.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right">
              Aposta
            </Label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o resultado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Vitória {homeTeam}</SelectItem>
                <SelectItem value="draw">Empate</SelectItem>
                <SelectItem value="away">Vitória {awayTeam}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="odd" className="text-right">
              Valor Alvo
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="odd"
                type="number"
                step="0.01"
                placeholder="Ex: 2.50"
                value={targetOdd}
                onChange={(e) => setTargetOdd(e.target.value)}
                className="pl-8"
              />
              <span className="absolute left-3 top-2.5 text-muted-foreground font-bold text-sm">@</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveAlert} className="w-full sm:w-auto">
            Salvar Alerta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
