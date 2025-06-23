import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrlKey = false,
          altKey = false,
          shiftKey = false,
          metaKey = false,
          callback
        } = shortcut;

        const keyMatches = event.key.toLowerCase() === key.toLowerCase();
        const ctrlMatches = event.ctrlKey === ctrlKey;
        const altMatches = event.altKey === altKey;
        const shiftMatches = event.shiftKey === shiftKey;
        const metaMatches = event.metaKey === metaKey;

        if (keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches) {
          event.preventDefault();
          callback();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}
