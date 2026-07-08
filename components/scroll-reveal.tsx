'use client'

import { useEffect } from 'react'

// Observes every element carrying the `.reveal` class and adds `.is-visible`
// when it scrolls into view. Drop one <ScrollReveal /> on a page and add the
// `reveal` class to any element you want to fade/rise in. Respects reduced
// motion: when motion is reduced the CSS hidden state is absent, so this simply
// adds a no-op class. Mount once per page.
export function ScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (nodes.length === 0) return

    // No IntersectionObserver (or reduced motion handled by CSS) → reveal all.
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return null
}
