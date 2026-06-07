import { createChatStream, type ChatMessage } from '@/lib/ai/nim-client'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, model, temperature, maxTokens } = body as {
      messages: ChatMessage[]
      model?: string
      temperature?: number
      maxTokens?: number
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check API key is configured
    if (!process.env.NVIDIA_NIM_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const stream = await createChatStream(messages, { model, temperature, maxTokens })

    // Convert our string stream to a byte stream for the Response
    const encoder = new TextEncoder()
    const responseStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader()
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(encoder.encode(value))
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Stream error'
          controller.enqueue(encoder.encode(`\n[ERROR: ${message}]`))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
