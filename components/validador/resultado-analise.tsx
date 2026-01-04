'use client';

import { BetValidationResult } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Flame, XCircle } from 'lucide-react';

interface ResultadoAnaliseProps {
  result: BetValidationResult;
  odds: number;
  stake?: number;
}

export function ResultadoAnalise({ result, odds, stake }: ResultadoAnaliseProps) {
  const getRecommendationIcon = () => {
    switch (result.recommendation) {
      case 'APOSTAR_FORTE':
        return <Flame className="h-6 w-6 text-orange-500" />;
      case 'APOSTAR':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'CAUTELA':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'EVITAR':
        return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getRecommendationText = () => {
    switch (result.recommendation) {
      case 'APOSTAR_FORTE':
        return '🔥 APOSTAR FORTE';
      case 'APOSTAR':
        return '✅ APOSTAR';
      case 'CAUTELA':
        return '⚠️ CAUTELA';
      case 'EVITAR':
        return '❌ EVITAR';
    }
  };

  const getRecommendationColor = () => {
    switch (result.recommendation) {
      case 'APOSTAR_FORTE':
        return 'bg-orange-500';
      case 'APOSTAR':
        return 'bg-green-500';
      case 'CAUTELA':
        return 'bg-yellow-500';
      case 'EVITAR':
        return 'bg-red-500';
    }
  };

  const getValueColor = () => {
    if (result.valueBet >= 0.15) return 'text-green-600 dark:text-green-400';
    if (result.valueBet >= 0.05) return 'text-green-500 dark:text-green-500';
    if (result.valueBet > 0) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  const valuePercentage = Math.max(0, Math.min(100, (result.valueBet + 0.2) * 250));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Recommendation Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getRecommendationIcon()}
              <div>
                <CardTitle className="text-2xl">{getRecommendationText()}</CardTitle>
                <CardDescription>
                  Nível de confiança: <span className="font-semibold">{result.confidenceLevel}</span>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Value Gauge */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Value Bet</span>
              <span className={`text-sm font-bold ${getValueColor()}`}>
                {formatPercentage(result.valueBet)}
              </span>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${valuePercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${getRecommendationColor()}`}
              />
            </div>
          </div>

          {/* Stake Recommendation */}
          {result.recommendedStake > 0 && (
            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">Stake Recomendado (Quarter Kelly)</h4>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{formatCurrency(result.recommendedStake)}</span>
                <span className="text-sm text-muted-foreground">
                  {formatPercentage(result.recommendedStake / (stake || 1000))} da banca
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Probabilidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Implícita (Odds)</span>
              <span className="font-semibold">{formatPercentage(result.impliedProbability)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Calculada</span>
              <span className="font-semibold">{formatPercentage(result.calculatedProbability)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Edge</span>
              <span className={`font-semibold ${result.edge > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(result.edge)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Análise Financeira</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Odds Oferecida</span>
              <span className="font-semibold">{odds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Odds Justa</span>
              <span className="font-semibold">{result.fairOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">ROI Esperado</span>
              <span className={`font-semibold ${result.expectedROI > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(result.expectedROI)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Expected Value (EV)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.expectedValue > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm text-muted-foreground">Valor Esperado por Aposta</span>
              </div>
              <span className={`text-xl font-bold ${result.expectedValue > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(result.expectedValue)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Dicas Contextuais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {result.confidenceLevel === 'BAIXA' && (
            <p>⚠️ Amostra pequena de dados. Considere coletar mais informações antes de apostar.</p>
          )}
          {result.valueBet > 0 && result.edge > 0 && (
            <p>✅ Esta aposta apresenta value positivo. A probabilidade real é maior que a implícita nas odds.</p>
          )}
          {result.valueBet < 0 && (
            <p>❌ Esta aposta não apresenta value. As odds não compensam o risco.</p>
          )}
          {result.recommendedStake > 0 && (
            <p>💰 O stake recomendado é calculado usando o Critério de Kelly (Quarter Kelly para reduzir variância).</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
