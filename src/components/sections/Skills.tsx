'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const skillCategories = {
  'Backend': {
    skills: [
      { name: 'Node.js', level: 95 },
      { name: 'Go Lang', level: 90 },
      { name: 'Microservices', level: 92 },
      { name: 'Socket.io', level: 85 },
      { name: 'Multi-Threading', level: 88 }
    ],
    color: 'from-blue-400 to-cyan-400'
  },
  'Databases': {
    skills: [
      { name: 'PostgreSQL', level: 90 },
      { name: 'MySQL', level: 88 },
      { name: 'MongoDB', level: 85 },
      { name: 'Redis', level: 87 }
    ],
    color: 'from-green-400 to-emerald-400'
  },
  'Frontend': {
    skills: [
      { name: 'React', level: 92 },
      { name: 'Next.js', level: 90 },
      { name: 'Redux', level: 85 },
      { name: 'TypeScript', level: 88 }
    ],
    color: 'from-purple-400 to-pink-400'
  },
  'DevOps & Cloud': {
    skills: [
      { name: 'Docker', level: 85 },
      { name: 'AWS', level: 82 },
      { name: 'Azure', level: 80 },
      { name: 'Jenkins', level: 78 },
      { name: 'CI/CD', level: 85 }
    ],
    color: 'from-orange-400 to-red-400'
  },
  'Languages': {
    skills: [
      { name: 'JavaScript', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'GoLang', level: 88 },
      { name: 'SQL', level: 85 },
      { name: 'Bash', level: 80 }
    ],
    color: 'from-indigo-400 to-purple-400'
  }
}

export default function Skills() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-xl text-gray-400">
            My expertise across the technology stack
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skillCategories).map(([category, data], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="glass glass-hover p-6 h-full">
                <div className="mb-4">
                  <h3 className={`text-xl font-bold bg-gradient-to-r ${data.color} bg-clip-text text-transparent mb-3`}>
                    {category}
                  </h3>
                </div>

                <div className="space-y-4">
                  {data.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{skill.name}</span>
                        <span className="text-gray-400 text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-2 rounded-full bg-gradient-to-r ${data.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="glass p-6 rounded-lg max-w-4xl mx-auto">
            <h4 className="text-2xl font-bold text-white mb-4">Tools & Technologies</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "VS Code", "VIM", "Git", "Docker", "AWS", "Azure", 
                "Nginx", "Jenkins", "OAuth", "ORM", "Redis", "MongoDB"
              ].map((tool) => (
                <Badge
                  key={tool}
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}