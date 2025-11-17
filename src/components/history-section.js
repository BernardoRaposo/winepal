"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Wine } from "lucide-react";

export function HistorySection({ history, onViewPairing }) {
  // ❗ Mostrar apenas o 2º item do histórico (o anterior ao atual)
  const last = history[1];

  if (!last) return null; // não mostra se não houver pairing anterior

  return (
    <section className="px-4 py-12">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground">
          Previous Pairing
        </h3>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            onClick={() => onViewPairing(last)}
            className="
              group relative w-64 cursor-pointer overflow-hidden 
              rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm 
              shadow-md hover:shadow-xl hover:-translate-y-1 
              transition-all duration-300 mx-auto
            "
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={last.dishImage}
                alt="Previous pairing"
                onError={(e) => (e.currentTarget.src = "/fallback-dish.jpg")}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="
                  inline-flex items-center gap-2 
                  bg-white/20 backdrop-blur-sm 
                  px-3 py-1 rounded-full text-xs font-medium
                ">
                  <Wine className="w-3 h-3" />
                  {last.wineStyle || "Wine"}
                </div>

                <p className="text-sm opacity-90 line-clamp-1">
                  {last.grapeVariety || "Variety Unknown"}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
