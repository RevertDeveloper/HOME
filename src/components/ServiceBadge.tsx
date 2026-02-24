import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface ServiceBadgeProps {
  icon: LucideIcon
  title: string
  description: string
  gradient?: string
}

export function ServiceBadge({ icon: Icon, title, description, gradient = 'from-cyan-500/10 to-cyan-500/5' }: ServiceBadgeProps) {
  return (
    <motion.article
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 24 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/70 glow-hover"
    >
      {/* Background gradient on hover */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

      <div className="relative">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/80">
          <Icon aria-hidden="true" className="h-5 w-5 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-100">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
    </motion.article>
  )
}
