'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github } from 'lucide-react'

const projects = [
  {
    title: "Real Time Payment Tracker",
    description: "First APP of the UAE region to track full life-cycle of all inward and outward payment across all channels. Built Go lang based microservice to consume kafka events and consolidate transactions.",
    technologies: ["Go Lang", "Kafka", "PostgreSQL", "React", "Microservices"],
    features: [
      "Consume data from 8 different topics",
      "Maintain consistency for all payments",
      "Real-time payment tracking",
      "Multi-channel integration"
    ],
    impact: "Revolutionized payment tracking in UAE region"
  },
  {
    title: "ChecknShare",
    description: "Uber for corporate car sharing platform. Built Bookings, telematics, OAuth(hydra), Notification micro-services and Next.js based frontend.",
    technologies: ["Go Lang", "Node.js", "React", "MongoDB", "Redis", "Microservices"],
    features: [
      "Authentication service with Ory Hydra",
      "Telematics service for vehicle data",
      "Booking lifecycle management",
      "Third-party integrations"
    ],
    impact: "Enabled corporate car sharing across organizations"
  },
  {
    title: "Opal Driver Behavior App",
    description: "Standard app for Oman oil and gas industry by Oman Government. Built trip detection logic and violation algorithms for moving vehicles.",
    technologies: ["MySQL", "Node.js", "React", "Stored Procedures"],
    features: [
      "Trip detection algorithm",
      "Speeding violation detection",
      "Harsh acceleration monitoring",
      "Idling time tracking"
    ],
    impact: "Became standard for Oman oil and gas industry"
  },
  {
    title: "Multi-Region CRM System",
    description: "Comprehensive CRM for human resource, lead management and operations across GCC, India, Qatar and Kuwait regions.",
    technologies: ["Node.js", "Go Lang", "PostgreSQL", "React", "Docker"],
    features: [
      "Multi-region architecture",
      "Dynamic contract generation",
      "Marketing source integration",
      "Performance tracking reports"
    ],
    impact: "Standardized operations across 4 countries"
  }
]

export default function Projects() {
  return (
    <section className="py-20 relative" id="projects">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-400">
            Solutions that made real impact
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="glass glass-hover p-6 h-full flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                      Key Features
                    </h4>
                    <ul className="space-y-1">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-400 text-sm flex items-start">
                          <span className="text-cyan-400 mr-2">→</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-sm"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-4 rounded-lg mb-4">
                    <p className="text-white font-medium">
                      Impact: {project.impact}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-auto">
                  <Button 
                    className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-gray-300 border-gray-600 hover:text-purple-400 hover:border-purple-400"
                    size="sm"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}