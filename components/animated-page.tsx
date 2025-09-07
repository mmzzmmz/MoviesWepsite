"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface AnimatedPageProps {
  children: React.ReactNode
  className?: string
}

export default function AnimatedPage({ children, className = "" }: AnimatedPageProps) {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    const scrollRevealElements = document.querySelectorAll(".scroll-reveal")
    scrollRevealElements.forEach((el) => observer.observe(el))

    return () => {
      scrollRevealElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div ref={pageRef} className={`page-transition ${className}`}>
      {children}
    </div>
  )
}
