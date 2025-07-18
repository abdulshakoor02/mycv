'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Scene from '@/components/3d/Scene'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      
      
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                <span className="text-gradient">Abdul Shakoor</span>
                <br />
                <span className="text-white">Ansari</span>
              </h1>
              
              <motion.p 
                className="text-xl lg:text-2xl text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Senior Technical Lead <span className="text-cyan-400">•</span> Software Engineer
              </motion.p>
              
              <motion.p 
                className="text-lg text-gray-400 mb-8 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Holistic software development expert with extensive experience in 
                microservices, cloud technologies, and team leadership across UAE and India markets.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <a
                  href="mailto:shakoor.ansari@hotmail.com"
                  className="glass glass-hover px-8 py-3 rounded-lg text-white font-medium transition-all"
                >
                  Get In Touch
                </a>
                <a
                  href="#projects"
                  className="px-8 py-3 rounded-lg border border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-all"
                >
                  View Projects
                </a>
              </motion.div>
            </motion.div>
          </div>

          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <Scene />
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-gray-400" />
      </motion.div>
    </section>
  )
}