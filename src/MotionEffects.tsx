import { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp, Pause, Play, ChevronDown, Activity, Cpu } from 'lucide-react';

/** Custom Live Cursor with smooth spring interpolation and hover magnetic reaction. */
function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return;

    let targetX = -100;
    let targetY = -100;
    let curX = -100;
    let curY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    const update = () => {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      setPos({ x: curX, y: curY });
      rafId = requestAnimationFrame(update);
    };

    const handleHoverCheck = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('textarea') ||
          target.closest('.service-card') ||
          target.closest('.project-button') ||
          target.closest('.form-option-pill') ||
          target.closest('.hero-stat-pill') ||
          target.closest('.theme-toggle'))
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', handleHoverCheck, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleHoverCheck);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`custom-cursor-wrap ${hovered ? 'is-hovering' : ''} ${clicked ? 'is-clicked' : ''}`}
      aria-hidden="true"
    >
      <div
        className="cursor-dot"
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      />
      <div
        className="cursor-ring"
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      />
      <div
        className="cursor-aura"
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      />
    </div>
  );
}

/** Side Viewport Rails & 3D Floating Geometry to decorate empty side spaces on widescreen displays. */
function SideMotionRails({ scrollPercent }: { scrollPercent: number }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <>
      {/* LEFT VIEWPORT SIDE RAIL */}
      <aside className="side-rail side-rail-left" aria-hidden="true">
        <div className="side-rail-track">
          <div
            className="side-energy-bead"
            style={{ top: `${Math.min(95, Math.max(5, scrollPercent))}%` }}
          />
        </div>

        {/* 3D Rotating Wireframe Cube in Left Gutter */}
        <div className="side-3d-scene">
          <div className="side-3d-cube">
            <div className="cube-face front" />
            <div className="cube-face back" />
            <div className="cube-face left" />
            <div className="cube-face right" />
            <div className="cube-face top" />
            <div className="cube-face bottom" />
          </div>
        </div>

        <div className="side-rail-text">
          <span>WEB-D // DIGITAL ARCHITECTURE // 2026</span>
        </div>
      </aside>

      {/* RIGHT VIEWPORT SIDE RAIL */}
      <aside className="side-rail side-rail-right" aria-hidden="true">
        <div className="side-rail-track">
          <div
            className="side-energy-bead right-bead"
            style={{ top: `${Math.min(95, Math.max(5, 100 - scrollPercent))}%` }}
          />
        </div>

        {/* 3D Rotating Octahedron / Diamond in Right Gutter */}
        <div className="side-3d-scene">
          <div className="side-3d-diamond">
            <div className="diamond-ring ring-1" />
            <div className="diamond-ring ring-2" />
            <div className="diamond-ring ring-3" />
            <div className="diamond-core" />
          </div>
        </div>

        <div className="side-telemetry">
          <div className="side-telemetry-item">
            <Cpu size={10} />
            <span>60 FPS</span>
          </div>
          <div className="side-telemetry-item">
            <Activity size={10} />
            <span>&lt;1.2s</span>
          </div>
        </div>

        <div className="side-rail-text side-rail-text-right">
          <span>SYSTEM: OPTIMIZED // FLUID MOTION</span>
        </div>
      </aside>
    </>
  );
}

/** Decorative background, live motion HUD, and bottom-left animated scroll percentage widget. */
export default function MotionEffects() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem('webd-pause-background') === 'true';
    } catch {
      return false;
    }
  });
  const [scrolled, setScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Calculate real-time scroll percentage
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((window.scrollY / docHeight) * 100)));
        setScrollPercent(pct);
      }
      setScrolled(window.scrollY > 300);
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setIsScrolling(false), 800);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Sync motion paused state
  useEffect(() => {
    document.documentElement.classList.toggle('motion-paused', paused || !!reduced);
    try {
      localStorage.setItem('webd-pause-background', String(paused));
    } catch {
      /* storage optional */
    }
    return () => document.documentElement.classList.remove('motion-paused');
  }, [paused, reduced]);

  // Active section spy for header navigation
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('header nav a'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          links.forEach((link) => {
            if (link.hash === '#' + visible.target.id) {
              link.setAttribute('aria-current', 'location');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.1, 0.3] }
    );

    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Smooth mouse spotlight follower for interactive specular highlights on glass cards
  useEffect(() => {
    if (reduced) return;
    let frameId: number;
    let curX = 50;
    let curY = 30;
    let targetX = 50;
    let targetY = 30;

    const onPointerMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    };

    const update = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      document.documentElement.style.setProperty('--mouse-x', `${curX.toFixed(2)}%`);
      document.documentElement.style.setProperty('--mouse-y', `${curY.toFixed(2)}%`);
      frameId = requestAnimationFrame(update);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    frameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(frameId);
    };
  }, [reduced]);

  // Click handler for the scroll widget: scroll to next section or top if near bottom
  const handleScrollClick = () => {
    if (scrollPercent >= 95) {
      window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
    } else {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id], header'));
      const currentPos = window.scrollY + 120;
      const nextSection = sections.find((s) => s.offsetTop > currentPos);
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
      } else {
        window.scrollBy({ top: window.innerHeight * 0.7, behavior: reduced ? 'instant' : 'smooth' });
      }
    }
  };

  // Circular progress calculations for SVG ring
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (scrollPercent / 100) * circumference;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      {/* Live Custom Cursor Follower */}
      <CustomCursor />

      {/* Left and Right Side Rails & 3D Objects */}
      <SideMotionRails scrollPercent={scrollPercent} />

      {/* Top Iridescent Reading Progress Bar */}
      <motion.div
        aria-hidden="true"
        className="reading-progress"
        style={{ scaleX: reduced ? scrollYProgress : smoothProgress }}
      />

      {/* Multi-layered Animated Ambient Background */}
      <div className="ambient-background" aria-hidden="true">
        {/* Cursor Spotlight Layer */}
        <div className="ambient-spotlight" />

        {/* Floating Glowing Aurora Orbs */}
        <div className="ambient-orb ambient-blue" />
        <div className="ambient-orb ambient-purple" />
        <div className="ambient-orb ambient-cyan" />
        <div className="ambient-orb ambient-rose" />

        {/* Animated Cyber Glass Grid Overlay */}
        <div className="ambient-grid-overlay" />

        {/* Floating Light Shimmer Stars & Bokeh */}
        <div className="ambient-stars">
          {Array.from({ length: 28 }, (_, i) => {
            const left = (i * 31 + 7) % 100;
            const top = (i * 27 + 13) % 100;
            const size = (i % 3) + 2;
            const duration = 6 + (i % 7);
            const delay = -(i * 0.8);
            return (
              <i
                key={i}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* UNIQUE ANIMATED SCROLL PERCENTAGE WIDGET (BOTTOM-LEFT HUD) */}
      <aside
        className={`scroll-hud-widget ${isScrolling ? 'is-active' : ''}`}
        aria-label="Page reading progress"
      >
        <button
          type="button"
          onClick={handleScrollClick}
          className="scroll-hud-ring-btn"
          title={scrollPercent >= 95 ? 'Back to top' : 'Scroll down to next section'}
          aria-label={`Scrolled ${scrollPercent} percent. ${scrollPercent >= 95 ? 'Click to jump to top' : 'Click to scroll down'}`}
        >
          {/* Sonar / Radar ripple animation */}
          <span className="scroll-hud-sonar" />
          <span className="scroll-hud-sonar delay" />

          {/* SVG Circular Progress Ring */}
          <svg className="scroll-hud-svg" viewBox="0 0 54 54">
            <defs>
              <linearGradient id="hudRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d5ff" />
                <stop offset="50%" stopColor="#0084ff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Background Track Ring */}
            <circle
              className="scroll-hud-track"
              cx="27"
              cy="27"
              r={radius}
            />

            {/* Live Progress Ring */}
            <circle
              className="scroll-hud-meter"
              cx="27"
              cy="27"
              r={radius}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeOffset,
              }}
            />
          </svg>

          {/* Central Percentage Counter */}
          <div className="scroll-hud-number">
            <span>{scrollPercent}</span>
            <small>%</small>
          </div>
        </button>

        {/* HUD Info & Controls Pill */}
        <div className="scroll-hud-details">
          <div className="scroll-hud-label-row">
            <span className="scroll-hud-live-tag">
              <span className="hud-pulse-dot" />
              {scrollPercent >= 98 ? 'COMPLETE' : 'SCROLLED'}
            </span>
          </div>

          <div className="scroll-hud-actions">
            {!reduced && (
              <button
                type="button"
                className="scroll-hud-action-btn"
                onClick={() => setPaused(!paused)}
                aria-label={paused ? 'Resume animations' : 'Pause animations'}
                title={paused ? 'Resume animations' : 'Pause animations'}
              >
                {paused ? <Play size={11} /> : <Pause size={11} />}
                <span>{paused ? 'Play' : 'Pause'}</span>
              </button>
            )}
            <button
              type="button"
              className="scroll-hud-action-btn"
              onClick={handleScrollClick}
              title={scrollPercent >= 95 ? 'Back to top' : 'Next section'}
            >
              {scrollPercent >= 95 ? <ArrowUp size={11} /> : <ChevronDown size={11} />}
              <span>{scrollPercent >= 95 ? 'Top' : 'Next'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Floating Back to Top Quick Action (Bottom-Right) */}
      {scrolled && (
        <button
          type="button"
          className="back-to-top"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })}
          title="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}
