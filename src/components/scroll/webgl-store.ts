'use client'

import { useEffect, useState } from 'react'

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2'))
  } catch {
    return false
  }
}

export function useWebGLSupport() {
  const [support, setSupport] = useState<boolean | null>(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setSupport(detectWebGL()))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return support
}
