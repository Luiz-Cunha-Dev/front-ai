'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'dark') {
      return <Sun className="h-4 w-4" />;
    } else {
      return <Moon className="h-4 w-4" />;
    }
  };

  const getTooltip = () => {
    if (theme === 'light') {
      return 'Mudar para modo escuro';
    } else {
      return 'Mudar para modo claro';
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={getTooltip()}
      className="h-9 w-9 cursor-pointer"
    >
      {getIcon()}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
