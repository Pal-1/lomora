import type { VideoOutput } from './types'

const SYSTEM_PROMPT = `You are LUMORA, a world-class AI cinematic video production system. 
Return ONLY a raw JSON object — no markdown, no backticks, no explanation. 
Use exactly this structure:

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
    { "type": "SCENE HEADING or ACTION or NARRATION or DIALOGUE", "speaker": "only for DIALOGUE", "text": "string" }
  ],
  "shots": [
    { "code": "SHOT TYPE e.g. ECU / WS / OTS", "description": "string" }
  ],
  "monetization": [
    { "label": "string", "value": "string" }
  ],
  "publishingTip": "2-3 sentences"
}

Rules: 6-8 scenes, 8-12 script blocks, 8-10 shots, 2-4 characters. Make it cinematic.`;

export async function generateVideoPackage(
  storyPrompt: string,
  genre: string,
  duration: string,
  mood: string,
  apiKey: string
): Promise<VideoOutput> {
  
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    throw new Error('Please enter a valid Groq API key (starts with gsk_)')
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 6000,
      temperature: 0.85,
      response_format: { type: "json_object" },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { 
          role: 'user', 
          content: `Story Idea: ${storyPrompt}\nGenre: ${genre}\nDuration: ${duration}\nMood: ${mood}\n\nGenerate full cinematic video package.` 
        }
      ]
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Groq API Error: ${response.status}`)
  }

  const result = await response.json()
  const content = result.choices?.[0]?.message?.content || ''

  let data: VideoOutput
  try {
    data = JSON.parse(content)
  } catch {
    const match = content.match(/\{[\s\S]*\}/)
    if (match) data = JSON.parse(match[0])
    else throw new Error('Failed to parse response. Try again.')
  }

  return data
}