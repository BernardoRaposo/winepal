"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wine, Sparkles, ChevronDown } from "lucide-react";

export function Hero({ onStartNow }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background texture */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />



      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Brand */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Wine className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-wide text-foreground">
            WinePal
          </h1>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight text-balance"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Your AI Sommelier.
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-2xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          Snap your dish · Discover your perfect wine.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="pt-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Button
            onClick={onStartNow}
            size="lg"
            className="text-lg px-12 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/20"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Begin Pairing
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
