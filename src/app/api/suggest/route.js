import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { dish, buyerType } = await req.json()

    //
    // 1️⃣ Gerar pairing completo (não só recomendações)
    //
    const pairingPrompt = `
You are a sommelier AI.

Analyze the dish description below and produce ONLY a valid JSON object with this exact format:

{
  "wineStyle": "...",
  "grapeVariety": "...",
  "priceRange": "...",
  "confidence": 85,
  "explanation": "..."
}

NO explanations.
NO intro.
NO markdown.

Dish description (can be a photo URL or text): ${dish}
Budget tier: ${buyerType}
    `

    const pairingRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: pairingPrompt }],
        temperature: 0.3,
      }),
    })

    const pairingJSON = await pairingRes.json()
    let pairing = pairingJSON.choices?.[0]?.message?.content || "{}"
    pairing = pairing.replace(/```json|```/g, "").trim()

    let pairingData = {}
    try {
      pairingData = JSON.parse(pairing)
    } catch {
      pairingData = {
        wineStyle: "White Wine",
        grapeVariety: "Chardonnay",
        priceRange: "€15 - €30",
        confidence: 80,
        explanation: "Fallback pairing due to formatting issue."
      }
    }

    //
    // 2️⃣ Sugestões de garrafas (3 recomendações)
    //
    const suggestPrompt = `
Return ONLY a valid JSON array with 3 wines that match:

Dish: ${dish}
Buyer type: ${buyerType}

Format:
[
  {"name": "...", "region": "...", "price": "..."},
  ...
]

NO text, NO markdown.
    `

    const suggestRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: suggestPrompt }],
        temperature: 0.2,
      }),
    })

    const suggestJSON = await suggestRes.json()
    let content = suggestJSON.choices?.[0]?.message?.content || "[]"
    content = content.replace(/```json|```/g, "").trim()

    let wines = []
    try {
      wines = JSON.parse(content)
    } catch {
      wines = [
        { name: "Marqués de Riscal Reserva", region: "Rioja, Spain", price: "€25" },
        { name: "Chablis Premier Cru", region: "Burgundy, France", price: "€40" },
        { name: "Antinori Tignanello", region: "Tuscany, Italy", price: "€65" },
      ]
    }

    //
    // 3️⃣ Enriquecer recomendações com imagem + link (SerpAPI)
    //
    const enriched = await Promise.all(
      wines.map(async (wine) => {
        let image = "/wine-fallback.png"
        let url = "https://www.google.com/search?q=" + encodeURIComponent(wine.name)

        try {
          const serpImg = await fetch(
            `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(
              wine.name + " wine bottle"
            )}&api_key=${process.env.SERPAPI_KEY}`
          )
          const imgJson = await serpImg.json()
          if (imgJson.images_results?.[0]?.thumbnail) {
            image = imgJson.images_results[0].thumbnail
          }

          const serpLink = await fetch(
            `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
              wine.name + " buy wine"
            )}&api_key=${process.env.SERPAPI_KEY}`
          )
          const linkJson = await serpLink.json()
          if (linkJson.organic_results?.[0]?.link) {
            url = linkJson.organic_results[0].link
          }
        } catch {
          // fallback seguro
        }

        return { ...wine, image, url }
      })
    )

    //
    // 4️⃣ Resposta final COMPLETA
    //
    return NextResponse.json({
      ok: true,
      result: {
        ...pairingData,
        recommendations: enriched
      }
    })

  } catch (error) {
    console.error("❌ Suggestion API error:", error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
