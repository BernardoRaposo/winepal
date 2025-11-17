import { openai } from "./openaiClient.js";

export async function suggestWine({ image, buyerType = "medium" }) {
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
 "style": "string",
 "grape": "string",
 "region_options": ["string", "string"],
 "price_band": "${band}",
 "pairing_rationale": "60-90 words explaining the pairing rationale",
 "suggestions": [
   {"label": "string", "region": "string", "approx_price": "€.."},
   {"label": "string", "region": "string", "approx_price": "€.."},
   {"label": "string", "region": "string", "approx_price": "€.."}
 ],
 "confidence": 0.0-1.0
}
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
          { type: "image_url", image_url: { url: image } },
        ],
      },
    ],
  });

  const raw = completion?.choices?.[0]?.message?.content || "{}";
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {
      dish: "Unknown dish",
      style: "red",
      grape: "Touriga Nacional",
      region_options: ["Douro", "Alentejo"],
      price_band: band,
      pairing_rationale:
        "We could not parse a detailed rationale. As a safe pairing, a versatile medium-bodied red with balanced acidity works with most dishes.",
      suggestions: [
        { label: "Reserva (generic)", region: "Douro DOC", approx_price: band },
        { label: "Blend (generic)", region: "Alentejo DOC", approx_price: band },
        { label: "Touriga Nacional (generic)", region: "Dão DOC", approx_price: band },
      ],
      confidence: 0.3,
    };
  }

  return { ok: true, data: parsed };
}
