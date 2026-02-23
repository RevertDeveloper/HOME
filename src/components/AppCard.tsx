import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, LockKeyhole, ZoomIn, X } from 'lucide-react'
import type { AppItem } from '../types/app.ts'

interface AppCardProps {
  app: AppItem
  isAuthenticated: boolean
  onLogin: (url: string) => void
}

const categoryStyles: Record<AppItem['category'], string> = {
  ai: 'border-cyan-400/30 shadow-cyan-500/20',
  blockchain: 'border-violet-400/30 shadow-violet-500/20',
  enterprise: 'border-amber-300/30 shadow-amber-400/20',
}

export function AppCard({ app, isAuthenticated, onLogin }: AppCardProps) {
  const isOnline = app.status === 'online'
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <motion.article
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 18 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className={`group relative overflow-hidden rounded-3xl border bg-slate-900/55 p-6 shadow-xl backdrop-blur ${categoryStyles[app.category]}`}
      >
        <div className="pointer-events-none absolute -inset-24 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 opacity-70 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold text-slate-100">{app.name}</h3>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200">
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}
              />
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Imagen / preview */}
          <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950/75">
            {app.image_url ? (
              <>
                <img
                  src={app.image_url}
                  alt={app.name}
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-110"
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
              <div className="h-full w-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">{app.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {app.tech.map((tech) => (
              <li key={tech} className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            {isAuthenticated ? (
              <a
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Launch App
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => onLogin(app.url)}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-600 px-5 text-sm font-semibold text-slate-100 transition hover:border-slate-400 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Log in to Access
                <LockKeyhole aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.article>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && app.image_url && (
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
                src={app.image_url}
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
