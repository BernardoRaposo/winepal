"use client";

import { useEffect, useState } from "react";
import { Scan, Palette, Grape, Wine } from "lucide-react";

const steps = [
  { icon: Scan, text: "Scanning your dish…", duration: 1000 },
  { icon: Palette, text: "Analyzing textures and colors…", duration: 1000 },
  { icon: Grape, text: "Finding ideal grapes…", duration: 1000 },
  { icon: Wine, text: "Selecting bottles in your price range…", duration: 1000 },
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl mx-auto space-y-12">
        <div className="text-center space-y-8">
          {/* Animated icon */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center backdrop-blur-sm">
              <CurrentIcon className="w-16 h-16 text-primary animate-pulse" />
            </div>
          </div>

          {/* Progress text */}
          <div className="space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground animate-pulse">
              {steps[currentStep].text}
            </h2>
            <p className="text-muted-foreground text-lg">
              This will only take a moment
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto space-y-2">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {progress}%
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep ? "w-8 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
