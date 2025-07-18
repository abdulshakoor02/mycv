'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, Linkedin } from 'lucide-react'

export default function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "shakoor.ansari@hotmail.com",
      href: "mailto:shakoor.ansari@hotmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+971-589293060",
      href: "tel:+971589293060"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/abdulansari-a271ba40",
      href: "https://www.linkedin.com/in/abdulansari-a271ba40"
    }
  ]

  return (
    <section className="py-20 relative" id="contact">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-400">
            Let&apos;s discuss your next project
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Let&apos;s work together
            </h3>
            <p className="text-gray-300 mb-8">
              I&apos;m currently open to new opportunities and collaborations. 
              Whether you&apos;re looking for a senior technical lead, software architect, 
              or just want to discuss your next big idea, I&apos;d love to hear from you.
            </p>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={info.href}
                    className="glass glass-hover p-4 rounded-lg flex items-center space-x-4 transition-all"
                  >
                    <info.icon className="w-6 h-6 text-cyan-400" />
                    <div>
                      <p className="text-sm text-gray-400">{info.label}</p>
                      <p className="text-white font-medium">{info.value}</p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glass p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Send a Message
              </h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full glass px-4 py-2 rounded-lg text-white placeholder-gray-400"
                    placeholder="Your Name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full glass px-4 py-2 rounded-lg text-white placeholder-gray-400"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full glass px-4 py-2 rounded-lg text-white placeholder-gray-400"
                    placeholder="Project Discussion"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full glass px-4 py-2 rounded-lg text-white placeholder-gray-400 resize-none"
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium py-3 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-4">
            Based in Liwan, Dubai, UAE • Available for remote work
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://www.linkedin.com/in/abdulansari-a271ba40"
              className="p-3 glass glass-hover rounded-full transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 text-cyan-400" />
            </a>
            <a
              href="mailto:shakoor.ansari@hotmail.com"
              className="p-3 glass glass-hover rounded-full transition-all"
              aria-label="Email"
            >
              <Mail className="w-6 h-6 text-cyan-400" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}