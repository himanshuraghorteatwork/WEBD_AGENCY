import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, MotionConfig, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Globe2,
  Code2,
  Layers,
  Zap,
  Check,
  Plus,
  Minus,
  MessageCircle,
  Send,
  ShieldCheck,
  MousePointer2,
  Star,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  Instagram,
  CheckCircle2,
  Copy,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { services, projects, plans } from './data';
import MotionEffects from './MotionEffects';
import { ThemeProvider, ThemeToggle } from './theme';

const Arrow = () => <ArrowUpRight size={17} />;
const INSTAGRAM_URL = 'https://www.instagram.com/webd_agency/?hl=en';
const INSTAGRAM_DM_URL = 'https://ig.me/m/webd_agency';
const AGENCY_EMAIL = 'webdagency12@gmail.com';
const getGmailComposeUrl = (subject = 'Project Inquiry - WEB-D Agency', body = '') => {
  let url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(AGENCY_EMAIL)}`;
  if (subject) url += `&su=${encodeURIComponent(subject)}`;
  if (body) url += `&body=${encodeURIComponent(body)}`;
  return url;
};
const GMAIL_COMPOSE_URL = getGmailComposeUrl();

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Brand() {
  return (
    <a href="/#home" className="brand" aria-label="WEB-D Agency home">
      <span className="brand-mark">
        w<span>↗</span>
      </span>
      <span>
        WEB-D
        <span className="brand-sub">DIGITAL AGENCY</span>
      </span>
    </a>
  );
}

// Catchy service metadata for enhanced user engagement
const serviceDetails: Record<
  string,
  { badge: string; tags: string[]; icon: ReactNode }
> = {
  'Landing pages': {
    badge: '🔥 High Conversion',
    tags: ['Sub-1s Speed', 'A/B Ready', 'Conversion Copy', 'Lead Capture'],
    icon: <MousePointer2 />,
  },
  'Business websites': {
    badge: '⭐ Brand Authority',
    tags: ['Bespoke UI', 'SEO Structured', 'CMS Handover', 'Multi-Device'],
    icon: <Globe2 />,
  },
  'E-commerce': {
    badge: '🛍️ High ROI Commerce',
    tags: ['Stripe / Shopify', 'Instant Cart', '1-Click Checkout', 'Inventory'],
    icon: <ShoppingBag />,
  },
  'Web applications': {
    badge: '⚡ Custom Full-Stack',
    tags: ['React / Next.js', 'Secure Auth', 'Cloud DB', 'REST / GraphQL'],
    icon: <Code2 />,
  },
  'Website redesign': {
    badge: '✨ Modern Overhaul',
    tags: ['Glass UI / UX', 'Speed Boost', 'Retain SEO', 'Brand Refresh'],
    icon: <RefreshCw />,
  },
  'Care & maintenance': {
    badge: '🛡️ 99.9% Care & Uptime',
    tags: ['24/7 Monitoring', 'Security Patches', 'Speed Audits', 'Monthly Updates'],
    icon: <ShieldCheck />,
  },
};

function MainApp() {
  const [serviceData, setServiceData] = useState(services);
  const [projectData, setProjectData] = useState(projects);

  useEffect(() => {
    for (const [resource, setter] of [
      ['services', setServiceData],
      ['portfolio', setProjectData],
    ] as const) {
      fetch('/api/content/' + resource)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (Array.isArray(d) && d.length) (setter as (v: any) => void)(d);
        })
        .catch(() => {});
    }
  }, []);

  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('All projects');
  const [detail, setDetail] = useState<(typeof projects)[number] | null>(null);
  const [faq, setFaq] = useState<number | null>(0);
  const [chat, setChat] = useState(false);

  // Start project directly via Instagram DM
  const handleSelectService = (_serviceTitle?: string) => {
    window.open(INSTAGRAM_DM_URL, '_blank', 'noopener,noreferrer');
  };

  // Modal accessibility: Escape key and focus trapping
  useEffect(() => {
    if (!detail) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetail(null);
      if (e.key === 'Tab') {
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>('.project-modal button, .project-modal a')
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    document.querySelector<HTMLElement>('.modal-close')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [detail]);

  if (location.pathname === '/admin') return <Admin />;
  const legal = location.pathname === '/privacy' || location.pathname === '/terms';

  return (
    <MotionConfig reducedMotion="user">
      <div className="site">
        <MotionEffects />

        {/* Frosted Glass Sticky Header */}
        <header>
          <div className="container nav">
            <Brand />
            <nav className={menu ? 'open' : ''}>
              {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((n) => (
                <a onClick={() => setMenu(false)} href={`/#${n.toLowerCase()}`} key={n}>
                  {n}
                </a>
              ))}
              <div style={{ display: menu ? 'block' : 'none', marginTop: 12 }}>
                <a
                  href={GMAIL_COMPOSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-email-link"
                  onClick={() => setMenu(false)}
                  title="Compose email to webdagency12@gmail.com in Gmail"
                >
                  <Mail size={15} /> {AGENCY_EMAIL} (Gmail)
                </a>
                <div style={{ marginTop: 12 }}>
                  <ThemeToggle />
                </div>
              </div>
            </nav>

            <div className="nav-actions">
              <a
                href={GMAIL_COMPOSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="email-nav-btn"
                aria-label={`Compose email to WEB-D Agency at ${AGENCY_EMAIL} in Gmail`}
                title={`Compose email to ${AGENCY_EMAIL} in Gmail`}
              >
                <Mail size={16} />
              </a>

              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-nav-btn"
                aria-label="Send message to WEB-D on Instagram"
                title="Send message to @webd_agency on Instagram (https://ig.me/m/webd_agency)"
              >
                <Instagram size={17} />
              </a>

              <ThemeToggle className="desktop-theme-toggle" />
              <a
                className="button small nav-cta button-instagram"
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Start a project via Instagram DM (https://ig.me/m/webd_agency)"
              >
                Start a project <Arrow />
              </a>
              <button
                className="menu-toggle icon-button"
                aria-label="Toggle navigation"
                aria-expanded={menu}
                onClick={() => setMenu(!menu)}
              >
                {menu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </header>

        {legal ? (
          <main id="main-content" className="container legal">
            <span className="eyebrow">WEB-D AGENCY</span>
            <h1>{location.pathname === '/privacy' ? 'Privacy notice' : 'Website terms'}</h1>
            {location.pathname === '/privacy' ? (
              <>
                <p>
                  We collect the contact and project information you submit to respond to your inquiry.
                  Do not include sensitive personal information in your project description.
                </p>
                <p>
                  When database storage is enabled, submissions are retained for project follow-up. Chat
                  messages may be processed by our AI provider when that integration is configured. We do
                  not use advertising trackers on this site.
                </p>
                <p>
                  To request access, correction, or deletion, submit a request through our contact form.
                  Business identity and jurisdiction-specific information will be added before commercial launch.
                </p>
              </>
            ) : (
              <>
                <p>
                  Project concepts, sample reviews, and package outlines on this website are illustrative.
                  Scope, fees, delivery dates, ownership, and support terms are agreed separately in a written
                  project contract.
                </p>
                <p>
                  Do not submit unlawful content or misuse the inquiry and chat services. AI responses are
                  informational; a written proposal confirms project commitments.
                </p>
              </>
            )}
            <a className="button" href="/">
              Back to home <Arrow />
            </a>
          </main>
        ) : (
          <main id="main-content">
            {/* HERO SECTION */}
            <section className="hero" id="home">
              <div className="hero-grid" aria-hidden="true" />
              <div className="hero-beam" aria-hidden="true" />
              <div className="glow glow-one" />
              <div className="glow glow-two" />

              <div className="container hero-content">
                <Reveal>
                  <div className="availability">
                    <span /> ACCEPTING NEW PROJECTS · GLOBAL AVAILABILITY
                  </div>
                  <h1>
                    Websites that
                    <br />
                    grow your <span className="gradient-text">business.</span>
                  </h1>
                  <p className="hero-copy">
                    We turn ambitious ideas into distinctive, high-performance digital experiences.
                    <br className="desktop" />
                    Bespoke design. Tactile glass aesthetics. Made to captivate and convert.
                  </p>
                  <div className="hero-actions">
                    <a
                      className="button button-instagram"
                      href={INSTAGRAM_DM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Start a project on Instagram DM (https://ig.me/m/webd_agency)"
                    >
                      Start a project <Arrow />
                    </a>
                    <a className="button secondary" href="#portfolio">
                      Explore our work <ArrowRight size={17} />
                    </a>
                  </div>
                  <div className="hero-notes">
                    <span>
                      <span className="tiny-dot" /> Built for impact
                    </span>
                    <span>
                      <Globe2 size={14} /> Working worldwide
                    </span>
                    <span>
                      <Code2 size={14} /> Next-gen performance
                    </span>
                  </div>
                </Reveal>

                {/* Hero Stats Glass Badges */}
                <Reveal>
                  <div className="hero-stats-bar" aria-label="Key agency metrics">
                    <div className="hero-stat-pill">
                      <div className="hero-stat-icon">
                        <Star size={16} />
                      </div>
                      <div>
                        <div className="hero-stat-value">4.9 / 5.0</div>
                        <div className="hero-stat-label">Client Satisfaction</div>
                      </div>
                    </div>
                    <div className="hero-stat-pill">
                      <div className="hero-stat-icon">
                        <Zap size={16} />
                      </div>
                      <div>
                        <div className="hero-stat-value">&lt; 1.2s</div>
                        <div className="hero-stat-label">Median Page Load</div>
                      </div>
                    </div>
                    <div className="hero-stat-pill">
                      <div className="hero-stat-icon">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div className="hero-stat-value">100%</div>
                        <div className="hero-stat-label">Bespoke Design</div>
                      </div>
                    </div>
                    <div className="hero-stat-pill">
                      <div className="hero-stat-icon">
                        <Globe2 size={16} />
                      </div>
                      <div>
                        <div className="hero-stat-value">Global</div>
                        <div className="hero-stat-label">Remote Delivery</div>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* 3D Browser Showcase & Orbital Art */}
                <Reveal className="hero-art">
                  <div className="floating-label label-left">
                    <span className="label-icon">
                      <Layers size={18} />
                    </span>
                    <div>
                      Thoughtfully designed
                      <small>Purpose in every pixel & interaction</small>
                    </div>
                  </div>

                  <div className="browser">
                    <div className="browser-bar">
                      <div className="dots">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="browser-url-pill">
                        <Globe2 size={11} />
                        <span>webd-showcase.design</span>
                      </div>
                      <ArrowUpRight size={12} />
                    </div>

                    <div className="mock-site">
                      <div className="mock-nav">
                        <b>
                          nOVA<span>®</span>
                        </b>
                        <div>
                          Studio &nbsp; Work &nbsp; Contact <span>↗</span>
                        </div>
                      </div>
                      <div className="mock-pill">NEXT-GEN DIGITAL CRAFT</div>
                      <h2>
                        Built to stand out.
                        <br />
                        <em>Designed to convert.</em>
                      </h2>
                      <p>
                        We create meaningful experiences for ambitious brands that never stand still.
                      </p>
                      <div className="mock-cta">
                        Discover what’s next <Arrow />
                      </div>

                      <div className="orbital">
                        <div className="orbit o1" />
                        <div className="orbit o2" />
                        <div className="orbit o3" />
                        <div className="orb-core" />
                      </div>

                      <div className="mock-bottom">
                        <span>CREATIVE THINKING. TACTILE ENGINEERING.</span>
                        <span>INTERACTIVE 3D PREVIEW ↓</span>
                      </div>
                    </div>
                  </div>

                  <div className="floating-label label-right">
                    <span className="label-icon green">
                      <Zap size={19} />
                    </span>
                    <div>
                      Engineered for speed
                      <small>99/100 Core Web Vitals guarantee</small>
                    </div>
                  </div>

                  <div className="art-caption">
                    <span>YOUR AMBITION. OUR CRAFT.</span>
                    <span>ENDLESS POSSIBILITIES ↗</span>
                  </div>
                </Reveal>
              </div>
            </section>

            {/* UNLIMITED CONTINUOUS MARQUEE TICKER */}
            <div className="principles">
              <div className="marquee-container">
                {[0, 1].map((copyIndex) => (
                  <div className="marquee-content" key={copyIndex}>
                    <span className="marquee-item">
                      <i>✦</i> BESPOKE WEB ARCHITECTURE
                    </span>
                    <span className="marquee-item">
                      <i>✦</i> ULTRA-FAST PERFORMANCE
                    </span>
                    <span className="marquee-item">
                      <i>✦</i> TACTILE GLASS UI / UX
                    </span>
                    <span className="marquee-item">
                      <i>✦</i> HIGH-CONVERSION LANDING PAGES
                    </span>
                    <span className="marquee-item">
                      <i>✦</i> ENTERPRISE SCALABILITY
                    </span>
                    <span className="marquee-item">
                      <i>✦</i> 99/100 LIGHTHOUSE SCORE
                    </span>
                    <span className="marquee-item">
                      <i>✦</i> 24/7 DEDICATED CARE
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SERVICES SECTION */}
            <section id="services" className="section container">
              <Reveal className="section-heading">
                <div>
                  <span className="eyebrow">01 / WHAT WE DO</span>
                  <h2>
                    Your vision.
                    <br />
                    <span className="muted">Our digital expertise.</span>
                  </h2>
                </div>
                <p>
                  From the initial spark to high-impact launch, we architect digital experiences
                  that captivate your audience and scale your business.
                </p>
              </Reveal>

              <div className="services-grid">
                {serviceData.map((s) => {
                  const details = serviceDetails[s.title] || {
                    badge: '✦ Premium Service',
                    tags: ['Bespoke', 'High Performance', 'Responsive'],
                    icon: <Layers />,
                  };
                  return (
                    <Reveal key={s.title}>
                      <div className="service-card">
                        <div className="card-top">
                          <span className="service-icon">{details.icon}</span>
                          <span className="service-badge">{details.badge}</span>
                        </div>
                        <h3>{s.title}</h3>
                        <p>{s.description}</p>
                        <div className="service-features-list">
                          {details.tags.map((tag) => (
                            <span key={tag} className="service-feature-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          className="card-link"
                          href={INSTAGRAM_DM_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Start this project on Instagram DM (https://ig.me/m/webd_agency)"
                        >
                          Start this project <Arrow />
                        </a>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </section>

            {/* PORTFOLIO / SELECTED CONCEPTS */}
            <section id="portfolio" className="section work-section">
              <div className="container">
                <Reveal className="section-heading">
                  <div>
                    <span className="eyebrow">02 / SELECTED CONCEPTS</span>
                    <h2>
                      Different brands.
                      <br />
                      <span className="muted">Same obsession with craft.</span>
                    </h2>
                  </div>
                  <p>
                    A glimpse into what we create together. Interactive concepts engineered for
                    depth, clarity, and conversion.
                  </p>
                </Reveal>

                <div className="filters">
                  {['All projects', 'Business websites', 'E-commerce', 'Web applications'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={filter === f ? 'active' : ''}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="projects-grid">
                  {projectData
                    .filter((p) => filter === 'All projects' || p.category === filter)
                    .map((p) => (
                      <Reveal key={p.name}>
                        <button className="project-button" onClick={() => setDetail(p)}>
                          <div className={`project-art ${p.color}`}>
                            <div className="project-mini-nav">
                              <b>{p.tag}</b>
                              <span>ABOUT &nbsp; EXPLORE ↗</span>
                            </div>
                            <div className="project-headline">{p.headline}</div>
                            <div className="project-sculpture" />
                            <span className="concept-badge">CLICK FOR PREVIEW</span>
                            <span className="project-open">
                              <Arrow />
                            </span>
                          </div>
                          <div className="project-info">
                            <div>
                              <h3>{p.name}</h3>
                              <p>{p.kind}</p>
                            </div>
                            <Arrow />
                          </div>
                        </button>
                      </Reveal>
                    ))}
                </div>
              </div>
            </section>

            {/* ABOUT US SECTION */}
            <section id="about" className="section container about">
              <Reveal>
                <span className="eyebrow">03 / THE PEOPLE BEHIND THE PIXELS</span>
                <h2>
                  A focused agency.
                  <br />A <span className="gradient-text">bigger perspective.</span>
                </h2>
                <p className="large-copy">
                  We’re WEB-D. A creative digital studio built for companies ready to make their
                  next defining move.
                </p>
                <p>
                  We blend strategy, cutting-edge UI/UX, and robust software engineering to build websites
                  that feel fluid and work hard. We ask thoughtful questions, obsess over micro-interactions,
                  and tailor every line of code to your distinct goals.
                </p>
                <a
                  href={INSTAGRAM_DM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button small button-instagram"
                  title="Start a project on Instagram DM (https://ig.me/m/webd_agency)"
                >
                  Start a project on Instagram <Arrow />
                </a>
              </Reveal>

              <Reveal className="about-art">
                <div className="code-window">
                  <div className="dots">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="code-comment">// Great websites start with deep alignment.</span>
                  <code>
                    <span>const</span> yourNextChapter = {'{'}<br />
                    &nbsp;&nbsp;vision: <em>"Unmistakably authentic"</em>,<br />
                    &nbsp;&nbsp;design: <em>"Purpose in every pixel"</em>,<br />
                    &nbsp;&nbsp;experience: <em>"Effortless across devices"</em>,<br />
                    &nbsp;&nbsp;growth: <em>"Engineered to convert"</em>,<br />
                    &nbsp;&nbsp;velocity: <em>Infinity</em><br />
                    {'}'};
                  </code>
                  <div className="code-bottom">
                    <span className="tiny-dot" /> Hand-crafted with intention. Ready for what’s next.
                  </div>
                </div>
                <span className="about-sticker">
                  Ideas into
                  <br />
                  <b>impact. ↗</b>
                </span>
              </Reveal>
            </section>

            {/* THE DIFFERENCE / BENEFITS */}
            <section className="section container">
              <Reveal className="center-heading">
                <span className="eyebrow">THE WEB-D DIFFERENCE</span>
                <h2>
                  Captivating aesthetics. <span className="muted">Bulletproof engineering.</span>
                </h2>
                <p>We combine design elegance with software rigor to deliver measurable results.</p>
              </Reveal>

              <div className="benefits">
                {[
                  ['Responsive by Nature', 'Seamless, fluid experiences across smartphones, tablets, and ultra-wide screens.'],
                  ['Engineered to be Discovered', 'Semantic architecture, lightning SEO foundations, and social preview optimization.'],
                  ['Performance with Purpose', 'Sub-second loading, optimized asset budgets, and zero unnecessary script bloat.'],
                  ['Intuitive UI/UX Flow', 'Tactile micro-animations, clear typography, and navigation that guides action naturally.'],
                  ['Global Mindset & Agility', 'Asynchronous transparency, rapid feedback cycles, and clear communication worldwide.'],
                ].map(([title, copy], i) => (
                  <Reveal key={title}>
                    <div className="benefit-card">
                      <span className="benefit-number">0{i + 1}</span>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* PROCESS SECTION */}
            <section className="section process-section">
              <div className="container">
                <Reveal className="section-heading">
                  <div>
                    <span className="eyebrow">04 / HOW WE GET THERE</span>
                    <h2>
                      From “what if”
                      <br />
                      <span className="muted">to “it’s live.”</span>
                    </h2>
                  </div>
                  <p>
                    A clear, collaborative sprint process. Transparent milestones at every stage.
                    Zero guesswork. Total momentum.
                  </p>
                </Reveal>

                <div className="process-grid">
                  {[
                    ['Discovery', 'We map out your business objectives, target users, and competitive edge.'],
                    ['Design', 'We craft high-fidelity interactive wireframes and distinctive aesthetic themes.'],
                    ['Development', 'We engineer clean, modular code with responsive layouts and fluid motion.'],
                    ['Testing', 'We audit performance, accessibility standards, cross-browser health, and speed.'],
                    ['Launch', 'We coordinate domain setup, SEO indexing, and production deployment.'],
                    ['Evolution', 'Ongoing support, continuous analytics, and updates to keep you ahead.'],
                  ].map(([title, copy], i) => (
                    <Reveal key={title}>
                      <div className="process-card">
                        <div className="step-top">
                          <span>0{i + 1}</span>
                          <ArrowRight size={17} />
                        </div>
                        <h3>{title}</h3>
                        <p>{copy}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* TESTIMONIAL & TRUST */}
            <section className="section container">
              <Reveal className="testimonial">
                <span className="eyebrow">DESIGN EXCELLENCE · ZERO COMPROMISE</span>
                <div className="quote-mark">“</div>
                <h2>
                  Your next chapter will
                  <br />
                  be our next showcase.
                </h2>
                <p>
                  We believe trust is earned through craft. Every project we touch is treated with
                  the exact care, precision, and performance we demand for our own agency.
                </p>
                <span className="sample-tag">VERIFIED PRODUCTION STANDARDS · 100% HANDCRAFTED</span>
              </Reveal>
            </section>

            {/* FAQ ACCORDION */}
            <section className="section container faq-section">
              <Reveal>
                <span className="eyebrow">05 / FREQUENT QUESTIONS</span>
                <h2>
                  Clear answers.
                  <br />
                  <span className="muted">Transparent process.</span>
                </h2>
                <p>Have a custom idea or specific architectural question?</p>
                <a
                  href={INSTAGRAM_DM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button small button-instagram"
                  style={{ marginTop: 20 }}
                  title="Start a project on Instagram DM (https://ig.me/m/webd_agency)"
                >
                  Start a project on Instagram <Arrow />
                </a>
              </Reveal>

              <div className="faq-list">
                {[
                  [
                    'How much does a custom website cost?',
                    'Pricing is determined by scope: page count, bespoke animations, integrations, database needs, and CMS requirements. We provide a transparent, fixed-price proposal before any work begins.',
                  ],
                  [
                    'How long does a typical build take?',
                    'A focused landing page or marketing website typically takes 10 to 14 days. Full multi-page platforms and custom web applications typically range from 3 to 6 weeks.',
                  ],
                  [
                    'Do you collaborate with international clients?',
                    'Yes! Our agency operates globally across the Americas, Europe, and Asia-Pacific. We provide regular async video walkthroughs, shared dashboards, and scheduled calls in your timezone.',
                  ],
                  [
                    'Will our team be able to edit content easily?',
                    'Absolutely. We can integrate a modern headless CMS or lightweight content dashboard so your team can update copy, images, case studies, and blog posts without touching code.',
                  ],
                  [
                    'Can you redesign our current website?',
                    'Yes. We audit your existing analytics, content structure, and technical stack to pinpoint conversion bottlenecks and rebuild it with fresh UI, glass aesthetics, and instant loading speeds.',
                  ],
                  [
                    'What support do you provide after launch?',
                    'We include complimentary post-launch monitoring, warranty bug fixes, and handover training. We also offer monthly care retainers for ongoing feature additions.',
                  ],
                ].map(([q, a], i) => (
                  <div className="faq-item" key={q}>
                    <button
                      aria-expanded={faq === i}
                      onClick={() => setFaq(faq === i ? null : i)}
                    >
                      {q}
                      {faq === i ? <Minus size={18} /> : <Plus size={18} />}
                    </button>
                    <AnimatePresence initial={false}>
                      {faq === i && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p>{a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>

            {/* START A PROJECT SECTION */}
            <section id="contact" className="section contact-section">
              <div className="container contact-grid">
                <Reveal>
                  <span className="eyebrow">06 / START A PROJECT</span>
                  <h2>
                    Have a vision?
                    <br />
                    Let’s make it <span className="gradient-text">real.</span>
                  </h2>
                  <p>
                    Ready to build something extraordinary? Skip lengthy forms and talk directly with
                    our senior designers and software engineers on Instagram DM for instant scoping, transparent proposals, and immediate momentum.
                  </p>

                  <div className="contact-points">
                    <span>
                      <Globe2 /> Operating globally. Connecting across all time zones.
                    </span>
                    <span>
                      <MessageCircle /> 1-on-1 direct conversation with creative directors.
                    </span>
                    <span>
                      <ShieldCheck /> Non-disclosure guaranteed. Your vision remains strictly yours.
                    </span>
                    <span>
                      <Mail /> Direct inbox: <a
                        href={GMAIL_COMPOSE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-email-link"
                        title="Compose email in Gmail (webdagency12@gmail.com)"
                      >
                        {AGENCY_EMAIL}
                      </a>
                    </span>
                  </div>

                  <div className="contact-channels">
                    {/* Dedicated Instagram Connection Card */}
                    <div className="instagram-connect-card">
                      <div className="instagram-icon-box">
                        <Instagram size={24} />
                      </div>
                      <div className="instagram-info">
                        <h4>Instagram DM</h4>
                        <p>
                          Chat directly with <strong>@webd_agency</strong> on Instagram for instant project inquiry
                        </p>
                      </div>
                      <a
                        href={INSTAGRAM_DM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button small instagram-cta-btn"
                        title="Send message to @webd_agency on Instagram (https://ig.me/m/webd_agency)"
                      >
                        Send message <ArrowUpRight size={14} />
                      </a>
                    </div>

                    {/* Dedicated Email Connection Card */}
                    <div className="email-connect-card">
                      <div className="email-icon-box">
                        <Mail size={22} />
                      </div>
                      <div className="email-info">
                        <h4>Direct Email (Google Mail)</h4>
                        <a
                          href={GMAIL_COMPOSE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="email-address-text"
                          title="Open send email page in Gmail"
                        >
                          {AGENCY_EMAIL}
                        </a>
                        <p>Click to open compose directly in Google Mail</p>
                      </div>
                      <a
                        href={GMAIL_COMPOSE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button small email-cta-btn"
                        title="Compose email to webdagency12@gmail.com in Gmail"
                      >
                        Compose in Gmail <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                </Reveal>

                <Reveal>
                  <StartProjectCard />
                </Reveal>
              </div>
            </section>
          </main>
        )}

        {/* FROSTED GLASS FOOTER */}
        <footer>
          <div className="container">
            <div className="footer-main">
              <div>
                <Brand />
                <p>
                  Digital experiences.
                  <br />
                  Architected for your next chapter.
                </p>
              </div>
              <div>
                <h4>Navigation</h4>
                <a href="/#services">Services</a>
                <a href="/#portfolio">Selected work</a>
                <a href="/#about">About us</a>
                <a href="/#contact">Contact & Inquiry</a>
              </div>
              <div>
                <h4>Direct Communication</h4>
                <a
                  href={GMAIL_COMPOSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-email-link"
                  title="Compose email to webdagency12@gmail.com in Gmail"
                >
                  <Mail size={16} />
                  <span>{AGENCY_EMAIL} (Gmail)</span>
                  <ArrowUpRight size={13} />
                </a>
                <a
                  href={INSTAGRAM_DM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  style={{ marginTop: 10 }}
                >
                  <Instagram size={16} />
                  <span>Send message to @webd_agency</span>
                  <ArrowUpRight size={13} />
                </a>
                <p className="footer-note" style={{ marginTop: 14 }}>
                  Global inquiries answered within 24 hours
                </p>
              </div>
              <div className="footer-invite">
                <span>READY TO ELEVATE YOUR BRAND?</span>
                <a
                  href={INSTAGRAM_DM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Start a project on Instagram DM (https://ig.me/m/webd_agency)"
                >
                  Start a project. <ArrowUpRight />
                </a>
              </div>
            </div>

            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} WEB-D Agency. All rights reserved.</span>
              <div>
                <a href="/privacy">Privacy Notice</a>
                <a href="/terms">Terms of Service</a>
                <span>
                  Crafted with precision. <span className="blue">✦</span>
                </span>
              </div>
            </div>
          </div>
        </footer>

        {/* FLOATING CHAT LAUNCHER & PANEL */}
        <button
          className="chat-launch"
          onClick={() => setChat(!chat)}
          aria-label={chat ? 'Close agency assistant' : 'Open live agency chat'}
        >
          {chat ? <X size={20} /> : <MessageCircle size={20} />}
          {!chat && <span>Ask WEB-D</span>}
        </button>
        {chat && <Chat />}

        {/* INTERACTIVE PROJECT DETAIL MODAL */}
        {detail && (
          <div className="modal-backdrop" onClick={() => setDetail(null)}>
            <section
              role="dialog"
              aria-modal="true"
              aria-label={detail.name}
              className="project-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="icon-button modal-close"
                onClick={() => setDetail(null)}
                aria-label="Close project modal"
              >
                <X size={18} />
              </button>
              <span className="eyebrow">INTERACTIVE CONCEPT PREVIEW</span>
              <div className={`project-art ${detail.color}`}>
                <div className="project-mini-nav">
                  <b>{detail.tag}</b>
                  <span>SELECTED SHOWCASE</span>
                </div>
                <div className="project-headline">{detail.headline}</div>
                <div className="project-sculpture" />
              </div>
              <h2>{detail.name}</h2>
              <p>
                {detail.description} This demonstration represents our approach to branding,
                tactile glass motion, and conversion-optimized layout. We tailor every aesthetic
                system from scratch to fit your business identity.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a
                  href={INSTAGRAM_DM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-instagram"
                  onClick={() => setDetail(null)}
                  title="Start a project on Instagram DM (https://ig.me/m/webd_agency)"
                >
                  Start a project like this <Arrow />
                </a>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setDetail(null)}
                >
                  Close preview
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}

function StartProjectCard() {
  const [copied, setCopied] = useState(false);

  const copyInstagramLink = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(INSTAGRAM_DM_URL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {}
  };

  return (
    <div className="start-project-card">
      <div className="sp-card-glow" />

      <div className="sp-card-header">
        <div className="sp-ig-avatar">
          <Instagram size={28} />
        </div>
        <div className="sp-header-text">
          <div className="sp-status-bar">
            <span className="sp-username">@webd_agency</span>
            <span className="sp-status-badge">
              <span className="pulse-dot" /> Online & Taking Projects
            </span>
          </div>
          <h3 className="sp-main-title">Start a Project with WEB-D</h3>
        </div>
      </div>

      <p className="sp-card-lead">
        Skip the questionnaires and forms. Message us directly on Instagram DM to discuss your ideas, scope, and timeline with our senior designers and software engineers.
      </p>

      {/* Primary CTA Button */}
      <a
        href={INSTAGRAM_DM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="button button-instagram sp-main-cta"
        title="Start a project on Instagram DM (https://ig.me/m/webd_agency)"
      >
        <Instagram size={22} />
        <span>Start a project on Instagram</span>
        <ArrowUpRight size={20} />
      </a>

      {/* Quick Scopes Selector */}
      <div className="sp-scopes-box">
        <span className="sp-scopes-heading">Or select what you want to build:</span>
        <div className="sp-scopes-grid">
          {[
            { label: 'Landing Page', icon: '⚡' },
            { label: 'Full Website', icon: '🌐' },
            { label: 'E-Commerce Store', icon: '🛍️' },
            { label: 'Custom Web App', icon: '🚀' },
            { label: 'UI/UX Redesign', icon: '✨' },
            { label: '3D Motion & Visuals', icon: '🎨' },
          ].map((scope) => (
            <a
              key={scope.label}
              href={INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sp-scope-pill"
              title={`Start ${scope.label} on Instagram DM`}
            >
              <span className="sp-scope-icon">{scope.icon}</span>
              <span className="sp-scope-text">{scope.label}</span>
              <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="sp-actions-row">
        <a
          href={GMAIL_COMPOSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="sp-gmail-action"
          title="Compose direct email in Gmail"
        >
          <Mail size={16} />
          <span>Email: <b>{AGENCY_EMAIL}</b></span>
          <ArrowUpRight size={13} />
        </a>

        <button
          type="button"
          onClick={copyInstagramLink}
          className="sp-copy-action"
          title="Copy direct Instagram DM URL"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Link Copied!' : 'Copy DM Link'}</span>
        </button>
      </div>

      {/* Guarantees */}
      <div className="sp-guarantees">
        <span>
          <ShieldCheck size={14} /> Non-disclosure guaranteed
        </span>
        <span>
          <Zap size={14} /> 24hr proposal turnaround
        </span>
        <span>
          <Globe2 size={14} /> Worldwide availability
        </span>
      </div>
    </div>
  );
}

function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I’m WEB-D’s digital assistant. What kind of website or digital experience are you looking to build?',
    },
  ]);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);

  const chips = [
    'How long does a build take?',
    'What is your design process?',
    'Can you redesign our site?',
    'What tech stack do you use?',
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || busy) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setValue('');
    setBusy(true);

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const d = await r.json();
      if (!r.ok) throw Error();
      setMessages([...next, { role: 'assistant', content: d.reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content:
            'We build landing pages, business websites, e-commerce stores, and custom web applications. You can DM us directly on Instagram @webd_agency or send an email to webdagency12@gmail.com!',
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="chat-panel" aria-label="Agency interactive assistant">
      <div className="chat-heading">
        <span className="tiny-dot" />
        <b>WEB-D Assistant</b>
        <small>Live guided assistant</small>
      </div>
      <div className="chat-messages" aria-live="polite">
        {messages.map((m, i) => (
          <p className={m.role} key={i}>
            {m.content}
          </p>
        ))}
      </div>

      {/* Quick Suggestion Chips */}
      <div className="chat-quick-chips">
        {chips.map((chip) => (
          <button key={chip} type="button" onClick={() => sendMessage(chip)}>
            {chip}
          </button>
        ))}
      </div>

      <div style={{ padding: '8px 16px', background: 'var(--glass-bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, flexWrap: 'wrap', gap: 6 }}>
        <a
          href={INSTAGRAM_DM_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#e1306c', fontWeight: 600 }}
          title="Send message on Instagram (https://ig.me/m/webd_agency)"
        >
          <Instagram size={13} /> Send message on Instagram ↗
        </a>
        <a
          href={GMAIL_COMPOSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--accent)', fontWeight: 600 }}
          title="Compose email to webdagency12@gmail.com in Gmail"
        >
          <Mail size={13} /> {AGENCY_EMAIL} (Gmail)
        </a>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(value);
        }}
      >
        <input
          aria-label="Your message"
          maxLength={2000}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask a question or describe your project…"
        />
        <button className="icon-button" disabled={busy} aria-label="Send message">
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}

function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [resource, setResource] = useState('leads');
  const [data, setData] = useState('[]');
  const [status, setStatus] = useState('');

  const request = async (path: string, options: RequestInit = {}) => {
    const r = await fetch('/api/admin/' + path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    const d = await r.json();
    if (!r.ok) throw Error(d.error || 'Request failed');
    return d;
  };

  const load = async (name: string) => {
    try {
      setData(JSON.stringify(await request(name), null, 2));
      setStatus('');
    } catch (e) {
      setStatus(String(e));
    }
  };

  useEffect(() => {
    request('session')
      .then(() => {
        setAuthenticated(true);
        load('leads');
      })
      .catch(() => {});
  }, []);

  return (
    <div className="admin container">
      <Brand />
      <h1>Agency workspace</h1>
      {!authenticated ? (
        <form
          className="inquiry"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await request('login', { method: 'POST', body: JSON.stringify({ password }) });
              setAuthenticated(true);
              setPassword('');
              load('leads');
            } catch (e) {
              setStatus(String(e));
            }
          }}
        >
          <h3>Secure admin sign in</h3>
          <label>
            Admin password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <button className="button">
            Sign in <Arrow />
          </button>
        </form>
      ) : (
        <>
          <div className="filters">
            {['leads', 'projects', 'portfolio', 'services', 'pricing', 'inquiries'].map((x) => (
              <button
                className={x === resource ? 'active' : ''}
                key={x}
                onClick={() => {
                  setResource(x);
                  load(x);
                }}
              >
                {x}
              </button>
            ))}
            <button
              onClick={async () => {
                await request('logout', { method: 'POST' });
                setAuthenticated(false);
              }}
            >
              Sign out
            </button>
          </div>
          <p>
            Edit the JSON array to manage records. Lead status may be updated here. Keep existing
            record IDs when editing.
          </p>
          <label className="admin-editor">
            {resource}
            <textarea spellCheck={false} value={data} onChange={(e) => setData(e.target.value)} />
          </label>
          <button
            className="button"
            onClick={async () => {
              try {
                await request(resource, {
                  method: 'PUT',
                  body: JSON.stringify(JSON.parse(data)),
                });
                setStatus('Changes saved.');
                load(resource);
              } catch (e) {
                setStatus(String(e));
              }
            }}
          >
            Save changes
          </button>
        </>
      )}
      {status && <p role="status">{status}</p>}
      <a className="text-button" href="/">
        Return to website <Arrow />
      </a>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
