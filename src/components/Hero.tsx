import { motion } from 'framer-motion'
import { ArrowDown, Cpu, Database, Shield } from 'lucide-react'

const floatingIcons = [
  { Icon: Cpu, x: '10%', y: '20%', delay: 0, size: 'h-5 w-5' },
  { Icon: Database, x: '85%', y: '30%', delay: 1.5, size: 'h-4 w-4' },
  { Icon: Shield, x: '75%', y: '70%', delay: 3, size: 'h-5 w-5' },
]

export function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-24 sm:px-10 lg:px-14">
      {/* Floating decorative icons */}
      {floatingIcons.map(({ Icon, x, y, delay, size }, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute text-cyan-500/20"
          style={{ left: x, top: y }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon className={size} />
        </motion.div>
      ))}

      <div className="mx-auto max-w-5xl text-center">
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-sm font-medium text-cyan-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 status-online" />
          Software Industrial · IA · Trazabilidad
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl"
        >
          Identificamos problemas.{' '}
          <span className="text-gradient">
            Creamos soluciones.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-400 sm:text-xl"
        >
          Analizamos los cuellos de botella de tu empresa y desarrollamos
          herramientas a medida que <strong className="text-slate-200">multiplican tu productividad</strong>,
          mejoran la calidad y eliminan errores en cada paso del proceso.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <button
            type="button"
            onClick={onExplore}
            className="group min-h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Descubre nuestras soluciones
            <ArrowDown className="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8"
        >
          {[
            { value: '100%', label: 'Datos en local' },
            { value: 'IA', label: 'Modelos propios' },
            { value: '∞', label: 'Escalabilidad' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-gradient-cyan sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
