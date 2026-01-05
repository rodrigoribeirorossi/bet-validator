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
import { validateBTTS } from '@/lib/validador';
import { useAppStore } from '@/store';
import { BetValidationResult } from '@/types';

const schema = z.object({
  homeTeam: z.string().min(1, 'Nome do time obrigatório'),
  awayTeam: z.string().min(1, 'Nome do time obrigatório'),
  odds: z.number().min(1.01, 'Odds deve ser maior que 1.01'),
  homeScored: z.number().min(0),
  homeConceded: z.number().min(0),
  homeGames: z.number().min(1),
  awayScored: z.number().min(0),
  awayConceded: z.number().min(0),
  awayGames: z.number().min(1),
  historyYes: z.number().min(0),
  historyNo: z.number().min(0),
  bankroll: z.number().min(1, 'Banca deve ser maior que 0'),
});

type FormData = z.infer<typeof schema>;

export default function BTTSPage() {
  const [result, setResult] = useState<BetValidationResult | null>(null);
  const [selectedType, setSelectedType] = useState<'YES' | 'NO'>('YES');
  const bankroll = useAppStore((state) => state.bankroll);
  const addValidation = useAppStore((state) => state.addValidation);

  const {
    register,
    handleSubmit,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankroll: bankroll.currentBankroll,
    },
  });

  const onSubmit = (data: FormData) => {
    const validationResult = validateBTTS(
      {
        scored: data.homeScored,
        conceded: data.homeConceded,
        games: data.homeGames,
      },
      {
        scored: data.awayScored,
        conceded: data.awayConceded,
        games: data.awayGames,
      },
      {
        yes: data.historyYes,
        no: data.historyNo,
      },
      data.odds,
      data.bankroll,
      selectedType
    );

    setResult(validationResult);

    addValidation({
      date: new Date(),
      type: 'BTTS',
      match: `${data.homeTeam} vs ${data.awayTeam} - BTTS ${selectedType}`,
      result: validationResult,
      odds: data.odds,
      stake: validationResult.recommendedStake,
    });
  };

  const formValues = watch();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Ambas Marcam (BTTS)</h1>
        <p className="text-muted-foreground">
          Validar se ambos os times marcarão na partida
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
              {/* Teams */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeTeam">Time da Casa</Label>
                  <Input
                    id="homeTeam"
                    {...register('homeTeam')}
                    placeholder="Ex: Manchester City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="awayTeam">Time Visitante</Label>
                  <Input
                    id="awayTeam"
                    {...register('awayTeam')}
                    placeholder="Ex: Liverpool"
                  />
                </div>
              </div>

              {/* Bet Type */}
              <div className="space-y-2">
                <Label>Tipo de Aposta:</Label>
                <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as 'YES' | 'NO')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="YES">Sim (Ambos marcam)</TabsTrigger>
                    <TabsTrigger value="NO">Não (Pelo menos 1 não marca)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Odds */}
              <div className="space-y-2">
                <Label htmlFor="odds">Odds Oferecida</Label>
                <Input
                  id="odds"
                  type="number"
                  step="0.01"
                  {...register('odds', { valueAsNumber: true })}
                  placeholder="1.80"
                />
              </div>

              {/* Home Team Goals */}
              <div className="space-y-2">
                <Label>Estatísticas de Gols - Time Casa</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="homeScored" className="text-xs">Gols Marcados</Label>
                    <Input
                      id="homeScored"
                      type="number"
                      {...register('homeScored', { valueAsNumber: true })}
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="homeConceded" className="text-xs">Gols Sofridos</Label>
                    <Input
                      id="homeConceded"
                      type="number"
                      {...register('homeConceded', { valueAsNumber: true })}
                      placeholder="15"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="homeGames" className="text-xs">Jogos</Label>
                    <Input
                      id="homeGames"
                      type="number"
                      {...register('homeGames', { valueAsNumber: true })}
                      placeholder="20"
                    />
                  </div>
                </div>
              </div>

              {/* Away Team Goals */}
              <div className="space-y-2">
                <Label>Estatísticas de Gols - Time Visitante</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="awayScored" className="text-xs">Gols Marcados</Label>
                    <Input
                      id="awayScored"
                      type="number"
                      {...register('awayScored', { valueAsNumber: true })}
                      placeholder="22"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="awayConceded" className="text-xs">Gols Sofridos</Label>
                    <Input
                      id="awayConceded"
                      type="number"
                      {...register('awayConceded', { valueAsNumber: true })}
                      placeholder="18"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="awayGames" className="text-xs">Jogos</Label>
                    <Input
                      id="awayGames"
                      type="number"
                      {...register('awayGames', { valueAsNumber: true })}
                      placeholder="20"
                    />
                  </div>
                </div>
              </div>

              {/* Historical Data */}
              <div className="space-y-2">
                <Label>Histórico de BTTS</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="historyYes" className="text-xs">Jogos Sim (Ambos marcaram)</Label>
                    <Input
                      id="historyYes"
                      type="number"
                      {...register('historyYes', { valueAsNumber: true })}
                      placeholder="14"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="historyNo" className="text-xs">Jogos Não</Label>
                    <Input
                      id="historyNo"
                      type="number"
                      {...register('historyNo', { valueAsNumber: true })}
                      placeholder="6"
                    />
                  </div>
                </div>
              </div>

              {/* Bankroll */}
              <div className="space-y-2">
                <Label htmlFor="bankroll">Banca Atual (R$)</Label>
                <Input
                  id="bankroll"
                  type="number"
                  step="0.01"
                  {...register('bankroll', { valueAsNumber: true })}
                  placeholder="1000"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Validar Aposta
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          {result ? (
            <ResultadoAnalise 
              result={result} 
              odds={formValues.odds || 0} 
              stake={formValues.bankroll}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Resultado da Validação</CardTitle>
                <CardDescription>
                  Preencha o formulário e clique em validar para ver a análise
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                Aguardando dados...
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
