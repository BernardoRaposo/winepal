"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ImageIcon, Utensils, Sparkles } from "lucide-react";

export function ImageUploader({ onImageSelected }) {
  const [preview, setPreview] = useState(null);
  const [fileObject, setFileObject] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);
    setFileObject(file);
  };

  const handleDemoClick = () => {
    setPreview("/gourmet-pasta-dish-with-fresh-herbs.jpg");
    setFileObject(null); // imagem local, não é file
  };

  const handleContinue = () => {
    onImageSelected(preview);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        className="w-full max-w-2xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center space-y-3">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            What’s on your plate today?
          </h2>
          <p className="text-muted-foreground text-lg">
            Upload a photo or snap one to begin
          </p>
        </div>

        <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm border-border/50">
          {!preview ? (
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="w-full py-6 flex items-center gap-4 hover:scale-[1.02] transition-transform"
                onClick={() => document.getElementById("camera-input")?.click()}
              >
                <Camera className="w-6 h-6 text-primary" />
                Take a Photo
              </Button>
              <input
                id="camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              <Button
                variant="outline"
                className="w-full py-6 flex items-center gap-4 hover:scale-[1.02] transition-transform"
                onClick={() => document.getElementById("upload-input")?.click()}
              >
                <ImageIcon className="w-6 h-6 text-primary" />
                Upload from Gallery
              </Button>
              <input
                id="upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <Button
                variant="outline"
                className="w-full py-6 flex items-center gap-4 hover:scale-[1.02] transition-transform"
                onClick={handleDemoClick}
              >
                <Utensils className="w-6 h-6 text-primary" />
                Preview with Sample Dish
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-primary/20">
                <motion.img
                  src={preview}
                  alt="Selected dish"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 flex items-center gap-2 bg-primary/90 text-primary-foreground px-4 py-2 rounded-full"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Ready to analyze</span>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={() => setPreview(null)} className="flex-1">
                  Choose Different Photo
                </Button>
                <Button
                  onClick={handleContinue}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </section>
  );
}
