import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface ServiceBadgeProps {
  icon: LucideIcon
  title: string
  description: string
}

export function ServiceBadge({ icon: Icon, title, description }: ServiceBadgeProps) {
  return (
    <motion.article
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 18 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur"
    >
      <Icon aria-hidden="true" className="h-6 w-6 text-cyan-300" />
      <h3 className="mt-4 text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{description}</p>
    </motion.article>
  )
}
