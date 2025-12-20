'use client'

import { useState, useEffect } from 'react'

export const useTypewriter = (texts: string[], speed: number = 80) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [displayTexts, setDisplayTexts] = useState<string[]>(texts.map(() => ''))

  useEffect(() => {
    if (currentTextIndex < texts.length) {
      const currentText = texts[currentTextIndex]
      
      if (currentCharIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayTexts(prev => {
            const newTexts = [...prev]
            newTexts[currentTextIndex] = currentText.substring(0, currentCharIndex + 1)
            return newTexts
          })
          setCurrentCharIndex(prev => prev + 1)
        }, speed)

        return () => clearTimeout(timeout)
      } else {
        // Move to next text after a delay
        const timeout = setTimeout(() => {
          setCurrentTextIndex(prev => prev + 1)
          setCurrentCharIndex(0)
        }, 500) // Pause between texts

        return () => clearTimeout(timeout)
      }
    }
  }, [currentTextIndex, currentCharIndex, texts, speed])

  useEffect(() => {
    setCurrentTextIndex(0)
    setCurrentCharIndex(0)
    setDisplayTexts(texts.map(() => ''))
  }, [texts.join('')])

  return displayTexts
}

