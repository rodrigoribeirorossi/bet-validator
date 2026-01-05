'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';

export default function BancaPage() {
  const { bankroll, updateBankroll, addBankrollEntry } = useAppStore();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const profitLoss = bankroll.currentBankroll - bankroll.initialBankroll;
  const profitLossPercentage = ((profitLoss / bankroll.initialBankroll) * 100).toFixed(2);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      const newBankroll = bankroll.currentBankroll + amount;
      updateBankroll(newBankroll);
      addBankrollEntry({
        date: new Date(),
        amount,
        type: 'DEPOSIT',
        description: 'Depósito manual',
      });
      setDepositAmount('');
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= bankroll.currentBankroll) {
      const newBankroll = bankroll.currentBankroll - amount;
      updateBankroll(newBankroll);
      addBankrollEntry({
        date: new Date(),
        amount,
        type: 'WITHDRAWAL',
        description: 'Saque manual',
      });
      setWithdrawAmount('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Gestão de Banca</h1>
        <p className="text-muted-foreground">
          Acompanhe e gerencie sua banca de apostas
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banca Atual</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(bankroll.currentBankroll)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banca Inicial</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(bankroll.initialBankroll)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro/Prejuízo</CardTitle>
            {profitLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(profitLoss)}
            </div>
            <p className="text-xs text-muted-foreground">
              {profitLoss >= 0 ? '+' : ''}{profitLossPercentage}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-500" />
              Depositar
            </CardTitle>
            <CardDescription>Adicionar fundos à banca</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit">Valor do Depósito (R$)</Label>
              <Input
                id="deposit"
                type="number"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="100.00"
              />
            </div>
            <Button onClick={handleDeposit} className="w-full" disabled={!depositAmount || parseFloat(depositAmount) <= 0}>
              Depositar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-red-500" />
              Sacar
            </CardTitle>
            <CardDescription>Retirar fundos da banca</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw">Valor do Saque (R$)</Label>
              <Input
                id="withdraw"
                type="number"
                step="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="50.00"
              />
            </div>
            <Button 
              onClick={handleWithdraw} 
              variant="destructive" 
              className="w-full"
              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > bankroll.currentBankroll}
            >
              Sacar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>Últimas movimentações na banca</CardDescription>
        </CardHeader>
        <CardContent>
          {bankroll.history.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma transação registrada ainda
            </p>
          ) : (
            <div className="space-y-4">
              {bankroll.history.slice().reverse().slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-3">
                    {entry.type === 'DEPOSIT' && <Plus className="h-4 w-4 text-green-500" />}
                    {entry.type === 'WITHDRAWAL' && <Minus className="h-4 w-4 text-red-500" />}
                    {entry.type === 'WIN' && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {entry.type === 'LOSS' && <TrendingDown className="h-4 w-4 text-red-500" />}
                    <div>
                      <p className="font-medium">{entry.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    entry.type === 'DEPOSIT' || entry.type === 'WIN' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {entry.type === 'DEPOSIT' || entry.type === 'WIN' ? '+' : '-'}
                    {formatCurrency(entry.amount)}
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
