import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Wallet,
  Calculator,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Sistema Validador de Apostas Esportivas
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Analise suas apostas com precisão matemática. Calcule value bets, gerencie sua banca e tome decisões baseadas em dados.
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <Link href="/validador">
            <Button size="lg" className="gap-2">
              <Calculator className="h-5 w-5" />
              Começar Validação
            </Button>
          </Link>
          <Link href="/banca">
            <Button size="lg" variant="outline" className="gap-2">
              <Wallet className="h-5 w-5" />
              Gestão de Banca
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Target className="h-10 w-10 text-primary mb-2" />
            <CardTitle>6 Tipos de Validadores</CardTitle>
            <CardDescription>
              Resultado 1X2, Over/Under, BTTS, Handicap Asiático, Escanteios e Cartões
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Cálculos Avançados</CardTitle>
            <CardDescription>
              Value Bet, Kelly Criterion, Distribuição de Poisson, EV e ROI esperado
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <BarChart3 className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Análise Completa</CardTitle>
            <CardDescription>
              Probabilidades implícitas e calculadas, edge, odds justas e mais
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Wallet className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Gestão de Banca</CardTitle>
            <CardDescription>
              Acompanhe sua banca, registre apostas e visualize evolução
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CheckCircle2 className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Recomendações Claras</CardTitle>
            <CardDescription>
              Feedback visual e textual: Apostar Forte, Apostar, Cautela ou Evitar
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Calculator className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Stake Recomendado</CardTitle>
            <CardDescription>
              Cálculo automático usando Quarter Kelly para gestão otimizada
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Como Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mb-2">
                1
              </div>
              <CardTitle>Escolha o Validador</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Selecione o tipo de aposta que deseja validar entre os 6 disponíveis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mb-2">
                2
              </div>
              <CardTitle>Insira os Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Preencha as estatísticas dos times, odds oferecidas e sua banca
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mb-2">
                3
              </div>
              <CardTitle>Analise o Resultado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Veja a análise completa, value bet, stake recomendado e decisão
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/10 rounded-lg p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Pronto para começar?</h2>
        <p className="text-muted-foreground">
          Faça sua primeira validação agora e descubra se sua aposta tem value real
        </p>
        <Link href="/validador">
          <Button size="lg">
            Validar Primeira Aposta
          </Button>
        </Link>
      </section>
    </div>
  );
}

