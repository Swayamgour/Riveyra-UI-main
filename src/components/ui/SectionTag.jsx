import { motion } from 'framer-motion'

export default function SectionTag({ children, delay = 0 }) {
  return (
    <motion.div
      className="stag"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}