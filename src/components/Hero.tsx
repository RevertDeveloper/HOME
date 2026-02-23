import { motion } from 'framer-motion'

export function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Building the Future of Intelligence
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 max-w-3xl text-lg text-slate-300"
        >
          AI Solutions • Blockchain Architecture • Custom Software
        </motion.p>
        <motion.button
          type="button"
          onClick={onExplore}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 min-h-12 rounded-xl bg-cyan-500 px-6 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          Discover the Ecosystem
        </motion.button>
      </div>
    </section>
  )
}
