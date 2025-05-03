import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const fanSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  endereco: z.string(),
  estado: z.string(),
  cidade: z.string(),
  interesses: z.array(z.string()),
  atividades: z.array(z.string()),
  eventos_participados: z.array(z.string()),
  compras_relacionadas: z.array(z.string())
})

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema: "public" },
      global: { fetch }
    }
  )

  const session = await getServerSession(authOptions)

  try {
    const body = await req.json()
    console.log("🔍 BODY RECEBIDO:", body)

    const fanData = fanSchema.parse(body)
    console.log("✅ fanData VALIDADO:", fanData)

    const guilds = (session?.user as any)?.guilds || []

    const { error } = await supabase.from("fans").insert([
      {
        ...fanData,
        guilds_discord: guilds
      }
    ])

    if (error) {
      console.error("❌ ERRO SUPABASE:", error)
      const isCpfDuplicate =
        error.message.includes("duplicate key value") &&
        error.message.includes("cpf")
      const friendlyMessage = isCpfDuplicate
        ? "CPF já registrado."
        : error.message

      return new Response(JSON.stringify({ error: friendlyMessage }), {
        status: 500
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 201
    })
  } catch (err: any) {
    console.error("❌ ERRO GLOBAL:", err)
    return new Response(
      JSON.stringify({
        error:
          err.errors?.[0]?.message || err.message || "Erro de validação"
      }),
      { status: 400 }
    )
  }
}
