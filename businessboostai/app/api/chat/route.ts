import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { message, assistantType, conversationHistory } = await req.json()

    if (!message || !assistantType) {
      return NextResponse.json({ error: 'Message and assistant type are required' }, { status: 400 })
    }

    // Get business info from request body (if provided by client)
    const businessInfo = conversationHistory?.businessInfo || {}

    // Build business context string
    let businessContext = ''
    if (businessInfo.businessName) {
      businessContext = `
Business Information:
- Business Name: ${businessInfo.businessName}
- Business Type: ${businessInfo.businessType}
- Business Age: ${businessInfo.businessAge || 'Not specified'}
- Team Size: ${businessInfo.teamSize || 'Not specified'}
- Why Using BusinessBoost AI: ${businessInfo.whyJoin || 'Not specified'}
- Main Challenges: ${businessInfo.mainChallenges || 'Not specified'}
- Business Goals: ${businessInfo.goals || 'Not specified'}
`
    }

    // Build context-aware system prompt
    let systemPrompt = ''
    
    if (assistantType === 'practical') {
      systemPrompt = `You are BusinessBoost AI's Practical Business Assistant.

IMPORTANT: Before providing any solution or advice, first ask the user what specific problem or challenge they are currently facing in their business. Only after understanding their current issue should you provide a tailored solution.

${businessContext}

When you understand their specific problem, provide personalized advice that takes into account their business type, size, challenges, and goals. Reference their business information when relevant to make your advice more targeted.

Keep answers structured, practical, and relevant to their specific business situation.
Be concise but thorough. Use bullet points when appropriate.
Focus on concrete steps and actionable advice tailored to their business.`
    } else if (assistantType === 'support') {
      systemPrompt = `You are BusinessBoost AI's Emotional Support Assistant.

IMPORTANT: Before providing any support or encouragement, first ask the user what specific problem or challenge they are currently facing in their business. Only after understanding their current issue should you provide personalized support.

${businessContext}

When you understand their specific problem, provide empathetic encouragement and support that takes into account their business type, challenges, and goals. Reference their business information when relevant to make your support more targeted and understanding.

Be supportive, calm, and practical. Acknowledge their challenges and offer emotional support.
Be warm and understanding while providing practical stress-management tips tailored to their business situation.
Focus on their wellbeing and work-life balance as a business owner.`
    } else {
      return NextResponse.json({ error: 'Invalid assistant type' }, { status: 400 })
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
    })

    const responseContent = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again."

    return NextResponse.json({ response: responseContent })
  } catch (error: unknown) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat request'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}