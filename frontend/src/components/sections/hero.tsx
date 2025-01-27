'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-grid-neutral-100/50 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_85%)]" />
      <div className="absolute inset-y-0 right-0 -z-10 w-[50%] bg-gradient-to-r from-primary-50/50 via-accent-50/50 to-secondary-50/50 blur-2xl" />
      <div className="absolute inset-y-0 left-0 -z-10 w-[50%] bg-gradient-to-l from-primary-50/50 via-accent-50/50 to-secondary-50/50 blur-2xl" />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-cal text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-transparent pb-4">
              Where Ideas Take Flight
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-neutral-600 leading-relaxed"
          >
            Transform your thoughts into masterpieces. Experience note-taking reimagined 
            with real-time collaboration, version history, and powerful organization tools.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link href="/auth/register">
              <Button 
                size="lg"
                className="text-lg font-medium bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 hover:from-primary-600 hover:via-accent-600 hover:to-secondary-600 text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
              >
                Start Writing Now
              </Button>
            </Link>
            <Link href="/features">
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg font-medium border-neutral-300 text-neutral-700 hover:text-primary-600 hover:border-primary-300 transition-all duration-200"
              >
                See Features
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8"
          >
            {[
              { id: 'users', number: "10K+", label: "Active Users" },
              { id: 'notes', number: "1M+", label: "Notes Created" },
              { id: 'uptime', number: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.id} className="flex flex-col items-center">
                <div className="font-cal text-3xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 bg-clip-text ">
                  {stat.number}
                </div>
                <div className="mt-2 text-sm text-neutral-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
} 