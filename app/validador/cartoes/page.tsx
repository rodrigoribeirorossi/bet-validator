'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResultadoAnalise } from '@/components/validador/resultado-analise';
import { validateCards } from '@/lib/validador';
import { useAppStore } from '@/store';
import { BetValidationResult } from '@/types';

const schema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  line: z.number().min(0.5),
  odds: z.number().min(1.01),
  homeAverage: z.number().min(0),
  homeGames: z.number().min(1),
  awayAverage: z.number().min(0),
  awayGames: z.number().min(1),
  refereeAverage: z.number().optional(),
  bankroll: z.number().min(1),
});

type FormData = z.infer<typeof schema>;

export default function CartoesPage() {
  const [result, setResult] = useState<BetValidationResult | null>(null);
  const [betType, setBetType] = useState<'OVER' | 'UNDER'>('OVER');
  const bankroll = useAppStore((state) => state.bankroll);
  const addValidation = useAppStore((state) => state.addValidation);

  const { register, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { bankroll: bankroll.currentBankroll, line: 4.5 },
  });

  const onSubmit = (data: FormData) => {
    const refereeStats = data.refereeAverage ? { totalCardsAverage: data.refereeAverage } : undefined;
    
    const validationResult = validateCards(
      { average: data.homeAverage, games: data.homeGames },
      { average: data.awayAverage, games: data.awayGames },
      refereeStats,
      data.line,
      data.odds,
      data.bankroll,
      betType
    );

    setResult(validationResult);
    addValidation({
      date: new Date(),
      type: 'CARTOES',
      match: `${data.homeTeam} vs ${data.awayTeam} - ${betType} ${data.line}`,
      result: validationResult,
      odds: data.odds,
      stake: validationResult.recommendedStake,
    });
  };

  const formValues = watch();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cartões</h1>
        <p className="text-muted-foreground">
          Validar Over/Under em cartões (incluindo dados do árbitro)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Partida</CardTitle>
            <CardDescription>Insira as estatísticas de cartões</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeTeam">Time Casa</Label>
                  <Input id="homeTeam" {...register('homeTeam')} placeholder="Time A" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awayTeam">Time Fora</Label>
                  <Input id="awayTeam" {...register('awayTeam')} placeholder="Time B" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo:</Label>
                  <Tabs value={betType} onValueChange={(v) => setBetType(v as 'OVER' | 'UNDER')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="OVER">Over</TabsTrigger>
                      <TabsTrigger value="UNDER">Under</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line">Linha</Label>
                  <Input id="line" type="number" step="0.5" {...register('line', { valueAsNumber: true })} placeholder="4.5" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="odds">Odds</Label>
                <Input id="odds" type="number" step="0.01" {...register('odds', { valueAsNumber: true })} placeholder="1.85" />
              </div>

              <div className="space-y-2">
                <Label>Cartões Time Casa (Média/Jogos)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" step="0.01" {...register('homeAverage', { valueAsNumber: true })} placeholder="2.5" />
                  <Input type="number" {...register('homeGames', { valueAsNumber: true })} placeholder="20" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cartões Time Fora (Média/Jogos)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" step="0.01" {...register('awayAverage', { valueAsNumber: true })} placeholder="2.3" />
                  <Input type="number" {...register('awayGames', { valueAsNumber: true })} placeholder="20" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refereeAverage">Média de Cartões do Árbitro (opcional)</Label>
                <Input 
                  id="refereeAverage" 
                  type="number" 
                  step="0.01" 
                  {...register('refereeAverage', { valueAsNumber: true })} 
                  placeholder="5.2" 
                />
                <p className="text-xs text-muted-foreground">
                  Dados do árbitro melhoram a precisão da análise
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankroll">Banca (R$)</Label>
                <Input id="bankroll" type="number" step="0.01" {...register('bankroll', { valueAsNumber: true })} />
              </div>

              <Button type="submit" className="w-full" size="lg">Validar Aposta</Button>
            </form>
          </CardContent>
        </Card>

        <div>
          {result ? (
            <ResultadoAnalise result={result} odds={formValues.odds || 0} stake={formValues.bankroll} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Resultado da Validação</CardTitle>
                <CardDescription>Aguardando dados...</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                Preencha o formulário
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
