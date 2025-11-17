"use client";

import { motion } from "framer-motion";


export function Footer({ onNavHome, onNavNew, onNavHistory }) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50">

      <div className="text-center py-2 border-t border-border/30">
        <p className="text-xs">Built by Bernardo Raposo</p>
      </div>
    </footer>
  );
}