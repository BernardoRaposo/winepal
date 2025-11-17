"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wine, Sparkles, MapPin, DollarSign, TrendingUp, RefreshCw, ExternalLink } from "lucide-react"

export function ResultView({ result, onTryAnother }) {
  const [showRefinement, setShowRefinement] = useState(false)

  return (
    <section className="min-h-screen px-4 py-20">
      <div className="w-full max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2">
            <Wine className="w-8 h-8 text-primary" />
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground">
              Perfect Match Found
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Based on your dish and preferences
          </p>
        </motion.div>

        {/* Main pairing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Dish image */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative aspect-square rounded-xl overflow-hidden shadow-2xl ring-1 ring-primary/20"
              >
                <img
                  src={
                    typeof result.dishImage === "string"
                      ? result.dishImage
                      : result.dishImage
                      ? URL.createObjectURL(result.dishImage)
                      : "/placeholder.svg"
                  }
                  alt="Your dish"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                />

              </motion.div>

              {/* Pairing details */}
              <div className="space-y-6">
                <h3 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-2">
                  {result.wineStyle}
                </h3>
                <p className="text-primary text-lg font-medium">{result.grapeVariety}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>Price Range</span>
                    </div>
                    <p className="text-foreground font-medium">{result.priceRange}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>AI Confidence</span>
                    </div>
                    <p className="text-foreground font-medium">{result.confidence}%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Pairing Rationale
                  </h4>
                  <p className="text-foreground leading-relaxed">{result.explanation}</p>
                </div>

                {/* Confidence bar */}
                <div className="space-y-2">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recommended wines (new minimalist layout) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="font-serif text-3xl font-light text-foreground text-center">
            Recommended Bottles
          </h3>

          <div className="divide-y divide-border/40 rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
            {result.recommendations.map((wine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 hover:bg-primary/5 transition-colors duration-300"
              >
                {/* Wine Info */}
                <div className="flex flex-col space-y-1">
                  <h4 className="font-serif text-xl md:text-2xl font-medium text-foreground group-hover:text-primary transition-colors">
                    {wine.name}
                  </h4>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {wine.region}
                  </p>
                </div>

                {/* Price and Action */}
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                  {wine.price && (
                    <p className="text-lg font-medium text-primary">
                      {wine.price.includes("€") ? wine.price : `${wine.price}€`}
                    </p>
                  )}
                  <a
                    href={wine.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Buy Now <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >

          <Button
            size="lg"
            onClick={onTryAnother}
            className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Another Dish
          </Button>
        </motion.div>

       
      </div>
    </section>
  )
}
