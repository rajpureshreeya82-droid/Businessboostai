# BusinessBoost AI: Full Technical Specification Document (Tech Spec)

This document serves as the implementation specification for **Devin AI** to construct the **BusinessBoost AI** web application. It bridges the product requirements and UI/UX design specifications into code-level database schemas, API routes, component architectures, and integration workflows.

---

## 🏗️ 1. Architecture Stack & System Overview

* 
**Frontend Framework**: Next.js 14+ (App Router, React 18, TypeScript) 


* 
**Styling & UI Library**: Tailwind CSS + Shadcn UI + Lucide Icons 


* 
**Database & Auth**: Supabase (PostgreSQL, Supabase Auth, Row Level Security) 


* 
**AI Engine**: Groq API (`llama-3.3-70b-versatile` model) for fast LLM inference 


* 
**Hosting & Deployment**: Vercel (Frontend & Serverless Functions) + Supabase Cloud (Database) 



```
+---------------------------------------------------------------------------------+
|                               Next.js 14 Frontend                               |
|   (App Router, Tailwind CSS, Shadcn UI Components, React State Management)       |
+----------------------------------------+----------------------------------------+
                                         |
             +---------------------------+---------------------------+
             |                                                       |
             v                                                       v
+--------------------------+                               +--------------------+
|  Supabase Auth & Database|                               |      Groq API      |
| (PostgreSQL + RLS Rules) |                               | (LLM Inference)    |
+--------------------------+                               +--------------------+

```

---

## 🗄️ 2. Database Schema (PostgreSQL / Supabase DDL)

Copy and execute the following SQL in Supabase SQL Editor to establish tables, relationships, indexes, and Row-Level Security (RLS) policies.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Stores user settings & business questionnaire data)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  business_name TEXT,
  industry TEXT,
  employee_count INT DEFAULT 1,
  years_in_business INT DEFAULT 0,
  goals TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  monthly_revenue NUMERIC(12, 2) DEFAULT 0.00,
  monthly_expenses NUMERIC(12, 2) DEFAULT 0.00,
  budget_goal NUMERIC(12, 2) DEFAULT 0.00,
  ai_style TEXT CHECK (ai_style IN ('Motivational', 'Professional', 'Detailed', 'Quick Answers')) DEFAULT 'Professional',
  is_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CHAT MESSAGES TABLE (Stores conversation history for both AI chatbots)
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assistant_type TEXT NOT NULL CHECK (assistant_type IN ('practical', 'support')),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TASKS & CALENDAR EVENTS TABLE
CREATE TABLE public.tasks_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('meeting', 'deadline', 'appointment', 'reminder', 'goal')),
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FINANCIAL RECORDS TABLE
CREATE TABLE public.financial_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(12, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MARKETING POSTS TABLE
CREATE TABLE public.marketing_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  platform TEXT NOT NULL CHECK (platform IN ('Instagram', 'Facebook', 'TikTok', 'Email', 'Other')),
  content_type TEXT NOT NULL,
  caption_text TEXT,
  hashtags TEXT[],
  scheduled_time TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_posts ENABLE ROW LEVEL SECURITY;

-- Policy helper: Users access only their own rows
CREATE POLICY "Allow individual read/write access" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Allow user chat isolation" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow user tasks isolation" ON public.tasks_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow user finance isolation" ON public.financial_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow user marketing isolation" ON public.marketing_posts FOR ALL USING (auth.uid() = user_id);

```

---

## 📁 3. Next.js Directory Architecture & Page Routes

```
src/
├── app/
│   ├── layout.tsx                # Main Root Layout (Providers, Fonts)
│   ├── page.tsx                  # Splash Screen (Auto redirect after 2s)
│   ├── auth/
│   │   └── page.tsx              # Auth Form (Login / Sign Up)
│   ├── onboarding/
│   │   └── page.tsx              # Business Questionnaire Form Wizard
│   ├── welcome/
│   │   └── page.tsx              # Dynamic Welcome & Today Focus Screen
│   ├── dashboard/
│   │   ├── page.tsx              # Home Dashboard Grid
│   │   ├── layout.tsx            # Protected Dashboard Layout with Bottom Nav
│   │   ├── assistant/
│   │   │   ├── practical/page.tsx # Practical AI Assistant Chat Screen
│   │   │   └── support/page.tsx   # Emotional Support AI Chat Screen
│   │   ├── calendar/page.tsx     # Calendar & Task Scheduler
│   │   ├── finance/page.tsx      # Financial Tracker & Metrics
│   │   ├── marketing/page.tsx    # Marketing Planner & Schedule
│   │   └── profile/page.tsx      # Profile & App Settings
│   └── api/
│       └── ai/
│           └── chat/route.ts     # Groq API Streaming Endpoint
├── components/
│   ├── ui/                       # Shadcn UI Base Components (Button, Card, Input)
│   ├── layout/                   # BottomNav, TopHeader, Container
│   ├── dashboard/                # FeatureCard, SummaryCard
│   ├── chat/                     # MessageBubble, ChatInput, QuickPromptChips
│   └── finance/                  # FinancialSummaryCard, IncomeExpenseChart
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase Client
│   │   └── server.ts             # Server Actions Supabase Client
│   ├── groq.ts                   # Groq SDK Client Init
│   └── utils.ts                  # Tailwind Merge & Class Helpers
└── types/
    └── index.ts                  # Shared TypeScript Interfaces

```

---

## 🎨 4. Design System Tokens Setup

Configure `tailwind.config.js` with the design tokens :

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8FBF9F', // Calm Sage Green
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#DCEFE3', // Light Mint
          foreground: '#333333',
        },
        accent: {
          DEFAULT: '#4F7A5A', // Forest Green
          foreground: '#FFFFFF',
        },
        background: '#F8FAF8', // Off White
        customText: '#333333', // Dark Gray
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        button: '24px',
      },
    },
  },
  plugins: [],
};

```

---

## ⚡ 5. Groq API Route Integration (`/api/ai/chat/route.ts`)

This endpoint extracts the user's business context from Supabase and sends structured prompts to Groq API using `llama-3.3-70b-versatile`.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, assistantType } = await req.json();
    const supabase = createServerClient();

    // Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch user profile context
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Build context-aware system prompt
    let systemPrompt = '';
    
    if (assistantType === 'practical') {
      systemPrompt = `You are BusinessBoost AI's Practical Business Assistant.
User Profile:
- Business Name: ${profile?.business_name || 'Small Business'}
- Industry: ${profile?.industry || 'General'}
- Employees: ${profile?.employee_count || 1}
- Goals: ${profile?.goals?.join(', ')}
- Challenges: ${profile?.challenges?.join(', ')}
- AI Style Preference: ${profile?.ai_style || 'Professional'}

Provide actionable business advice, business plan creation, or sales recommendations. Keep answers structured and relevant to their industry.`;
    } else {
      systemPrompt = `You are BusinessBoost AI's Emotional Support Assistant.
User Profile:
- Business Name: ${profile?.business_name || 'Small Business'}
- Challenges: ${profile?.challenges?.join(', ')}
- AI Style Preference: ${profile?.ai_style || 'Motivational'}

Provide empathetic encouragement, stress reduction advice, burnout management, and motivation. Be supportive, calm, and practical.`;
    }

    // Query Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    ]);

    const responseContent = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    // Save message log to Supabase
    await supabase.from('chat_messages').insert([
      { user_id: user.id, assistant_type: assistantType, role: 'user', content: message },
      { user_id: user.id, assistant_type: assistantType, role: 'assistant', content: responseContent }
    ]);

    return NextResponse.json({ response: responseContent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

```

---

## 🛠️ 6. Core Screen Functional Workflows

### 1. Splash Screen (`/`)

* On load, trigger a `setTimeout` for `2000ms`.


* Check active auth token via Supabase Auth:
* If authenticated & onboarded $\rightarrow$ redirect to `/welcome` or `/dashboard`.


* If authenticated & not onboarded $\rightarrow$ redirect to `/onboarding`.


* If unauthenticated $\rightarrow$ redirect to `/auth`.





### 2. Business Questionnaire (`/onboarding`)

* Form wizard collecting input parameters .


* On form submission, perform an `UPSERT` operation on `public.profiles` with `is_onboarded: true` .


* Redirect user to `/welcome` .



### 3. Financial Tracker (`/finance`)

* Query `public.financial_records` for current user.


* **Calculation Engine**:
* 
$\text{Monthly Revenue} = \sum \text{income records in current month}$.


* 
$\text{Monthly Expenses} = \sum \text{expense records in current month}$.


* 
$\text{Profit} = \text{Monthly Revenue} - \text{Monthly Expenses}$.


* 
$\text{Budget Remaining} = \text{budget\_goal} - \text{Monthly Expenses}$.





### 4. Marketing Planner (`/marketing`)

* Render weekly posting grid populated from `public.marketing_posts`.


* Provide quick trigger buttons (`[Generate Captions]`, `[Hashtag Suggestions]`) routing prompts directly into the Practical AI API .



---

## 🔑 7. Environment Variables (`.env.local`)

Devin AI must configure the following variables in the project environment:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Groq API Configuration
GROQ_API_KEY=gsk_your_groq_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

```

---

## 🚀 8. Devin AI Execution Order Checklist

Devin should execute the build in the following sequence:

1. [ ] **Setup Project**: Initialize Next.js 14 App Router project with TypeScript and Tailwind CSS. Install `lucide-react`, `@supabase/supabase-js`, `@supabase/ssr`, and `groq-sdk`.
2. [ ] **Design Tokens**: Configure custom colors (`#8FBF9F`, `#DCEFE3`, `#4F7A5A`, `#F8FAF8`, `#333333`), fonts (`Poppins`, `Inter`), and card border radii in `tailwind.config.js` .


3. [ ] **Database Setup**: Execute DDL SQL schema in Supabase to build `profiles`, `chat_messages`, `tasks_events`, `financial_records`, and `marketing_posts` tables with RLS rules.


4. [ ] **Authentication & Onboarding**: Build `/auth` and multi-step questionnaire form wizard `/onboarding` storing inputs to user profile .


5. [ ] **Home Dashboard**: Build `/dashboard` grid layout containing the 5 main navigation cards and sticky bottom navigation bar .


6. [ ] **AI Assistant Features**: Implement `/api/ai/chat` endpoint using Groq SDK and construct practical and emotional support chat user interfaces .


7. [ ] **Module Tools**: Build out Calendar (`/calendar`), Financial Tracker (`/finance`), Marketing Planner (`/marketing`), and Profile (`/profile`) screens .