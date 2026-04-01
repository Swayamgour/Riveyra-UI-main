import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'

export default function Counter({ end, suffix = '', duration = 2.5, style = {}, triggerOnce = true }) {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce })

  return (
    <span ref={ref} style={style}>
      {inView ? <CountUp end={end} duration={duration} suffix={suffix} /> : `0${suffix}`}
    </span>
  )
}