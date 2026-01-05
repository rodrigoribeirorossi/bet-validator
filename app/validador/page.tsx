import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Trophy, 
  Goal, 
  Users, 
  Flag, 
  CornerDownRight, 
  CreditCard 
} from 'lucide-react';

export default function ValidadorPage() {
  const validators = [
    {
      href: '/validador/resultado-1x2',
      icon: Trophy,
      title: 'Resultado 1X2',
      description: 'Validar apostas de resultado final (vitória casa, empate, vitória fora)',
    },
    {
      href: '/validador/over-under',
      icon: Goal,
      title: 'Over/Under Gols',
      description: 'Validar apostas de mais/menos gols usando distribuição de Poisson',
    },
    {
      href: '/validador/btts',
      icon: Users,
      title: 'Ambas Marcam (BTTS)',
      description: 'Validar se ambos os times marcarão',
    },
    {
      href: '/validador/handicap',
      icon: Flag,
      title: 'Handicap Asiático',
      description: 'Validar apostas com vantagem/desvantagem de gols',
    },
    {
      href: '/validador/escanteios',
      icon: CornerDownRight,
      title: 'Escanteios',
      description: 'Validar Over/Under em escanteios',
    },
    {
      href: '/validador/cartoes',
      icon: CreditCard,
      title: 'Cartões',
      description: 'Validar Over/Under em cartões (incluindo dados do árbitro)',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Validadores de Apostas</h1>
        <p className="text-muted-foreground">
          Escolha o tipo de aposta que você deseja validar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validators.map((validator) => {
          const Icon = validator.icon;
          return (
            <Link key={validator.href} href={validator.href}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader>
                  <Icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{validator.title}</CardTitle>
                  <CardDescription>{validator.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
