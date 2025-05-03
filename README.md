# FURIA KYF — Know Your Fan Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/seu-usuario/furia-kyf/actions)
[![Coverage](https://img.shields.io/badge/coverage-95%25-blue)](https://github.com/seu-usuario/furia-kyf/actions)

**FURIA KYF** é um protótipo de *Know Your Fan*, desenvolvido como desafio técnico para a vaga de Assistente de
Engenharia de Software.

---

## 🚀 Propósito

Conheça seus fãs de maneira segura e inteligente, combinando registro guiado
com análise automatizada.

- Coleta de dados via formulários multietapas
- Upload e validação de documentos (OCR)
- Classificação de links externos com IA
- Consulta de informações em painel administrativo restrito

---

## 🛠 Tecnologias

- **Next.js v13.4.4** (App Router)
- **React v18.2.0**
- **TypeScript v5.1.6**
- **TailwindCSS v3.2**
- **Framer Motion v10** (animações)
- **Supabase JS v2** (banco de dados e autenticação)
- **NextAuth.js v4** (login social)
- **React Hook Form v7** (validação de formulários)

---

## 🧱 Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx             # Layout principal e metadata
│   ├── page.tsx               # Página inicial
│   ├── connect/page.tsx       # Login via Discord/Google
│   ├── register/page.tsx      # Registro multietapas
│   └── admin/
│       ├── page.tsx           # Dashboard de admin
│       └── fan/[id]/page.tsx  # Detalhes de fã
├── components/ui/
│   ├── StatusPopup.tsx        # Popups de status
│   └── Toast.tsx              # Toasts de feedback
├── context/ToastContext.tsx   # Provedor global de toasts
├── features/register/components/
│   ├── StepPersonal.tsx       # Etapa 1 do registro
│   ├── StepFanProfile.tsx     # Etapa 2 do registro
│   └── StepDocumentUpload.tsx # Etapa 3 do registro
├── lib/auth.ts                # Configura NextAuth
├── hooks/useIsAdmin.ts        # Hook para verificar admin
├── pages/api/
│   ├── analyze.ts             # Endpoint de análise de links
│   └── register.ts            # Endpoint de registro de fã
└── styles/globals.css         # Estilos globais

public/
└── favicon.ico                # Ícone da aplicação
```

---

## 📝 Funcionalidades

- **Formulário multietapas:**
  1. Dados pessoais (nome, CPF, localização, endereço)
  2. Perfil de fã (interesses, atividades, histórico)
  3. Validação de documento (upload + OCR)
- **Análise de Links:** IA retorna score de 0–100 conforme relevância
- **Dashboard Admin:** lista de fãs, filtro por detalhes e navegação
- **Autorização:** acesso restrito a e-mails definidos em `.env`

---

## 🔐 Fluxos de Usuário

- **Fã:**
  1. Login social (Discord/Google)
  2. Registro em três etapas
  3. Redirecionado para home
- **Admin:**
  1. Login social + validação de e-mail
  2. Acessa `/admin` para gerenciar fãs

---

## 🔄 Análise de Links

```ts
POST /api/analyze
Body: { url: string }
Resposta: { relevance: number } // score de 0 a 100
```

- 🔴 0–29  → Irrelevante
- 🟠 30–59 → Pouco relacionado
- 🟡 60–84 → Relevante
- 🟢 85–100→ Muito relevante

---

## 🧬 Tabela `fans` (Supabase)

| Campo                 | Tipo     |
|----------------------|----------|
| id                   | uuid     |
| nome                 | text     |
| email                | text     |
| cpf                  | text     |
| endereco             | text     |
| estado               | text     |
| cidade               | text     |
| interesses           | text[]   |
| atividades           | text[]   |
| eventos_participados | text[]   |
| compras_relacionadas | text[]   |
| guilds_discord       | text[]   |
| created_at           | timestamp|

---

## ⚙️ Instalação e Configuração

1. **Clone o repositório**
   ```bash
git clone https://github.com/seu-usuario/furia-kyf.git
cd furia-kyf
```
2. **Instale dependências**
   ```bash
npm install
```
3. **Configurar variáveis de ambiente**
   - **Google OAuth**: crie projeto em [Google Cloud Console](https://console.cloud.google.com), ative OAuth2 e obtenha CLIENT_ID e SECRET
   - **Discord OAuth**: registre sua aplicação em [Discord Developer Portal](https://discord.com/developers), copie CLIENT_ID e SECRET
   - **Supabase**: crie conta em [Supabase](https://supabase.com), gere URL e ANON_KEY
   - **OpenRouter**: crie conta em [OpenRouter](https://openrouter.ai), obtenha API_KEY
   - **NextAuth**: defina NEXTAUTH_SECRET e NEXTAUTH_URL

4. **Arquivo `.env.local`**
   ```env
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENROUTER_API_KEY=...
NEXT_PUBLIC_ADMIN_EMAILS=exemplo@exemplo.com,exemplo2@exemplo.com
```

5. **Execute localmente**
   ```bash
npm run dev
```

Acesse em: http://localhost:3000

---

## 📌 Observações

> Este projeto é público para avaliação técnica e não se destina à produção. 
> Substitua todas as credenciais antes do uso em ambiente real.
> Todos os direitos sobre a marca FURIA são reservados à organização.> Este projeto foi desenvolvido como parte de um desafio técnico para a equipe **FURIA Esports**.  
> Todos os direitos sobre a marca FURIA são reservados à organização.


---