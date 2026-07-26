import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

export function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section id="inicio" className="relative scroll-mt-24 overflow-hidden px-6 pt-10 pb-24 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-6xl text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="hero-visual relative mx-auto w-full"
        >
          <span className="hero-visual__glow" aria-hidden="true" />
          <img
            src="/Hero-Home-2.png?v=2"
            alt="Desarrollo soluciones de software integrales y escalables, integro inteligencia artificial optimizada a medida, gestiono el ciclo completo desde el diseño hasta producción."
            className="hero-visual__image"
            fetchPriority="high"
          />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-slate-400 sm:text-xl"
        >
          <strong className="text-slate-200">Mi nombre es </strong>
          <strong className="font-bold text-white">Carlos Revert</strong> <strong className="text-slate-200">y soy desarrollador Full Stack especializado en IA aplicada.</strong>
          <br />
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
            Ver proyectos en producción
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
            { value: '120B', label: 'Parámetros del mayor modelo local operado' },
            { value: '700K+', label: 'Vectores indexados en producción' },
            { value: 'Full Stack', label: 'Producto, datos e infraestructura' },
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
