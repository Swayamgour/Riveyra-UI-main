import logoSrc from '../../assets/logo.png'

/**
 * Logo — renders the original logo with NO color filter.
 * Props:
 *   height  number (px)
 *   animate boolean — play reveal animation on mount
 */
export default function Logo({ height = 36, animate = false }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      height: height + 4,
      flexShrink: 0,
    }}>
      <img
        src={logoSrc}
        alt="Riveyra Infotech"
        style={{
          height,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          /* NO filter — preserves original colors */
          animation: animate ? 'logoReveal 1.4s cubic-bezier(0.16,1,0.3,1) both' : 'none',
        }}
      />
    </div>
  )
}