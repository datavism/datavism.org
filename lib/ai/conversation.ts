/**
 * Conversation state management for DATAVISM AI interactions.
 * Handles message history and persistence.
 */

export interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface Conversation {
  id: string
  messages: Message[]
  missionId?: string
  createdAt: number
  updatedAt: number
}

/** Generate a unique message ID */
export function createMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/** Generate a unique conversation ID */
export function createConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/** Create a new empty conversation */
export function createConversation(missionId?: string): Conversation {
  return {
    id: createConversationId(),
    messages: [],
    missionId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

/** Add a message to a conversation (immutable) */
export function addMessage(
  conversation: Conversation,
  role: Message['role'],
  content: string
): Conversation {
  const message: Message = {
    id: createMessageId(),
    role,
    content,
    timestamp: Date.now(),
  }

  return {
    ...conversation,
    messages: [...conversation.messages, message],
    updatedAt: Date.now(),
  }
}

/** Get messages formatted for the NIM API (without IDs/timestamps) */
export function getAPIMessages(conversation: Conversation): Array<{ role: string; content: string }> {
  return conversation.messages.map(m => ({
    role: m.role,
    content: m.content,
  }))
}

/** Save conversation to localStorage */
export function saveConversation(conversation: Conversation): void {
  try {
    const key = `datavism-conversation-${conversation.id}`
    localStorage.setItem(key, JSON.stringify(conversation))

    // Update conversation index
    const indexKey = 'datavism-conversations-index'
    const index: string[] = JSON.parse(localStorage.getItem(indexKey) || '[]')
    if (!index.includes(conversation.id)) {
      index.push(conversation.id)
      localStorage.setItem(indexKey, JSON.stringify(index))
    }
  } catch {
    // localStorage not available
  }
}

/** Load a conversation from localStorage */
export function loadConversation(id: string): Conversation | null {
  try {
    const key = `datavism-conversation-${id}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}
