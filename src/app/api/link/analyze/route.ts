export const runtime = "nodejs"

import { createClient } from "@supabase/supabase-js"
import { z } from "zod"
import * as cheerio from "cheerio"

const bodySchema = z.object({
  fanId: z.string().uuid(),
  url: z.string().url()
})

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { fanId, url } = bodySchema.parse(await req.json())

    const fanRes = await supabase
      .from("fans")
      .select("*")
      .eq("id", fanId)
      .single()

    if (fanRes.error || !fanRes.data) {
      return new Response(JSON.stringify({ error: "Fã não encontrado" }), {
        status: 404
      })
    }

    const fan = fanRes.data

    const page = await fetch(url)
    const html = await page.text()

    const blockedPatterns = [
      "Just a moment...",
      "Access denied",
      "Cloudflare",
      "Checking your browser",
      "Verification required"
    ]

    const isBlocked = blockedPatterns.some((pattern) => html.includes(pattern))

    if (isBlocked) {
      return new Response(JSON.stringify({
        relevance: 0,
        warning: "O site parece estar protegido por bloqueadores (ex: Cloudflare)."
      }), { status: 200 })
    }

    const $ = cheerio.load(html)

    const title = $("title").text()
    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") || ""
    const headings = $("h1,h2,h3").map((_, el) => $(el).text()).get().join(" | ")
    const paragraphs = $("p").map((_, el) => $(el).text()).get().slice(0, 3).join(" ")

    const content = [title, description, headings, paragraphs]
      .filter(Boolean)
      .join(" | ")

    console.log("🔎 Conteúdo extraído para análise:", content)

    const prompt = `
Você é um sistema especialista em personalização de conteúdo para fãs de e-sports.

Com base no perfil de um fã (incluindo interesses, atividades e histórico),
avalie o quanto o conteúdo textual de uma página da web é relevante para ele.

Retorne **apenas um JSON válido** com uma propriedade "score", onde:
- 85–100 = Muito relevante
- 60–84 = Relevante
- 30–59 = Pouco relacionado
- 0–29 = Irrelevante

⚠️ Não adicione comentários, explicações ou formatação fora do JSON.

Perfil do fã:
- Nome: ${fan.nome}
- Estado: ${fan.estado}
- Cidade: ${fan.cidade}
- Interesses: ${fan.interesses?.join(", ") || "Nenhum"}
- Atividades: ${fan.atividades?.join(", ") || "Nenhuma"}
- Eventos Participados: ${fan.eventos_participados?.join(", ") || "Nenhum"}
- Compras Relacionadas: ${fan.compras_relacionadas?.join(", ") || "Nenhuma"}
- Servidores do Discord: ${fan.guilds_discord?.join(", ") || "Nenhum"}

Conteúdo extraído do link:
"${content}"
    `.trim()

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }]
      })
    })

    const aiJson = await aiRes.json()
    const rawOutput = aiJson.choices?.[0]?.message?.content || ""
    const match = rawOutput.match(/"score"\s*:\s*(\d{1,3})/)
    const relevance = match ? Math.min(Number(match[1]), 100) : 0

    return new Response(JSON.stringify({ relevance }), { status: 200 })

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Erro interno no servidor" }),
      { status: 500 }
    )
  }
}
