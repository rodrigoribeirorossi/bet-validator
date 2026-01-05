'use client';

import { useState, useEffect } from 'react';
import { User, Wallet, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAppStore } from '@/store';

export function UserConfigPopover() {
  const { user, bankroll, setUser, updateCurrentBankroll } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [bankrollValue, setBankrollValue] = useState(bankroll.currentBankroll.toString());

  // Atualiza os valores quando o popover abre
  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setBankrollValue(bankroll.currentBankroll.toString());
    }
  }, [isOpen, user.name, bankroll.currentBankroll]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSave = () => {
    const newBankroll = parseFloat(bankrollValue.replace(',', '.'));
    
    if (name.trim()) {
      setUser({ name: name.trim() });
    }
    
    if (!isNaN(newBankroll) && newBankroll > 0) {
      updateCurrentBankroll(newBankroll);
    }
    
    setIsOpen(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setBankrollValue(bankroll.currentBankroll.toString());
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-4 hover:bg-muted/50 rounded-lg px-3 py-2 transition-colors cursor-pointer group">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm">
            <Wallet className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-600">
              {formatCurrency(bankroll.currentBankroll)}
            </span>
          </div>
          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 bg-background border shadow-lg z-[100]" 
        align="end"
        sideOffset={8}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Configurações do Usuário</h4>
            <p className="text-xs text-muted-foreground">
              Personalize seu nome e valor da banca
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-xs">
                Seu Nome
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="userName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="pl-9 bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userBankroll" className="text-xs">
                Banca Atual (R$)
              </Label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="userBankroll"
                  type="number"
                  step="0.01"
                  min="0"
                  value={bankrollValue}
                  onChange={(e) => setBankrollValue(e.target.value)}
                  placeholder="1000.00"
                  className="pl-9 bg-background"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Este valor será usado para calcular as stakes recomendadas
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleSave}
            >
              <Check className="h-4 w-4 mr-1" />
              Salvar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}