import React from 'react'
import type { VideoOutput } from '../types'
import styles from './Output.module.css'

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function Output({ data }: { data: VideoOutput }) {
  return (
    <div className={styles.root}>

      {/* ── TITLE CARD ── */}
      <div className={styles.titleCard}>
        <div>
          <div className={styles.titleLabel}>Your Generated Video</div>
          <h2 className={styles.videoTitle}>{data.title}</h2>
          <p className={styles.logline}>{data.logline}</p>
        </div>
        <div className={styles.metaCol}>
          {[['Duration', data.duration], ['Resolution', '4K Ultra HD'], ['Genre', data.genre], ['Mood', data.mood]].map(([k, v]) => (
            <div key={k} className={styles.metaRow}>{k} <span>{v}</span></div>
          ))}
        </div>
      </div>

      {/* ── CHARACTERS ── */}
      <Card tag="Characters" title="Consistency-Locked Profiles">
        <div className={styles.charGrid}>
          {data.characters.map(c => (
            <div key={c.name} className={styles.charCard}>
              <div className={styles.avatar}>{initials(c.name)}</div>
              <div className={styles.charName}>{c.name}</div>
              <div className={styles.charRole}>{c.role}</div>
              <div className={styles.charDesc}>{c.appearance}</div>
              <div className={styles.charDivider} />
              <div className={styles.traitLabel}>Personality</div>
              <div className={styles.traitVal}>{c.personality}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── SCENES ── */}
      <Card tag="Scene Breakdown" title={`${data.scenes.length} Scenes · Full Structure`}>
        {data.scenes.map((scene, i) => (
          <div key={i} className={styles.sceneRow}>
            <div className={styles.sceneNum}>S{String(i + 1).padStart(2, '0')}</div>
            <div>
              <div className={styles.sceneTitle}>{scene.title}</div>
              <div className={styles.sceneMeta}>{scene.location} · {scene.time} · {scene.duration}</div>
              <div className={styles.sceneDesc}>{scene.description}</div>
              <div className={styles.tags}>
                {scene.characters.map(c => <span key={c} className={styles.tagPill}>{c}</span>)}
                <span className={`${styles.tagPill} ${styles.tagMood}`}>{scene.mood}</span>
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* ── SCRIPT ── */}
      <Card tag="Script" title="Opening Sequence — Cinematic Script">
        {data.script.map((line, i) => (
          <div key={i} className={styles.scriptBlock}>
            <div className={styles.scriptType}>{line.type}</div>
            {line.speaker && <div className={styles.speaker}>{line.speaker}</div>}
            <div className={line.type === 'DIALOGUE' ? styles.dialogueTxt : styles.actionTxt}>{line.text}</div>
          </div>
        ))}
      </Card>

      {/* ── SHOTS ── */}
      <Card tag="Shot List" title="Director's Camera Plan">
        {data.shots.map((shot, i) => (
          <div key={i} className={styles.shotRow}>
            <span className={styles.shotCode}>{shot.code}</span>
            <div className={styles.shotDesc}>{shot.description}</div>
          </div>
        ))}
      </Card>

      {/* ── MONETIZATION ── */}
      <Card tag="Monetization" title="Revenue & Publishing Strategy">
        <div className={styles.monoGrid}>
          {data.monetization.map((m, i) => (
            <div key={i} className={styles.monoItem}>
              <div className={styles.monoLabel}>{m.label}</div>
              <div className={styles.monoVal}>{m.value}</div>
            </div>
          ))}
        </div>
        <div className={styles.publishingTip}>{data.publishingTip}</div>
        <div className={styles.exportRow}>
          <button className={styles.expBtn}>⬇ Export Full Package</button>
          <button className={styles.expBtn}>📄 Script PDF</button>
          <button className={styles.expBtn}>🎬 Render Queue</button>
          <span className={styles.renderInfo}>4K · H.265 · Monetization-safe</span>
        </div>
      </Card>

    </div>
  )
}

function Card({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <span className={styles.ctag}>{tag}</span>
        <span className={styles.ctitle}>{title}</span>
      </div>
      <div className={styles.cardBody}>{children}</div>
    </div>
  )
}
