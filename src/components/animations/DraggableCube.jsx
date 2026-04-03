// src/components/animations/DraggableCube.jsx
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import SectionTag from "../ui/SectionTag";
import Icons from "../ui/Icons";
import { useBreakpoint } from "../../hooks/useBreakpoint.jsx";

const FACES = [
  {
    label: "Web Dev",
    IconComp: Icons.CubeWeb,
    acc: "#60a5fa",
    pos: { transform: "translateZ(90px)" },
  },
  {
    label: "Mobile",
    IconComp: Icons.CubeMobile,
    acc: "#34d399",
    pos: { transform: "rotateY(180deg) translateZ(90px)" },
  },
  {
    label: "AI / ML",
    IconComp: Icons.CubeAI,
    acc: "#c084fc",
    pos: { transform: "rotateY(90deg) translateZ(90px)" },
  },
  {
    label: "ERP",
    IconComp: Icons.CubeERP,
    acc: "#fbbf24",
    pos: { transform: "rotateY(-90deg) translateZ(90px)" },
  },
  {
    label: "Design",
    IconComp: Icons.CubeDesign,
    acc: "#f87171",
    pos: { transform: "rotateX(90deg) translateZ(90px)" },
  },
  {
    label: "Cloud",
    IconComp: Icons.CubeCloud,
    acc: "#34d399",
    pos: { transform: "rotateX(-90deg) translateZ(90px)" },
  },
];

const STATS = [
  { val: "9+", lbl: "Services" },
  { val: "50+", lbl: "Projects" },
  { val: "7+", lbl: "Years" },
  { val: "100%", lbl: "Delivery" },
];

export default function DraggableCube() {
  const { isMobile, isTablet } = useBreakpoint();
  const isStacked = isMobile || isTablet;

  const dragRef = useRef(null);
  const isDragging = useRef(false); // use ref not state — avoids stale closure in pointer events
  const lastX = useRef(0);
  const lastY = useRef(0);
  const autoSpin = useRef(null);
  const [activeFace, setActiveFace] = useState(null);
  const [isHoveringCube, setIsHoveringCube] = useState(false);

  // Spring — snappy but not jittery
  const rotX = useSpring(useMotionValue(-22), { stiffness: 200, damping: 24 });
  const rotY = useSpring(useMotionValue(35), { stiffness: 200, damping: 24 });

  // ── Auto spin — slow and smooth ──
  const startSpin = () => {
    if (autoSpin.current) cancelAnimationFrame(autoSpin.current);
    const tick = () => {
      rotY.set(rotY.get() + 0.6); // slow enough for spring to follow cleanly
      autoSpin.current = requestAnimationFrame(tick);
    };
    autoSpin.current = requestAnimationFrame(tick);
  };
  const stopSpin = () => {
    if (autoSpin.current) {
      cancelAnimationFrame(autoSpin.current);
      autoSpin.current = null;
    }
  };

  useEffect(() => {
    const t = setTimeout(startSpin, 600);
    return () => {
      clearTimeout(t);
      stopSpin();
    };
  }, []);

  // ── UNIFIED pointer handler — works for both mouse and touch ──
  // We use onPointerDown/Move/Up ONLY — remove the separate touch handlers
  // setPointerCapture makes it work reliably on mobile too
  const onPointerDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    stopSpin();
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    try {
      dragRef.current?.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastX.current;
    const dy = e.clientY - lastY.current;
    rotY.set(rotY.get() + dx * 4.5);
    rotX.set(rotX.get() - dy * 4.5);
    lastX.current = e.clientX;
    lastY.current = e.clientY;
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    startSpin();
  };

  // ── Face touch: detect tap on face (mobile hover substitute) ──
  const onFaceTap = (i) => {
    setActiveFace((prev) => (prev === i ? null : i));
  };

  const cubeSize = isMobile ? 140 : isTablet ? 160 : 180;

  return (
    <section
      style={{
        padding: isMobile
          ? "60px 5% 70px"
          : isTablet
            ? "60px 6% 70px"
            : "48px 8% 72px",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="grid-bg"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isStacked ? "1fr" : "1fr 1fr",
          gap: isMobile ? 48 : isTablet ? 56 : 80,
          alignItems: "center",
        }}
      >
        {/* ── CUBE ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: isMobile ? 300 : isTablet ? 360 : 420,
          }}
        >
          <div style={{ position: "relative" }}>
            {/* Ambient glow */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: cubeSize * 2.4,
                height: cubeSize * 2.4,
                borderRadius: "50%",
                background: isHoveringCube
                  ? "radial-gradient(circle,rgba(96,165,250,0.2) 0%,rgba(96,165,250,0.07) 40%,transparent 70%)"
                  : "radial-gradient(circle,rgba(96,165,250,0.08) 0%,transparent 65%)",
                transition: "background 0.4s ease",
                pointerEvents: "none",
              }}
            />

            <div style={{ perspective: isMobile ? 600 : 720 }}>
              <motion.div
                ref={dragRef}
                // Pointer events — handle BOTH mouse and touch uniformly
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                // Desktop hover glow
                onMouseEnter={() => setIsHoveringCube(true)}
                onMouseLeave={() => {
                  setIsHoveringCube(false);
                  onPointerUp();
                }}
                animate={{
                  scale: isHoveringCube && !isDragging.current ? 1.05 : 1,
                }}
                transition={{
                  scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                }}
                style={{
                  width: cubeSize,
                  height: cubeSize,
                  transformStyle: "preserve-3d",
                  cursor: "grab",
                  rotateX: rotX,
                  rotateY: rotY,
                  // Critical: touchAction none so browser doesn't intercept touch for scrolling
                  touchAction: "none",
                  // Prevent text selection during drag
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
                data-hover
              >
                {FACES.map((face, i) => {
                  const tz = cubeSize / 2;
                  const faceTransform = face.pos.transform.replace(
                    "90px",
                    `${tz}px`,
                  );
                  // On mobile use tap-to-activate; on desktop use hover
                  const isActive = isMobile
                    ? activeFace === i
                    : activeFace === i;

                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setActiveFace(i)}
                      onMouseLeave={() => setActiveFace(null)}
                      onTouchStart={() => isMobile && setActiveFace(i)}
                      onTouchEnd={() =>
                        isMobile && setTimeout(() => setActiveFace(null), 800)
                      }
                      style={{
                        position: "absolute",
                        width: cubeSize,
                        height: cubeSize,
                        transform: faceTransform,
                        backfaceVisibility: "hidden",
                        background: isActive
                          ? `linear-gradient(145deg,${face.acc}38,${face.acc}14)`
                          : `linear-gradient(145deg,${face.acc}1e,${face.acc}08)`,
                        border: isActive
                          ? `1.5px solid ${face.acc}90`
                          : `1.5px solid ${face.acc}50`,
                        boxShadow: isActive
                          ? `inset 0 0 28px ${face.acc}22, 0 0 32px ${face.acc}30`
                          : "none",
                        borderRadius: isMobile ? 12 : 16,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        backdropFilter: "blur(12px)",
                        transition:
                          "background 0.25s, border 0.25s, box-shadow 0.25s",
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          color: face.acc,
                          filter: isActive
                            ? `drop-shadow(0 0 18px ${face.acc}) drop-shadow(0 0 6px ${face.acc}aa)`
                            : `drop-shadow(0 0 12px ${face.acc}cc)`,
                          transform: isActive
                            ? "scale(1.18) translateY(-2px)"
                            : "scale(1)",
                          transition: "filter 0.25s, transform 0.25s",
                        }}
                      >
                        <face.IconComp />
                      </div>

                      {/* Label */}
                      <span
                        style={{
                          fontSize: isMobile ? 9 : 11,
                          letterSpacing: 2.5,
                          fontFamily: "var(--font-mono)",
                          color: face.acc,
                          textTransform: "uppercase",
                          fontWeight: 600,
                          opacity: isActive ? 1 : 0.8,
                          transition: "opacity 0.2s",
                        }}
                      >
                        {face.label}
                      </span>

                      {/* Bottom accent bar */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "20%",
                          right: "20%",
                          height: 2,
                          borderRadius: 2,
                          background: `linear-gradient(90deg,transparent,${face.acc},transparent)`,
                          opacity: isActive ? 1 : 0,
                          transition: "opacity 0.25s",
                        }}
                      />
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── TEXT ── */}
        <div>
          <SectionTag>Your Vision. Our Execution.</SectionTag>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(28px,3.6vw,52px)",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              lineHeight: 1.08,
              marginBottom: 22,
            }}
          >
            One Team,
            <br />
            <span className="gt">All Capabilities</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 16,
              lineHeight: 1.85,
              color: "var(--text-body)",
              marginBottom: 32,
              fontFamily: "var(--font-body)",
            }}
          >
            {isMobile
              ? "Six specialisations. One unified team. Tap a face to explore what we do."
              : "Six specialisations. One unified team. Every face of the cube is a discipline we've mastered — spin it, explore it, own it."}
          </motion.p>

          {/* Drag hint */}
         

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.lbl}
                style={{
                  padding: "14px 10px",
                  borderRadius: 10,
                  textAlign: "center",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(96,165,250,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    color: "#60a5fa",
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: 9.5,
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                    marginTop: 5,
                  }}
                >
                  {s.lbl}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
