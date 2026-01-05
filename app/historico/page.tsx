'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { Filter, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HistoricoPage() {
  const { history } = useAppStore();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredHistory = filterType === 'ALL' 
    ? history 
    : history.filter(h => h.type === filterType);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      RESULTADO_1X2: '1X2',
      OVER_UNDER: 'Over/Under',
      BTTS: 'BTTS',
      HANDICAP: 'Handicap',
      ESCANTEIOS: 'Escanteios',
      CARTOES: 'Cartões',
    };
    return labels[type] || type;
  };

  const getRecommendationBadge = (recommendation: string) => {
    const styles = {
      APOSTAR_FORTE: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      APOSTAR: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      CAUTELA: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      EVITAR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    const labels = {
      APOSTAR_FORTE: '🔥 Forte',
      APOSTAR: '✅ Apostar',
      CAUTELA: '⚠️ Cautela',
      EVITAR: '❌ Evitar',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${styles[recommendation as keyof typeof styles]}`}>
        {labels[recommendation as keyof typeof labels]}
      </span>
    );
  };

  const getOutcomeIcon = (outcome?: string) => {
    if (!outcome) return <Clock className="h-4 w-4 text-gray-400" />;
    if (outcome === 'WIN') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (outcome === 'LOSS') return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  const stats = {
    total: history.length,
    won: history.filter(h => h.outcome === 'WIN').length,
    lost: history.filter(h => h.outcome === 'LOSS').length,
    pending: history.filter(h => !h.outcome || h.outcome === 'PENDING').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Histórico de Validações</h1>
        <p className="text-muted-foreground">
          Todas as suas validações de apostas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Ganhas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.won}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Perdidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lost}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={filterType} onValueChange={setFilterType}>
            <TabsList className="grid grid-cols-3 md:grid-cols-7">
              <TabsTrigger value="ALL">Todas</TabsTrigger>
              <TabsTrigger value="RESULTADO_1X2">1X2</TabsTrigger>
              <TabsTrigger value="OVER_UNDER">Over/Under</TabsTrigger>
              <TabsTrigger value="BTTS">BTTS</TabsTrigger>
              <TabsTrigger value="HANDICAP">Handicap</TabsTrigger>
              <TabsTrigger value="ESCANTEIOS">Escanteios</TabsTrigger>
              <TabsTrigger value="CARTOES">Cartões</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle>Validações</CardTitle>
          <CardDescription>
            {filteredHistory.length} {filteredHistory.length === 1 ? 'validação' : 'validações'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma validação encontrada
            </p>
          ) : (
            <div className="space-y-4">
              {filteredHistory.slice().reverse().map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getOutcomeIcon(item.outcome)}
                        <h3 className="font-semibold">{item.match}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="bg-primary/10 px-2 py-0.5 rounded text-primary font-medium">
                          {getTypeLabel(item.type)}
                        </span>
                        <span>{new Date(item.date).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    {getRecommendationBadge(item.result.recommendation)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Odds</p>
                      <p className="font-semibold">{item.odds.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Value Bet</p>
                      <p className={`font-semibold ${item.result.valueBet > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(item.result.valueBet)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stake</p>
                      <p className="font-semibold">{formatCurrency(item.stake)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">EV</p>
                      <p className={`font-semibold ${item.result.expectedValue > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(item.result.expectedValue)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
