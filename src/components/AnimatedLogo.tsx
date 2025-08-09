'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedLogo() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(prev => !prev)
    }, 3000) // Complete cycle every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      className="flex items-center justify-center mb-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.svg
        width="200"
        height="80"
        viewBox="0 0 400 160"
        className="text-primary"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {/* Simplified StackMatch Logo Paths */}
        <g>
          {/* Stack Icon - Simplified rectangles representing layers */}
          <rect
            x="20"
            y="40"
            width="60"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              strokeDasharray: 144,
              strokeDashoffset: isVisible ? 0 : 144,
              transition: 'stroke-dashoffset 1.5s ease-in-out, opacity 0.3s ease-in-out',
            }}
          />
          <rect
            x="25"
            y="58"
            width="50"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              strokeDasharray: 124,
              strokeDashoffset: isVisible ? 0 : 124,
              transition: 'stroke-dashoffset 1.5s ease-in-out 0.2s, opacity 0.3s ease-in-out',
            }}
          />
          <rect
            x="30"
            y="76"
            width="40"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              strokeDasharray: 104,
              strokeDashoffset: isVisible ? 0 : 104,
              transition: 'stroke-dashoffset 1.5s ease-in-out 0.4s, opacity 0.3s ease-in-out',
            }}
          />
          <rect
            x="35"
            y="94"
            width="30"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              strokeDasharray: 84,
              strokeDashoffset: isVisible ? 0 : 84,
              transition: 'stroke-dashoffset 1.5s ease-in-out 0.6s, opacity 0.3s ease-in-out',
            }}
          />

          {/* Match Icon - Simplified connecting lines */}
          <circle
            cx="120"
            cy="60"
            r="8"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              strokeDasharray: 50,
              strokeDashoffset: isVisible ? 0 : 50,
              transition: 'stroke-dashoffset 1.5s ease-in-out 0.8s, opacity 0.3s ease-in-out',
            }}
          />
          <circle
            cx="160"
            cy="80"
            r="8"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              strokeDasharray: 50,
              strokeDashoffset: isVisible ? 0 : 50,
              transition: 'stroke-dashoffset 1.5s ease-in-out 1s, opacity 0.3s ease-in-out',
            }}
          />
          <line
            x1="128"
            y1="60"
            x2="152"
            y2="80"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              strokeDasharray: 30,
              strokeDashoffset: isVisible ? 0 : 30,
              transition: 'stroke-dashoffset 1.5s ease-in-out 1.2s, opacity 0.3s ease-in-out',
            }}
          />

          {/* Text - StackMatch */}
          <text
            x="200"
            y="70"
            fontSize="24"
            fontWeight="600"
            fill="currentColor"
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transition: 'opacity 1s ease-in-out 1.4s',
            }}
          >
            StackMatch
          </text>
          
          {/* Underline animation */}
          <line
            x1="200"
            y1="85"
            x2="340"
            y2="85"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              strokeDasharray: 140,
              strokeDashoffset: isVisible ? 0 : 140,
              transition: 'stroke-dashoffset 1.5s ease-in-out 1.6s, opacity 0.3s ease-in-out',
            }}
          />
        </g>
      </motion.svg>
    </motion.div>
  )
}