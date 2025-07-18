'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, Linkedin, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900/50 border-t border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gradient mb-4">
              Abdul Shakoor Ansari
            </h3>
            <p className="text-gray-400 mb-4">
              Senior Technical Lead specializing in microservices, cloud technologies, and team leadership.
            </p>
            <div className="flex items-center text-gray-400">
              <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
              Liwan, Dubai, UAE
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Experience', href: '#experience' },
                { name: 'Skills', href: '#skills' },
                { name: 'Projects', href: '#projects' },
                { name: 'Contact', href: '#contact' }
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Info
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2 text-cyan-400" />
                <a
                  href="mailto:shakoor.ansari@hotmail.com"
                  className="hover:text-cyan-400 transition-colors"
                >
                  shakoor.ansari@hotmail.com
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-2 text-cyan-400" />
                <a
                  href="tel:+971589293060"
                  className="hover:text-cyan-400 transition-colors"
                >
                  +971-589293060
                </a>
              </li>
            </ul>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Connect With Me
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/abdulansari-a271ba40"
                className="p-3 glass glass-hover rounded-full transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-cyan-400" />
              </a>
              <a
                href="mailto:shakoor.ansari@hotmail.com"
                className="p-3 glass glass-hover rounded-full transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-cyan-400" />
              </a>
            </div>
          </motion.div>
        </div>

        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-t border-gray-800 mt-8 pt-8 text-center"
        >
          <p className="text-gray-400">
            © 2024 Abdul Shakoor Ansari. Built with Next.js 15, Three.js, and modern web technologies.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}