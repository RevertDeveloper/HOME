import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, ZoomIn, X, CheckCircle2, Minus, Plus, RotateCcw } from 'lucide-react'
import type { AppItem } from '../types/app.ts'

// Importar imágenes locales para asegurar que Vite las procese y hashee para producción
import ragJuridicoImg from '../assets/rag-juridico.png'
import transcriptorImg from '../assets/transcriptor.png'
import clarkImg from '../assets/clark.png'
import chatIaLocalImg from '../assets/chat-ia-local.png'

const localImages: Record<string, string> = {
  '/assets/rag-juridico.png': ragJuridicoImg,
  '/assets/transcriptor.png': transcriptorImg,
  '/assets/clark.png': clarkImg,
  '/assets/nc-elevacion.png': clarkImg,
  '/assets/chat-ia-local.png': chatIaLocalImg,
}

interface AppCardProps {
  app: AppItem
}

const categoryLabels: Record<AppItem['category'], string> = {
  ai: 'Inteligencia Artificial',
  blockchain: 'Blockchain',
  enterprise: 'Producto B2B',
}

const categoryAccents: Record<AppItem['category'], { border: string; badge: string; glow: string }> = {
  ai: {
    border: 'border-cyan-500/20 hover:border-cyan-500/40',
    badge: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    glow: 'from-cyan-500/8 via-transparent to-violet-500/5',
  },
  blockchain: {
    border: 'border-violet-500/20 hover:border-violet-500/40',
    badge: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    glow: 'from-violet-500/8 via-transparent to-purple-500/5',
  },
  enterprise: {
    border: 'border-amber-500/20 hover:border-amber-500/40',
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    glow: 'from-amber-500/8 via-transparent to-orange-500/5',
  },
}

// Highlights por app para mostrar ventajas clave
const appHighlights: Record<string, string[]> = {
  'asistente-juridico': [
    'Más de 12.000 disposiciones y 600.000 artículos',
    'Cerca de 700.000 vectores indexados',
    'Respuestas trazables hasta las fuentes del BOE',
    'PostgreSQL y Qdrant como base documental',
  ],
  'transcriptor': [
    'Grabación y subida de audio desde el navegador',
    'Whisper y LLM sobre infraestructura propia',
    'Procesamiento asíncrono de trabajos largos',
    'Retención controlada y privacidad del dato',
  ],
  'clark': [
    'Catálogo, filtros y comparador responsive',
    'Flujo B2B orientado a solicitudes de presupuesto',
    'Asistente RAG con navegación contextual',
    'Next.js, PostgreSQL, pgvector e IA local',
  ],
  'chat-ia-local': [
    'Online a demanda, offline en local',
    'Interfaz OpenUI similar a ChatGPT',
    'Modelos de IA ejecutados localmente',
    'Privacidad y control total de los datos',
  ],
}

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.5

interface ImageLightboxProps { imageUrl: string; appName: string; open: boolean; onClose: () => void }

function ImageLightbox({ imageUrl, appName, open, onClose }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ distance: number; zoom: number } | null>(null)
  const drag = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null)
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      const oldOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = oldOverflow }
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  const closeLightbox = () => {
    setZoom(MIN_ZOOM)
    setPosition({ x: 0, y: 0 })
    pointers.current.clear()
    pinch.current = null
    drag.current = null
    onClose()
  }

  const setZoomSafely = (value: number) => {
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
    setZoom(next)
    if (next === MIN_ZOOM) setPosition({ x: 0, y: 0 })
  }
  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom }
      drag.current = null
    } else if (zoom > MIN_ZOOM) {
      drag.current = { x: event.clientX, y: event.clientY, originX: position.x, originY: position.y }
    }
  }
  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      setZoomSafely(pinch.current.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.distance))
    } else if (drag.current && zoom > MIN_ZOOM) {
      setPosition({ x: drag.current.originX + event.clientX - drag.current.x, y: drag.current.originY + event.clientY - drag.current.y })
    }
  }
  const pointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    if (!pointers.current.size) drag.current = null
  }

  return (
    <dialog ref={dialogRef} aria-label={`Vista ampliada de ${appName}`} onCancel={(event) => { event.preventDefault(); closeLightbox() }} onClose={closeLightbox} className="m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-slate-950/95 p-0 text-slate-100 backdrop:bg-slate-950/95">
      <div className="relative flex h-[100dvh] w-full items-center justify-center p-4 sm:p-8">
        <p className="pointer-events-none absolute inset-x-0 top-4 z-10 text-center text-xs text-slate-300">{appName} - {Math.round(zoom * 100)}%</p>
        <div role="application" aria-label="Area de zoom de la imagen" className="flex h-full w-full touch-none select-none items-center justify-center overflow-hidden overscroll-contain" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onWheel={(event) => { event.preventDefault(); setZoomSafely(zoom + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)) }} onDoubleClick={() => setZoomSafely(zoom === MIN_ZOOM ? 2.5 : MIN_ZOOM)}>
          <img src={imageUrl} alt={`${appName} - vista ampliada`} draggable={false} className="pointer-events-none max-h-[calc(100dvh-8rem)] max-w-full rounded-xl object-contain shadow-2xl" style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})` }} />
        </div>
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-1.5 shadow-2xl backdrop-blur">
          <button type="button" aria-label="Reducir zoom" disabled={zoom === MIN_ZOOM} onClick={() => setZoomSafely(zoom - ZOOM_STEP)} className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-200 transition hover:bg-slate-700 disabled:opacity-35"><Minus className="h-5 w-5" aria-hidden="true" /></button>
          <button type="button" aria-label="Restablecer zoom" onClick={() => { setZoomSafely(MIN_ZOOM); setPosition({ x: 0, y: 0 }) }} className="flex h-11 min-w-14 items-center justify-center rounded-xl px-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700"><RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />{Math.round(zoom * 100)}%</button>
          <button type="button" aria-label="Aumentar zoom" disabled={zoom === MAX_ZOOM} onClick={() => setZoomSafely(zoom + ZOOM_STEP)} className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-200 transition hover:bg-slate-700 disabled:opacity-35"><Plus className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <button type="button" aria-label="Cerrar imagen" onClick={closeLightbox} className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/90 text-slate-200 shadow-lg backdrop-blur transition hover:bg-slate-700"><X className="h-5 w-5" aria-hidden="true" /></button>
      </div>
    </dialog>
  )
}

export function AppCard({ app }: AppCardProps) {
  const isOnline = app.status === 'online'
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const accent = categoryAccents[app.category]
  const highlights = appHighlights[app.id] ?? []

  // Usar la imagen importada si existe el mapeo, de lo contrario usar el URL tal cual
  const resolvedImageUrl = (app.image_url && localImages[app.image_url]) || app.image_url

  return (
    <>
      <motion.article
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 30 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`group relative overflow-hidden rounded-3xl border bg-slate-900/40 backdrop-blur-sm transition-all duration-500 ${accent.border}`}
      >
        {/* Ambient glow */}
        <div className={`pointer-events-none absolute -inset-24 bg-linear-to-br ${accent.glow} opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100`} />

        <div className="relative">
          {/* Header bar */}
          <div className="relative flex items-center flex-wrap justify-between border-b border-slate-800/60 px-6 py-4 sm:px-8">
            {/* Category (Left) */}
            <div className="flex-1">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${accent.badge}`}>
                {categoryLabels[app.category]}
              </span>
            </div>

            {/* Centered Name (Center) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
              <h3 className="text-xl font-bold text-white sm:text-2xl whitespace-nowrap">{app.name}</h3>
            </div>

            {/* Mobile Name (Alternative) */}
            <div className="md:hidden w-full order-3 mt-2 text-center">
              <h3 className="text-xl font-bold text-white">{app.name}</h3>
            </div>

            {/* Status (Right) */}
            <div className="flex flex-1 justify-end">
              <span className="inline-flex items-center gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-400 status-online' : 'bg-slate-500'}`}
                />
                <span className={isOnline ? 'text-emerald-400' : 'text-slate-500'}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </span>
            </div>
          </div>

          {/* Content grid: image + abstract side by side on large screens, stacked on mobile */}
          <div className="flex flex-col lg:flex-row">
            {/* Image section */}
            <div className="relative border-b border-slate-800/60 lg:w-1/2 lg:border-b-0 lg:border-r">
              <div className="relative flex items-center justify-center aspect-video overflow-hidden bg-slate-950/75 p-6 lg:aspect-auto lg:h-full">
                {resolvedImageUrl ? (
                  <>
                    <img
                      src={resolvedImageUrl}
                      alt={app.name}
                      className="max-h-full max-w-full rounded-lg object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    {/* Overlay hover para ampliar */}
                    <motion.button
                      type="button"
                      aria-label="Ampliar imagen"
                      onClick={() => setLightboxOpen(true)}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 flex cursor-zoom-in flex-col items-center justify-center gap-2 bg-slate-950/60 backdrop-blur-[2px] transition-opacity"
                    >
                      <ZoomIn className="h-8 w-8 text-cyan-300 drop-shadow" aria-hidden="true" />
                      <span className="rounded-full border border-cyan-300/60 bg-slate-950/40 px-4 py-1.5 text-sm font-semibold tracking-wide text-cyan-100">
                        Ampliar imagen
                      </span>
                    </motion.button>
                  </>
                ) : (
                  <div className="h-full min-h-50 w-full bg-linear-to-br from-slate-800 via-slate-900 to-slate-950" />
                )}
              </div>
            </div>

            {/* Highlights section */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:w-1/2">
              {/* Short description */}
              <div>
                <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                  {app.short_description || app.description.substring(0, 100) + '...'}
                </p>

                {/* Key highlights */}
                {highlights.length > 0 && (
                  <ul className="mt-5 space-y-2.5">
                    {highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-slate-400">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500/70" aria-hidden="true" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Tech tags + Action */}
              <div className="mt-6">
                <ul className="flex flex-wrap gap-2">
                  {app.tech.map((tech) => (
                    <li key={tech} className="rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-300">
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  {isOnline ? (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-cyan-400 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                    >
                      Navegar a esta web
                      <ExternalLink aria-hidden={true} className="h-4 w-4" />
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex min-h-12 cursor-not-allowed items-center rounded-xl border border-slate-700/70 bg-slate-800/50 px-6 text-sm font-semibold text-slate-500"
                    >
                      Aplicación offline
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full description zone */}
          <div className="border-t border-slate-800/60 bg-slate-900/40 p-6 sm:p-8">
            <div className="w-full">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Qué demuestra este proyecto
              </h4>
              <div className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                {app.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-slate-300">
                    {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="text-white font-semibold font-inherit">{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {resolvedImageUrl ? <ImageLightbox imageUrl={resolvedImageUrl} appName={app.name} open={lightboxOpen} onClose={() => setLightboxOpen(false)} /> : null}
    </>
  )
}
