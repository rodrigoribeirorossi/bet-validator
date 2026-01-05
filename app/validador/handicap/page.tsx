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
import { validateAsianHandicap } from '@/lib/validador';
import { useAppStore } from '@/store';
import { BetValidationResult } from '@/types';

const schema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  handicap: z.number(),
  odds: z.number().min(1.01),
  homeWins: z.number().min(0),
  homeDraws: z.number().min(0),
  homeLosses: z.number().min(0),
  awayWins: z.number().min(0),
  awayDraws: z.number().min(0),
  awayLosses: z.number().min(0),
  bankroll: z.number().min(1),
});

type FormData = z.infer<typeof schema>;

export default function HandicapPage() {
  const [result, setResult] = useState<BetValidationResult | null>(null);
  const [betOn, setBetOn] = useState<'HOME' | 'AWAY'>('HOME');
  const bankroll = useAppStore((state) => state.bankroll);
  const addValidation = useAppStore((state) => state.addValidation);

  const { register, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { bankroll: bankroll.currentBankroll, handicap: -0.5 },
  });

  const onSubmit = (data: FormData) => {
    const validationResult = validateAsianHandicap(
      { wins: data.homeWins, draws: data.homeDraws, losses: data.homeLosses },
      { wins: data.awayWins, draws: data.awayDraws, losses: data.awayLosses },
      data.handicap,
      data.odds,
      data.bankroll,
      betOn
    );

    setResult(validationResult);
    addValidation({
      date: new Date(),
      type: 'HANDICAP',
      match: `${data.homeTeam} vs ${data.awayTeam} - ${betOn} (${data.handicap})`,
      result: validationResult,
      odds: data.odds,
      stake: validationResult.recommendedStake,
    });
  };

  const formValues = watch();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Handicap Asiático</h1>
        <p className="text-muted-foreground">
          Validar apostas com vantagem/desvantagem de gols
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Partida</CardTitle>
            <CardDescription>Insira as informações e estatísticas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeTeam">Time da Casa</Label>
                  <Input id="homeTeam" {...register('homeTeam')} placeholder="Ex: Manchester City" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awayTeam">Time Visitante</Label>
                  <Input id="awayTeam" {...register('awayTeam')} placeholder="Ex: Liverpool" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Apostar em:</Label>
                <Tabs value={betOn} onValueChange={(v) => setBetOn(v as 'HOME' | 'AWAY')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="HOME">Casa</TabsTrigger>
                    <TabsTrigger value="AWAY">Fora</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="handicap">Handicap (ex: -0.5, +1.5)</Label>
                  <Input id="handicap" type="number" step="0.25" {...register('handicap', { valueAsNumber: true })} placeholder="-0.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odds">Odds</Label>
                  <Input id="odds" type="number" step="0.01" {...register('odds', { valueAsNumber: true })} placeholder="1.85" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estatísticas Casa (V/E/D)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input type="number" {...register('homeWins', { valueAsNumber: true })} placeholder="V" />
                  <Input type="number" {...register('homeDraws', { valueAsNumber: true })} placeholder="E" />
                  <Input type="number" {...register('homeLosses', { valueAsNumber: true })} placeholder="D" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estatísticas Fora (V/E/D)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input type="number" {...register('awayWins', { valueAsNumber: true })} placeholder="V" />
                  <Input type="number" {...register('awayDraws', { valueAsNumber: true })} placeholder="E" />
                  <Input type="number" {...register('awayLosses', { valueAsNumber: true })} placeholder="D" />
                </div>
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
