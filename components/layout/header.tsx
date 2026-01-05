'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { useState } from 'react';
import { UserConfigPopover } from './user-config-popover';

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">⚽ Bet Validator</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/validador"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith('/validador') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Validadores
            </Link>
            <Link
              href="/banca"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/banca' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Gestão de Banca
            </Link>
            <Link
              href="/historico"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/historico' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Histórico
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* User Info & Bankroll - Desktop */}
          <div className="hidden sm:block">
            <UserConfigPopover />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          {/* Mobile User Info - Editável */}
          <div className="pb-4 mb-4 border-b">
            <UserConfigPopover />
          </div>
          
          <nav className="flex flex-col gap-4">
            <Link
              href="/validador"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith('/validador') ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Validadores
            </Link>
            <Link
              href="/banca"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/banca' ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Gestão de Banca
            </Link>
            <Link
              href="/historico"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/historico' ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Histórico
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
