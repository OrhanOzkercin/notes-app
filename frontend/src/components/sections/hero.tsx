'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20">
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-cal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground pb-4">
                Where Ideas Take Flight
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xl text-muted-foreground leading-relaxed"
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
                  variant="cta"
                  size="xl"
                  className="font-medium"
                >
                  Start Writing Now
                </Button>
              </Link>
              <Link href="/features">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="font-medium"
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
                  <div className="font-cal text-3xl font-bold text-foreground">
                    {stat.number}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
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