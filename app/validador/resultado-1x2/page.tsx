'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResultadoAnalise } from '@/components/validador/resultado-analise';
import { validate1X2 } from '@/lib/validador';
import { useAppStore } from '@/store';
import { BetValidationResult } from '@/types';

const schema = z.object({
  homeTeam: z.string().min(1, 'Nome do time obrigatório'),
  awayTeam: z.string().min(1, 'Nome do time obrigatório'),
  odds: z.number().min(1.01, 'Odds deve ser maior que 1.01'),
  homeWins: z.number().min(0),
  homeDraws: z.number().min(0),
  homeLosses: z.number().min(0),
  awayWins: z.number().min(0),
  awayDraws: z.number().min(0),
  awayLosses: z.number().min(0),
  bankroll: z.number().min(1, 'Banca deve ser maior que 0'),
});

type FormData = z.infer<typeof schema>;

export default function Resultado1X2Page() {
  const [result, setResult] = useState<BetValidationResult | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<'1' | 'X' | '2'>('1');
  const { bankroll } = useAppStore((state) => state.bankroll);
  const addValidation = useAppStore((state) => state.addValidation);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankroll: bankroll.currentBankroll,
    },
  });

  const onSubmit = (data: FormData) => {
    const validationResult = validate1X2(
      {
        wins: data.homeWins,
        draws: data.homeDraws,
        losses: data.homeLosses,
      },
      {
        wins: data.awayWins,
        draws: data.awayDraws,
        losses: data.awayLosses,
      },
      data.odds,
      data.bankroll,
      selectedOutcome
    );

    setResult(validationResult);

    // Add to history
    addValidation({
      date: new Date(),
      type: 'RESULTADO_1X2',
      match: `${data.homeTeam} vs ${data.awayTeam}`,
      result: validationResult,
      odds: data.odds,
      stake: validationResult.recommendedStake,
    });
  };

  const formValues = watch();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Resultado 1X2 (Moneyline)</h1>
        <p className="text-muted-foreground">
          Validar apostas de resultado final (vitória casa, empate, vitória fora)
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
                  {errors.homeTeam && (
                    <p className="text-sm text-red-500">{errors.homeTeam.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="awayTeam">Time Visitante</Label>
                  <Input
                    id="awayTeam"
                    {...register('awayTeam')}
                    placeholder="Ex: Liverpool"
                  />
                  {errors.awayTeam && (
                    <p className="text-sm text-red-500">{errors.awayTeam.message}</p>
                  )}
                </div>
              </div>

              {/* Outcome Selection */}
              <div className="space-y-2">
                <Label>Apostar em:</Label>
                <Tabs value={selectedOutcome} onValueChange={(v) => setSelectedOutcome(v as '1' | 'X' | '2')}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="1">Vitória Casa (1)</TabsTrigger>
                    <TabsTrigger value="X">Empate (X)</TabsTrigger>
                    <TabsTrigger value="2">Vitória Fora (2)</TabsTrigger>
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
                  placeholder="Ex: 2.50"
                />
                {errors.odds && (
                  <p className="text-sm text-red-500">{errors.odds.message}</p>
                )}
              </div>

              {/* Home Team Stats */}
              <div className="space-y-2">
                <Label>Estatísticas Time Casa (jogando em casa)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="homeWins" className="text-xs">Vitórias</Label>
                    <Input
                      id="homeWins"
                      type="number"
                      {...register('homeWins', { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="homeDraws" className="text-xs">Empates</Label>
                    <Input
                      id="homeDraws"
                      type="number"
                      {...register('homeDraws', { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="homeLosses" className="text-xs">Derrotas</Label>
                    <Input
                      id="homeLosses"
                      type="number"
                      {...register('homeLosses', { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Away Team Stats */}
              <div className="space-y-2">
                <Label>Estatísticas Time Visitante (jogando fora)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="awayWins" className="text-xs">Vitórias</Label>
                    <Input
                      id="awayWins"
                      type="number"
                      {...register('awayWins', { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="awayDraws" className="text-xs">Empates</Label>
                    <Input
                      id="awayDraws"
                      type="number"
                      {...register('awayDraws', { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="awayLosses" className="text-xs">Derrotas</Label>
                    <Input
                      id="awayLosses"
                      type="number"
                      {...register('awayLosses', { valueAsNumber: true })}
                      placeholder="0"
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
                {errors.bankroll && (
                  <p className="text-sm text-red-500">{errors.bankroll.message}</p>
                )}
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
