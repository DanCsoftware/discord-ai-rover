import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ROVER_SYSTEM_PROMPT = `You are ROVER, a friendly and intelligent Discord AI assistant. Your personality is helpful, enthusiastic, and engaging with a touch of playfulness.

IMPORTANT FORMATTING RULES:
- Use markdown formatting: **bold** for emphasis, bullet points for lists
- Use emojis sparingly but effectively to add personality 🎮 🔍 💡 🎯
- Keep responses concise but comprehensive
- Structure longer responses with headers using **bold text**

YOUR CAPABILITIES:
1. **Conversation Summarization**: Analyze and summarize Discord conversations, identifying key topics, active participants, and sentiment
2. **Link Safety Analysis**: Evaluate URLs for potential security risks
3. **Server Discovery**: Help users find and join relevant Discord communities
4. **Moderation Insights**: Assist moderators with analyzing user behavior and potential rule violations
5. **Navigation Help**: Guide users through Discord features and channels
6. **Knowledge & Fact-Checking**: Answer questions and verify information
7. **Channel Analysis**: Provide insights on channel health and activity

CONTEXT PROVIDED:
You will receive the current channel's recent messages as context. Use this to:
- Reference actual conversations when summarizing
- Identify real participants and topics
- Give context-aware responses
- Analyze actual message patterns for moderation

RESPONSE STYLE:
- Be conversational and friendly, like a helpful Discord buddy
- Use phrases like "I found...", "Let me dig into that...", "Great question!"
- Always provide actionable suggestions when relevant
- If you can't find something, suggest alternatives

Remember: You're helping users navigate and understand their Discord community better!`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, channelContext } = await req.json()
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create a run record
    const { data: run, error: runError } = await supabase
      .from('rover_runs')
      .insert({
        guild_id: channelContext?.serverId || 'unknown',
        channel_id: channelContext?.channelId || 'unknown',
        invoked_by: messages[messages.length - 1]?.userId,
        command_type: 'chat',
      })
      .select()
      .single()

    if (runError) {
      console.error('Failed to create run:', runError)
      // Continue anyway - don't let tracking failures break the chat
    }

    const runId = run?.id
    console.log('✅ Created run:', runId)

    // Record evidence from channel messages
    if (runId && channelContext?.messages) {
      console.log(`📝 Recording evidence for ${channelContext.messages.length} messages`)
      
      const evidenceRecords = channelContext.messages.slice(-30).map((msg: any) => ({
        run_id: runId,
        message_id: msg.id || `${msg.user}-${msg.time}`,
        channel_id: channelContext.channelId,
        excerpt: msg.content?.substring(0, 500),
        reason: 'context_message',
        confidence: 1.0,
      }))

      const { data, error } = await supabase
        .from('rover_run_evidence')
        .insert(evidenceRecords)

      if (error) {
        console.error('❌ Failed to record evidence:', error)
      } else {
        console.log(`✅ Recorded ${evidenceRecords.length} evidence items`)
      }
    } else {
      console.log('⚠️ No evidence to record:', { runId, hasMessages: !!channelContext?.messages })
    }

    // Build context from channel messages
    let contextPrompt = ""
    if (channelContext) {
      contextPrompt = `\n\n**CURRENT CONTEXT:**
- Channel: #${channelContext.channelName}
- Server: ${channelContext.serverName || "Unknown Server"}
- Message Count: ${channelContext.messages?.length || 0} recent messages

**RECENT CHANNEL MESSAGES:**
${channelContext.messages?.slice(-30).map((msg: any) => 
  `[${msg.time}] ${msg.user}: ${msg.content}`
).join('\n') || "No messages available"}`
    }

    const systemMessage = ROVER_SYSTEM_PROMPT + contextPrompt

    // Get Gemini API key
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    // Call Gemini directly
    const geminiMessages = [
      { role: "user", parts: [{ text: systemMessage }] },
      ...messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    ]

    console.log('🤖 Calling Gemini API...')
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', geminiResponse.status, errorText)
      throw new Error(`Gemini API error: ${geminiResponse.status}`)
    }

    // Mark run as completed
    if (runId) {
      await supabase
        .from('rover_runs')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', runId)
    }

    // Stream the response back
    return new Response(geminiResponse.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    })

  } catch (error) {
    console.error('❌ Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})