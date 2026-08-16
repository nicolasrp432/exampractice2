import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function AnchorChips({ anclas = [], className = '' }) {
  if (!anclas.length) return null

  return (
    <motion.div
      className={clsx('flex flex-wrap gap-2', className)}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      animate="visible"
    >
      {anclas.map((ancla, i) => (
        <motion.span
          key={i}
          variants={{
            hidden:  { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
          }}
          whileHover={{ scale: 1.05 }}
          className="anchor-chip cursor-default"
        >
          {ancla}
        </motion.span>
      ))}
    </motion.div>
  )
}
