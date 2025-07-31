// app/api/suggest/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Opcional: force Node runtime (a lib openai funciona melhor fora do edge)
export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { image, imageBase64, buyerType = "medium" } = body || {};

    // Normaliza a imagem para data URL
    let dataUrl = null;
    if (typeof image === "string" && image.startsWith("data:")) {
      dataUrl = image;
    } else if (typeof imageBase64 === "string" && imageBase64.length > 0) {
      dataUrl = `data:image/jpeg;base64,${imageBase64}`;
    } else if (typeof image === "string" && image.length > 0) {
      // caso tenham enviado base64 cru pelo campo "image"
      const maybeOnlyB64 = image.includes(",") ? image.split(",")[1] : image;
      dataUrl = `data:image/jpeg;base64,${maybeOnlyB64}`;
    }

    if (!dataUrl) {
      return NextResponse.json(
        { ok: false, error: "Provide 'image' (data URL) or 'imageBase64'." },
        { status: 400 }
      );
    }

    // Faixas de preço por perfil
    const priceBands = {
      basic: "€5–€12",
      medium: "€12–€25",
      premium: "€25–€80+",
    };
    const band = priceBands[buyerType] || priceBands.medium;

    const system = `
You are a sommelier with vision capabilities.
1) Describe the dish in the image (likely ingredients and cooking method).
2) Recommend an ideal wine style (red/white/rosé/sparkling/etc.) and possible grape(s).
3) Consider the buyer budget profile: ${buyerType} (= ${band}).
4) Return ONLY a valid JSON with this exact shape:

{
 "dish": "string",
 "style": "string (e.g., red | white | rosé | sparkling)",
 "grape": "string (e.g., Pinot Noir)",
 "region_options": ["string", "string"],
 "price_band": "${band}",
 "pairing_rationale": "60-90 words explaining the pairing rationale",
 "suggestions": [
   {"label": "generic producer or style", "region": "string", "approx_price": "€.."},
   {"label": "string", "region": "string", "approx_price": "€.."},
   {"label": "string", "region": "string", "approx_price": "€.."}
 ],
 "confidence": 0.0-1.0
}
No extra text outside JSON.
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze the photo and produce the pairing JSON." },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      // timeouts e afins podem ser configurados via fetchOptions se necessário
    });

    const raw = completion?.choices?.[0]?.message?.content || "{}";
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // fallback defensivo
      parsed = {
        dish: "Unknown dish",
        style: "red",
        grape: "Tempranillo",
        region_options: ["Douro", "Alentejo"],
        price_band: band,
        pairing_rationale:
          "We could not parse a detailed rationale. As a safe pairing, a versatile medium-bodied red with balanced acidity works with a broad range of dishes.",
        suggestions: [
          { label: "Reserva (generic)", region: "Douro DOC", approx_price: band },
          { label: "Blend (generic)", region: "Alentejo DOC", approx_price: band },
          { label: "Touriga Nacional (generic)", region: "Dão DOC", approx_price: band },
        ],
        confidence: 0.3,
      };
    }

    // Garantias mínimas de forma/campos
    if (!Array.isArray(parsed.suggestions)) parsed.suggestions = [];
    if (!Array.isArray(parsed.region_options)) parsed.region_options = [];

    return NextResponse.json({ ok: true, data: parsed });
  } catch (err) {
    console.error("[/api/suggest] Error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
