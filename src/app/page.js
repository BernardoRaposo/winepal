"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/hero";
import { ImageUploader } from "@/components/image-uploader";
import { BuyerSelector } from "@/components/buyer-selector";
import { LoadingState } from "@/components/loading-state";
import { ResultView } from "@/components/result-view";
import { HistorySection } from "@/components/history-section";
import { Footer } from "@/components/footer";

export default function Home() {
  const [step, setStep] = useState("hero");
  const [selectedImage, setSelectedImage] = useState(null);
  const [buyerType, setBuyerType] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [pairingHistory, setPairingHistory] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("winepal-history");
    if (saved) setPairingHistory(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("winepal-history", JSON.stringify(pairingHistory));
  }, [pairingHistory]);

  const handleStartNow = () => setStep("upload");

  const handleImageSelected = (image) => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setSelectedImage(url);
    } else {
      setSelectedImage(image);
    }
    setStep("buyer");
  };

  const handleBuyerSelected = async (type) => {
    setBuyerType(type);
    setStep("loading");

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dish: selectedImage,
          buyerType: type,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        const result = {
          ...data.result,
          dishImage: selectedImage,
          buyerType: type,
        };

        setCurrentResult(result);
        setPairingHistory((prev) => [result, ...prev].slice(0, 3));
        setStep("result");
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleTryAnother = () => {
    setSelectedImage(null);
    setBuyerType(null);
    setStep("upload");
  };

  const handleViewHistory = (result) => {
    setCurrentResult(result);
    setSelectedImage(result.dishImage);
    setBuyerType(result.buyerType);
    setStep("result");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      {/* 🔮 Background Blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Blob 1 (Rosé) */}
        <div
          className="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] rounded-full 
          bg-rose-300 opacity-100 blur-[180px]"
        />

        {/* Blob 2 (Champagne) */}
        <div
          className="absolute bottom-[-250px] right-[-150px] w-[650px] h-[650px] rounded-full 
          bg-yellow-200 opacity-100 blur-[200px]"
        />

        {/* Blob 3 (Vinho tinto suave) */}
        <div
          className="absolute top-[40%] left-[60%] w-[450px] h-[450px] rounded-full 
          bg-red-300 opacity-100 blur-[160px]"
        />
      </div>

      <main className="flex-1 pb-20 relative z-10">
        {step === "hero" && <Hero onStartNow={handleStartNow} />}
        {step === "upload" && <ImageUploader onImageSelected={handleImageSelected} />}
        {step === "buyer" && <BuyerSelector onBuyerSelected={handleBuyerSelected} />}
        {step === "loading" && <LoadingState />}
        {step === "result" && currentResult && (
          <>
            <ResultView result={currentResult} onTryAnother={handleTryAnother} />
            <HistorySection history={pairingHistory} onViewPairing={handleViewHistory} />
          </>
        )}
      </main>

      <Footer
        onNavHome={() => setStep("hero")}
        onNavNew={() => {
          setSelectedImage(null);
          setCurrentResult(null);
          setStep("upload");
        }}
        onNavHistory={() => {
          if (pairingHistory.length > 0) handleViewHistory(pairingHistory[0]);
        }}
      />
    </div>
  );
}
