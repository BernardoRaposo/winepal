"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Lightbulb, Sparkles, Crown } from "lucide-react";

export function BuyerSelector({ onBuyerSelected }) {
  const options = [
    {
      type: "essential",
      icon: Lightbulb,
      title: "Essential",
      description: "Everyday wines for simple pleasures.",
      priceRange: "$10 - $20",
      gradient: "from-amber-500/20 to-yellow-500/20",
    },
    {
      type: "refined",
      icon: Sparkles,
      title: "Refined",
      description: "When the dinner deserves attention.",
      priceRange: "$30 - $70",
      gradient: "from-primary/20 to-amber-500/20",
    },
    {
      type: "luxe",
      icon: Crown,
      title: "Luxe",
      description: "For collectors and fine taste.",
      priceRange: "$100+",
      gradient: "from-primary/30 to-amber-300/30",
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-light text-foreground"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Select your budget
          </motion.h2>
          <p className="text-muted-foreground text-lg">
            Help us find the perfect match for your preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {options.map((option, i) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card
                  onClick={() => onBuyerSelected(option.type)}
                  className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm"
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <div className="relative p-8 space-y-6">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                      whileHover={{ rotate: 10 }}
                    >
                      <Icon className="w-8 h-8 text-primary" />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-3xl font-medium text-foreground">
                        {option.title}
                      </h3>
                      <p className="text-sm text-primary font-medium tracking-wide">
                        {option.priceRange}
                      </p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
