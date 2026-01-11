import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface BettingCalculatorProps {
  defaultOdd?: number;
}

export function BettingCalculator({ defaultOdd = 2.00 }: BettingCalculatorProps) {
  const [stake, setStake] = useState<string>("50");
  const [odd, setOdd] = useState<string>(defaultOdd.toString());
  const [returnVal, setReturnVal] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);

  useEffect(() => {
    const stakeVal = parseFloat(stake) || 0;
    const oddVal = parseFloat(odd) || 0;
    
    const totalReturn = stakeVal * oddVal;
    const totalProfit = totalReturn - stakeVal;

    setReturnVal(totalReturn);
    setProfit(totalProfit);
  }, [stake, odd]);

  // Atualiza a odd se a prop mudar
  useEffect(() => {
    setOdd(defaultOdd.toString());
  }, [defaultOdd]);

  return (
    <Card className="bg-muted/30 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          Calculadora de Lucros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stake" className="text-xs text-muted-foreground">Valor da Aposta (R$)</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="stake" 
                type="number" 
                value={stake} 
                onChange={(e) => setStake(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="odd" className="text-xs text-muted-foreground">Odd (Cotação)</Label>
            <Input 
              id="odd" 
              type="number" 
              step="0.01" 
              value={odd} 
              onChange={(e) => setOdd(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-background p-3 rounded border border-border">
            <span className="text-xs text-muted-foreground block mb-1">Retorno Total</span>
            <span className="text-lg font-bold text-foreground">R$ {returnVal.toFixed(2)}</span>
          </div>
          <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
            <span className="text-xs text-green-600 dark:text-green-400 block mb-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Lucro Líquido
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">R$ {profit.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
