import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, LockKeyhole, ZoomIn, X, CheckCircle2 } from 'lucide-react'
import type { AppItem } from '../types/app.ts'

// Importar imágenes locales para asegurar que Vite las procese y hashee para producción
import ragJuridicoImg from '../assets/rag-juridico.png'
import transcriptorImg from '../assets/transcriptor.png'
import chatIaLocalImg from '../assets/chat-ia-local.png'

const localImages: Record<string, string> = {
  '/assets/rag-juridico.png': ragJuridicoImg,
  '/assets/transcriptor.png': transcriptorImg,
  '/assets/chat-ia-local.png': chatIaLocalImg,
}

interface AppCardProps {
  app: AppItem
  isAuthenticated: boolean
  isLoading?: boolean
  onLogin: (url: string) => void
}

const categoryLabels: Record<AppItem['category'], string> = {
  ai: 'Inteligencia Artificial',
  blockchain: 'Blockchain',
  enterprise: 'Empresarial',
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
  'rag-juridico': [
    'Legislación consolidada completa del BOE',
    'Respuestas con fuentes verificables y enlaces directos',
    'Modelo de IA ejecutado en local — sin filtraciones',
    'Adaptable a cualquier normativa sectorial',
  ],
  'transcriptor': [
    '5 modos especializados para cada tipo de audio',
    'Transcripción + procesamiento inteligente',
    'Informes automáticos listos para compartir',
    'Ideal para reuniones, terapia, brainstorming y más',
  ],
  'chat-ia-local': [
    'Privacidad total — ningún dato sale de tu empresa',
    'Compatible con herramientas personalizadas',
    'Alternativa segura a ChatGPT para empresas',
    'Escalable con nuevos modelos y funcionalidades',
  ],
}

export function AppCard({ app, isAuthenticated, isLoading = false, onLogin }: AppCardProps) {
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
        <div className={`pointer-events-none absolute -inset-24 bg-gradient-to-br ${accent.glow} opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100`} />

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
                  <div className="h-full min-h-[200px] w-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
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
                  {isLoading ? (
                    <div className="h-12 w-40 rounded-xl shimmer" />
                  ) : isAuthenticated ? (
                    <a
                      href={app.url}
                      className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                    >
                      Acceder a la aplicación
                      <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onLogin(app.url)}
                      className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-600 px-6 text-sm font-semibold text-slate-100 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                    >
                      Iniciar sesión para acceder
                      <LockKeyhole aria-hidden="true" className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full description zone */}
          <div className="border-t border-slate-800/60 bg-slate-900/40 p-6 sm:p-8">
            <div className="w-full">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Sobre esta solución
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && resolvedImageUrl && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="relative max-h-[90vh] max-w-[95vw] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={resolvedImageUrl}
                alt={`${app.name} – vista ampliada`}
                className="block max-h-[90vh] max-w-[95vw] object-contain"
              />
              <button
                type="button"
                aria-label="Cerrar imagen"
                onClick={() => setLightboxOpen(false)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-slate-200 backdrop-blur transition hover:bg-slate-700"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
