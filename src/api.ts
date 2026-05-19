import type { VideoOutput } from './types'

const SYSTEM_PROMPT = `You are LUMORA, a world-class AI cinematic video production system. Return ONLY a raw JSON object — no markdown, no backticks, no explanation whatsoever. Use exactly this structure:
{
  "title": "string",
  "logline": "string under 30 words",
  "genre": "string",
  "mood": "string",
  "duration": "string",
  "characters": [
    { "name": "string", "role": "string", "appearance": "2-3 sentence visual description", "personality": "1-2 sentences" }
  ],
  "scenes": [
    { "title": "string", "location": "string", "time": "string", "duration": "timestamp range e.g. 00:00-02:30", "description": "2-3 sentences", "characters": ["names"], "mood": "keyword" }
  ],
  "script": [
    { "type": "SCENE HEADING or ACTION or NARRATION or DIALOGUE", "speaker": "only include for DIALOGUE", "text": "string" }
  ],
  "shots": [
    { "code": "SHOT TYPE e.g. ECU / WS / OTS", "description": "string" }
  ],
  "monetization": [
    { "label": "string", "value": "string" }
  ],
  "publishingTip": "2-3 sentences"
}
Rules: 6-8 scenes. Script covers first 3 minutes with 8-12 blocks. 8-10 shots. 2-4 characters. 6 monetization items. Make it genuinely cinematic and professional.`

export async function generateVideoPackage(
  storyPrompt: string,
  genre: string,
  duration: string,
  mood: string,
): Promise<VideoOutput> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string

  if (!apiKey || apiKey.trim() === '' || apiKey === 'sk-ant-your-key-here') {
    throw new Error('Open the .env file and replace sk-ant-your-key-here with your real Anthropic API key, then restart the dev server.')
  }

  const response = await fetch('/api/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Story: ${storyPrompt}\nGenre: ${genre}\nDuration: ${duration}\nMood: ${mood}\n\nGenerate the full cinematic video production package.` }]
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as any)?.error?.message || `API error: ${response.status}`)
  }

  const result = await response.json()
  const raw: string = (result.content || []).map((c: any) => c.text || '').join('')
  const clean = raw.replace(/```json|```/g, '').trim()

  let data: VideoOutput
  try {
    data = JSON.parse(clean)
  } catch {
    const match = clean.match(/\{[\s\S]*\}/)
    if (match) data = JSON.parse(match[0])
    else throw new Error('Could not parse AI response. Please try again.')
  }

  return data
}
