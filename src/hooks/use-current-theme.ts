'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme-provider';

export function useCurrentTheme() {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sincroniza o estado com o tema atual após o mount
    setIsDark(theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (!mounted) return;

    const updateTheme = () => {
      setIsDark(theme === 'dark');
    };

    updateTheme();
  }, [theme, mounted]);

  // Durante a hidratação, sempre retorna false para evitar mismatch
  // O script inline no layout.tsx já cuida de aplicar o tema correto
  if (!mounted) {
    return false;
  }

  return isDark;
}
