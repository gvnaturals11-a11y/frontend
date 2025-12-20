'use client'

import React, { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/store/theme.store'
import { Button } from '../ui/Button'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, init } = useThemeStore()

  useEffect(() => {
    init()
  }, [init])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="p-2"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 rotate-0" />
      )}
    </Button>
  )
}

