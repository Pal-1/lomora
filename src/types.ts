export interface Character {
  name: string
  role: string
  appearance: string
  personality: string
}

export interface Scene {
  title: string
  location: string
  time: string
  duration: string
  description: string
  characters: string[]
  mood: string
}

export interface ScriptLine {
  type: 'SCENE HEADING' | 'ACTION' | 'NARRATION' | 'DIALOGUE'
  speaker?: string
  text: string
}

export interface Shot {
  code: string
  description: string
}

export interface MonetizationItem {
  label: string
  value: string
}

export interface VideoOutput {
  title: string
  logline: string
  genre: string
  mood: string
  duration: string
  characters: Character[]
  scenes: Scene[]
  script: ScriptLine[]
  shots: Shot[]
  monetization: MonetizationItem[]
  publishingTip: string
}

export interface GeneratorSettings {
  genre: string
  duration: string
  mood: string
}
