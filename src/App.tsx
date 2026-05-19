import { useState, useRef, useCallback } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [loadMsg, setLoadMsg] = useState(LOAD_MSGS[0])
  const [error, setError] = useState('')
  const [output, setOutput] = useState<VideoOutput | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const startLoad = useCallback(() => {
    let idx = 0
    setLoadMsg(LOAD_MSGS[0])
    timerRef.current = setInterval(() => {
      idx = (idx + 1) % LOAD_MSGS.length
      setLoadMsg(LOAD_MSGS[idx])
    }, 2000)
  }, [])

  const stopLoad = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const generate = useCallback(async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    setOutput(null)
    startLoad()
    try {
      const data = await generateVideoPackage(prompt, genre, duration, mood)
      setOutput(data)
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      stopLoad()
      setLoading(false)
    }
  }, [prompt, genre, duration, mood, startLoad, stopLoad])

  return (
    <div className={styles.page}>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.logo}>LUMORA<span> Studio</span></div>
        <div className={styles.navRight}>
          <span className={styles.navBadge}>4K · AI Video · Monetized</span>
        </div>
      </nav>

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.badge}>
          <div className={styles.bdot} />
          4K · AI-Generated · Monetization-Ready
        </div>
        <h1 className={styles.h1}>
          Tell stories that <em>feel cinematic</em>
        </h1>
        <p className={styles.heroPara}>
          Generate hyper-realistic 4K storytelling videos 10–15 minutes long with consistent
          characters and narrative arcs — built for YouTube monetization.
        </p>
        <div className={styles.stats}>
          {[['4K', 'Ultra HD Output'], ['15 min', 'Max Duration'], ['100%', 'Character Consistency'], ['$0', 'To Start']].map(([v, l]) => (
            <div key={l}>
              <span className={styles.statV}>{v}</span>
              <span className={styles.statL}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STUDIO */}
      <main className={styles.studio}>

        <div className={styles.sectionLabel} style={{ marginBottom: '1rem' }}>AI Scene Generator</div>

        {/* CONTROLS */}
        <div className={styles.controlsGrid}>
          {([
            ['Genre', genre, setGenre, GENRES],
            ['Duration', duration, setDuration, DURATIONS],
            ['Mood', mood, setMood, MOODS],
          ] as [string, string, (v: string) => void, string[][]][]).map(([label, val, setter, opts]) => (
            <div key={label}>
              <div className={styles.ctrlLabel}>{label}</div>
              <select className={styles.select} value={val} onChange={e => setter(e.target.value)}>
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
        </div>

        <textarea
          className={styles.textarea}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate() }}
          placeholder={"Describe your story idea...\n\nExample: A retired soldier returns to the village where he fought 40 years ago. He finds it transformed — children play where battles raged, a café stands where a bunker once was. He meets an old woman who recognises his face. Neither is sure if they were enemies or strangers. As evening falls, they share a meal in silence."}
        />

        <div className={styles.actionRow}>
          <button
            className={styles.btnGold}
            onClick={generate}
            disabled={loading || !prompt.trim()}
          >
            {loading ? '⏳ Generating...' : '✦ Generate My Video'}
          </button>
          <button className={styles.btnGhost} onClick={() => { setPrompt(''); setOutput(null); setError('') }}>
            Clear
          </button>
          <span className={styles.hint}><strong>Ctrl+Enter</strong> to generate</span>
        </div>

        {/* LOADER */}
        {loading && (
          <div className={styles.loader}>
            <div className={styles.spinner} />
            <div className={styles.loadTxt}>{loadMsg}</div>
            <div className={styles.loadSub}>Building scenes · Writing script · Locking characters</div>
          </div>
        )}

        {/* ERROR */}
        {error && <div className={styles.errorBox}>⚠ {error}</div>}

        {/* OUTPUT */}
        <div ref={outputRef}>
          {output && <Output data={output} />}
        </div>

      </main>
    </div>
  )
}
