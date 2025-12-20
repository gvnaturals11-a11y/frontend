import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  init: () => void
}

const getStoredTheme = (): Theme => {
  // Always return light mode as default
  return 'light'
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
        localStorage.setItem('theme', newTheme)
      }
      return { theme: newTheme }
    })
  },
  
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark')
      localStorage.setItem('theme', theme)
    }
    set({ theme })
  },
  
  init: () => {
    const theme = getStoredTheme()
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
    set({ theme })
  },
}))

