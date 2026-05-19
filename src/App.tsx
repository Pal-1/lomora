import { useState, useRef, useCallback, useEffect } from 'react'
import { generateVideoPackage } from './api'
import Output from './components/Output'
import type { VideoOutput } from './types'
import styles from './App.module.css'

const LOAD_MSGS = [
  'Analysing your story concept...',
  'Designing characters & world...',
  'Writing cinematic scene breakdown...',
  'Crafting script & narration...',
  'Building shot list & storyboard...',
  'Locking character consistency...',
  'Finalising your 4K video plan...',
]

const GENRES = [
  ['cinematic drama', 'Cinematic Drama'],
  ['historical epic', 'Historical Epic'],
  ['sci-fi thriller', 'Sci-Fi Thriller'],
  ['fantasy adventure', 'Fantasy Adventure'],
  ['documentary', 'Documentary'],
  ['mystery noir', 'Mystery Noir'],
  ['romance', 'Romance'],
  ['horror', 'Horror'],
]

const DURATIONS = [
  ['10 minutes', '10 Minutes'],
  ['12 minutes', '12 Minutes'],
  ['15 minutes', '15 Minutes'],
]

const MOODS = [
  ['melancholic and haunting', 'Melancholic'],
  ['tense and suspenseful', 'Tense & Suspenseful'],
  ['hopeful and uplifting', 'Hopeful & Uplifting'],
  ['dark and brooding', 'Dark & Brooding'],
  ['epic and grand', 'Epic & Grand'],
  ['intimate and emotional', 'Intimate & Emotional'],
]

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [genre, setGenre] = useState('cinematic drama')
  const [duration, setDuration] = useState('12 minutes')
  const [mood, setMood] = useState('melancholic and haunting')
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_key') || '')

  const [loading, setLoading] = useState(false)
  const [loadMsg, setLoadMsg] = useState(LOAD_MSGS[0])
  const [error, setError] = useState('')
  const [output, setOutput] = useState<VideoOutput | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Save API key
  useEffect(() => {
    if (apiKey) localStorage.setItem('groq_key', apiKey)
  }, [apiKey])

  const startLoad = useCallback(() => {
    let idx = 0
    setLoadMsg(LOAD_MSGS[0])
    timerRef.current = setInterval(() => {
      idx = (idx + 1) % LOAD_MSGS.length
      setLoadMsg(LOAD_MSGS[idx])
    }, 1800)
  }, [])

  const stopLoad = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const generate = useCallback(async () => {
    if (!prompt.trim()) return

    if (!apiKey || !apiKey.startsWith('gsk_')) {
      setError('Please enter a valid Groq API key (starts with gsk_)')
      return
    }

    setLoading(true)
    setError('')
    setOutput(null)
    startLoad()

    try {
      const data = await generateVideoPackage(prompt, genre, duration, mood, apiKey)
      setOutput(data)
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      stopLoad()
      setLoading(false)
    }
  }, [prompt, genre, duration, mood, apiKey, startLoad, stopLoad])

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>LUMORA<span> Studio</span></div>
        <div className={styles.navRight}>
          <span className={styles.navBadge}>Groq • Fast AI</span>
        </div>
      </nav>

      <div className={styles.hero}>
        <div className={styles.badge}>
          <div className={styles.bdot} /> 4K • AI Video • Monetization Ready
        </div>
        <h1 className={styles.h1}>
          Tell stories that <em>feel cinematic</em>
        </h1>
        <p className={styles.heroPara}>
          Generate hyper-realistic 4K storytelling videos with consistent characters and professional structure.
        </p>
      </div>

      <main className={styles.studio}>
        <div className={styles.sectionLabel}>AI Scene Generator</div>

        {/* Groq API Key Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className={styles.ctrlLabel}>Groq API Key</div>
          <input
            type="password"
            className={styles.textarea}
            placeholder="gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ fontFamily: 'monospace' }}
          />
          <small style={{ color: '#888', marginTop: '4px', display: 'block' }}>
            Get free key from console.groq.com • Saved only in your browser
          </small>
        </div>

        <div className={styles.controlsGrid}>
          {([
            ['Genre', genre, setGenre, GENRES],
            ['Duration', duration, setDuration, DURATIONS],
            ['Mood', mood, setMood, MOODS],
          ] as const).map(([label, val, setter, opts]) => (
            <div key={label}>
              <div className={styles.ctrlLabel}>{label}</div>
              <select className={styles.select} value={val} onChange={e => setter(e.target.value)}>
                {opts.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <textarea
          className={styles.textarea}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your story idea here...\n\nExample: A retired soldier returns to his old village after 40 years..."
          onKeyDown={e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate()
          }}
        />

        <div className={styles.actionRow}>
          <button
            className={styles.btnGold}
            onClick={generate}
            disabled={loading || !prompt.trim() || !apiKey}
          >
            {loading ? '⏳ Generating Cinematic Package...' : '✦ Generate My Video'}
          </button>
          <button className={styles.btnGhost} onClick={() => {
            setPrompt('')
            setOutput(null)
            setError('')
          }}>
            Clear
          </button>
        </div>

        {loading && (
          <div className={styles.loader}>
            <div className={styles.spinner} />
            <div className={styles.loadTxt}>{loadMsg}</div>
          </div>
        )}

        {error && <div className={styles.errorBox}>⚠ {error}</div>}

        <div ref={outputRef}>
          {output && <Output data={output} />}
        </div>
      </main>
    </div>
  )
}