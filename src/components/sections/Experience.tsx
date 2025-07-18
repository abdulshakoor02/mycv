'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const experiences = [
  {
    title: "Senior Technical Lead",
    company: "HCL Tech (onsite ENBD Bank)",
    period: "MAR 2024 - Present",
    location: "Dubai, UAE",
    description: [
      "Conduct day-to-day project coordination and implementation across the team",
      "Discussing solution with solution architect for new user stories",
      "Working with BA for analyzing new requirements",
      "Code, Test & review tickets for the sprint"
    ],
    technologies: ["Go Lang", "Node.js", "Microservices", "Azure", "Kafka"]
  },
  {
    title: "Senior Software Engineer",
    company: "Location Solutions",
    period: "Dec 2021 - Feb 2024",
    location: "Dubai, UAE",
    description: [
      "Conduct day-to-day project coordination and implementation across the team",
      "Code, Test & review micro-services",
      "Developing client facing react components"
    ],
    technologies: ["React", "Next.js", "Node.js", "MongoDB", "Redis"]
  },
  {
    title: "Software Engineer",
    company: "Giant Migration UAE",
    period: "Jan 2021 - Nov 2021",
    location: "Dubai, UAE",
    description: [
      "Designed and built CRM for Leads and sales management",
      "Integration with various API to improve User productivity",
      "Built Multiple reports for stakeholders",
      "Built and managed company websites"
    ],
    technologies: ["Node.js", "React", "PostgreSQL", "AWS"]
  },
  {
    title: "Software Engineer",
    company: "DM Consultants UAE",
    period: "May 2019 - Dec 2020",
    location: "Dubai, UAE",
    description: [
      "Designed and built CRM for Leads and sales management"
    ],
    technologies: ["Node.js", "MySQL", "React", "Docker"]
  }
]

export default function Experience() {
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
            Professional Experience
          </h2>
          <p className="text-xl text-gray-400">
            My journey through the tech landscape
          </p>
        </motion.div>

        <div className="relative">
          
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 hidden lg:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                
                <div className="hidden lg:block w-1/2" />

                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full glow hidden lg:block" />

                
                <div className="w-full lg:w-1/2 lg:px-8">
                  <Card className="glass glass-hover p-6">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {exp.title}
                        </h3>
                        <p className="text-lg text-cyan-400 font-medium">
                          {exp.company}
                        </p>
                        <p className="text-sm text-gray-400">
                          {exp.period} • {exp.location}
                        </p>
                      </div>

                      <ul className="space-y-2">
                        {exp.description.map((item, idx) => (
                          <li key={idx} className="text-gray-300 flex items-start">
                            <span className="text-cyan-400 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}