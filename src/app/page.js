"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Wine, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [buyerType, setBuyerType] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const inputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target?.result);
    reader.readAsDataURL(file);
  };

  const handleSuggestWine = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage, buyerType }),
      });
      const data = await res.json();
      // ajuste se seu endpoint retornar { ok, data }
      setResult(data.data ?? data);
    } catch (err) {
      console.error("Error getting wine suggestion:", err);
      alert("Failed to get a suggestion.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBuyerTypeInfo = (type) => {
    if (type === "basic")   return { label: "Essential", range: "€5–€12",  desc: "Quality wines for everyday enjoyment" };
    if (type === "medium")  return { label: "Refined",   range: "€12–€25", desc: "Premium selections for special moments" };
    return                    { label: "Luxe",      range: "€25–€80+", desc: "Exceptional wines for connoisseurs" };
  };

  if (result) {
    const pct = typeof result.confidence === "number" && result.confidence <= 1
      ? Math.round(result.confidence * 100)
      : result.confidence;

    return (
      <div className="min-h-screen bg-[#FAF4EB] font-serif">
        <div className="max-w-md mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-[#611525] p-3 rounded-full mr-3">
                <Wine className="w-8 h-8 text-[#FAF4EB]" />
              </div>
              <h1 className="text-4xl font-bold text-[#611525] tracking-tight">WinePal</h1>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#FAF4EB]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[#611525]/10">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#611525] mb-4">Perfect Match Found</h2>
                <div className="relative inline-block">
                  <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt="Uploaded dish"
                    width={120}
                    height={120}
                    className="rounded-2xl object-cover shadow-lg"
                  />
                  <div className="absolute -top-2 -right-2 bg-[#611525] text-[#FAF4EB] rounded-full p-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#611525] mt-4">{result.dish}</h3>
              </div>
            </div>

            <div className="bg-[#611525] rounded-3xl p-8 shadow-2xl text-[#FAF4EB]">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Your Wine</h2>
                <div className="w-16 h-1 bg-[#FAF4EB]/50 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-[#FAF4EB]/70 text-sm uppercase tracking-wider mb-1">Style</div>
                    <div className="text-xl font-bold">{result.style}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#FAF4EB]/70 text-sm uppercase tracking-wider mb-1">Grape</div>
                    <div className="text-xl font-bold">{result.grape}</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[#FAF4EB]/70 text-sm uppercase tracking-wider mb-1">Price Range</div>
                  <div className="text-2xl font-bold">{result.price_band}</div>
                </div>

                <div className="bg-[#FAF4EB]/10 rounded-2xl p-6">
                  <p className="text-[#FAF4EB]/90 leading-relaxed text-center italic">&quot;{result.pairing_rationale}&quot;</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF4EB]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[#611525]/10">
              <h2 className="text-2xl font-bold text-[#611525] mb-6 text-center">Recommended Bottles</h2>
              <div className="space-y-4">
                {(result.suggestions || []).map((wine, i) => (
                  <div key={i} className="bg-gradient-to-r from-[#611525]/5 to-[#611525]/10 rounded-2xl p-5 border border-[#611525]/20">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#611525] text-lg mb-1">{wine.label}</h3>
                        <p className="text-[#611525]/70 text-sm mb-2">{wine.region}</p>
                        <p className="text-[#611525] font-bold">{wine.approx_price}</p>
                      </div>
                      <div className="bg-[#611525]/10 p-2 rounded-full">
                        <Wine className="w-4 h-4 text-[#611525]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="bg-[#FAF4EB]/60 backdrop-blur-sm rounded-2xl p-4 inline-block">
                <div className="text-[#611525]/70 text-sm uppercase tracking-wider mb-1">AI Confidence</div>
                <div className="text-2xl font-bold text-[#611525]">{pct}%</div>
              </div>

              <button
                onClick={() => { setResult(null); setSelectedImage(null); }}
                className="w-full bg-[#611525] hover:bg-[#611525]/90 text-[#FAF4EB] rounded-2xl py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <ArrowRight className="w-6 h-6 mr-2" />
                Discover Another Pairing
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF4EB] font-serif">
      <div className="max-w-md mx-auto px-6 py-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-[#611525] p-4 rounded-full mr-4 shadow-2xl">
              <Wine className="w-10 h-10 text-[#FAF4EB]" />
            </div>
            <h1 className="text-5xl font-bold text-[#611525] tracking-tight">WinePal</h1>
          </div>
          <p className="text-[#611525]/80 text-xl leading-relaxed px-2 font-medium">
            Capture your dish.<br />
            <span className="text-[#611525] font-bold">Discover perfect wine.</span>
          </p>
        </div>

        <div className="mb-12">
          <div className="bg-[#FAF4EB]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[#611525]/10">
            {selectedImage ? (
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected dish"
                    width={200}
                    height={200}
                    className="rounded-2xl object-cover shadow-xl"
                  />
                  <div className="absolute -top-3 -right-3 bg-[#611525] text-[#FAF4EB] rounded-full p-2">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="bg-[#611525]/10 hover:bg-[#611525]/20 text-[#611525] rounded-2xl py-4 px-6 inline-flex items-center gap-3 text-lg font-bold transition-all duration-200 border-2 border-[#611525]/20 hover:border-[#611525]/40">
                    <Camera className="w-5 h-5" />
                    Change Photo
                  </div>
                </label>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#611525]/5 to-[#611525]/15 rounded-3xl flex items-center justify-center mb-8 border-2 border-dashed border-[#611525]/30">
                  <Camera className="w-16 h-16 text-[#611525]/50" />
                </div>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="bg-[#611525] hover:bg-[#611525]/90 text-[#FAF4EB] rounded-2xl py-6 px-8 inline-flex items-center gap-3 text-xl font-bold transition-all duration-200 shadow-2xl transform hover:scale-105">
                    <Upload className="w-6 h-6" />
                    Capture Your Dish
                  </div>
                </label>
                <p className="text-[#611525]/60 text-sm mt-4 font-medium">Take a photo or choose from gallery</p>
              </div>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={inputRef}
              className="hidden"
            />
          </div>
        </div>

        <div className="mb-12">
          <div className="bg-[#FAF4EB]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[#611525]/10">
            <h2 className="text-2xl font-bold text-[#611525] mb-8 text-center">Choose Your Style</h2>
            <div className="space-y-4">
              {["basic", "medium", "premium"].map((type) => {
                const info = getBuyerTypeInfo(type);
                const active = buyerType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setBuyerType(type)}
                    className={`w-full p-6 rounded-2xl text-left transition-all duration-200 transform hover:scale-105 ${
                      active
                        ? "bg-[#611525] text-[#FAF4EB] shadow-2xl"
                        : "bg-gradient-to-r from-[#611525]/5 to-[#611525]/10 text-[#611525] hover:from-[#611525]/10 hover:to-[#611525]/20 border-2 border-[#611525]/20"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xl font-bold mb-1">{info.label}</div>
                        <div className="text-lg font-semibold mb-2">{info.range}</div>
                        <div className={`text-sm ${active ? "text-[#FAF4EB]/80" : "text-[#611525]/70"}`}>
                          {info.desc}
                        </div>
                      </div>
                      <div className={`p-2 rounded-full ${active ? "bg-[#FAF4EB]/20" : "bg-[#611525]/10"}`}>
                        <Wine className={`w-5 h-5 ${active ? "text-[#FAF4EB]" : "text-[#611525]"}`} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={handleSuggestWine}
          disabled={!selectedImage || isLoading}
          className="w-full bg-[#611525] hover:bg-[#611525]/90 disabled:bg-[#611525]/30 text-[#FAF4EB] rounded-2xl py-8 text-2xl font-bold transition-all duration-200 shadow-2xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#FAF4EB] border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Your Dish...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <span>Find Perfect Wine</span>
              <ArrowRight className="w-6 h-6" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
