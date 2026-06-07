/**
 * NVIDIA NIM API Client
 *
 * OpenAI-compatible chat completions endpoint.
 * Streams responses via ReadableStream for real-time UI.
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface NIMStreamChunk {
  choices: Array<{
    delta: { content?: string; role?: string }
    finish_reason: string | null
    index: number
  }>
}

const NIM_BASE_URL = process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1'
const NIM_API_KEY = process.env.NVIDIA_NIM_API_KEY || ''
const NIM_CHAT_MODEL = process.env.NVIDIA_NIM_CHAT_MODEL || 'meta/llama-3.3-70b-instruct'

/**
 * Create a streaming chat completion via NVIDIA NIM API.
 * Returns a ReadableStream of text chunks.
 */
export async function createChatStream(
  messages: ChatMessage[],
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  }
): Promise<ReadableStream<string>> {
  const model = options?.model || NIM_CHAT_MODEL

  const response = await fetch(`${NIM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${NIM_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
      stream: true,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`NIM API error ${response.status}: ${errorText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()

  return new ReadableStream<string>({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          return
        }

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n').filter(line => line.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6).trim()
          if (data === '[DONE]') {
            controller.close()
            return
          }

          try {
            const parsed: NIMStreamChunk = JSON.parse(data)
            const content = parsed.choices[0]?.delta?.content
            if (content) {
              controller.enqueue(content)
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    },
    cancel() {
      reader.cancel()
    }
  })
}

/**
 * Non-streaming chat completion for quick responses.
 */
export async function createChatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const model = options?.model || NIM_CHAT_MODEL

  const response = await fetch(`${NIM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${NIM_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
      stream: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`NIM API error ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}
