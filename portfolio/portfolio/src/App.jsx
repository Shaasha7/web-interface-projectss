import { useEffect, useRef, useState } from "react";
import "./App.css";

/* ============================================================
   EDIT YOUR DETAILS HERE
   ============================================================ */
const DATA = {
  name: "Shalini",
  initials: "VS",
  roles: ["Frontend Developer", "React Engineer", "UI Craftsman", "Problem Solver"],
  tagline:
    "I design and build fast, accessible, beautifully animated web experiences that people love to use.",
  location: "Hyderabad, India",
  email: "shalinishamili132005@gmail.com",
  resume: "#",
  socials: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://linkedin.com/" },
    { label: "Twitter", url: "https://x.com/" },
  ],
  stats: [
    { value: 3, suffix: "+", label: "Years experience" },
    { value: 40, suffix: "+", label: "Projects shipped" },
    { value: 25, suffix: "+", label: "Happy clients" },
  ],
  about: [
    "I'm a developer who sits at the intersection of engineering and design. I care about the details: smooth motion, clean typography and code that stays maintainable as products grow.",
    "Currently focused on React, modern CSS and building internal tools that make teams faster. When I'm not coding, I'm exploring new design trends or automating something that didn't need automating.",
  ],
  skills: {
    Frontend: [
      { name: "React", level: 92 },
      { name: "JavaScript / TypeScript", level: 88 },
      { name: "HTML & CSS", level: 95 },
      { name: "Tailwind / Sass", level: 85 },
    ],
    Backend: [
      { name: "Node.js / Express", level: 80 },
      { name: "REST APIs", level: 85 },
      { name: "MongoDB / SQL", level: 75 },
      { name: "Authentication", level: 78 },
    ],
    Tools: [
      { name: "Git & GitHub", level: 90 },
      { name: "Vite / Webpack", level: 80 },
      { name: "Figma", level: 82 },
      { name: "Testing (Jest)", level: 70 },
    ],
  },
  projects: [
    {
      title: "HRMS Dashboard",
      category: "Web App",
      desc: "Employee management portal with leave, payroll and help-desk modules, role-based access and analytics.",
      tags: ["React", "Node", "MongoDB"],
      live: "#",
      code: "#",
      hue: 265,
    },
    {
      title: "Outbound Engine",
      category: "Web App",
      desc: "Lead enrichment and email sequencing workflow builder with drag-and-drop steps and live stats.",
      tags: ["React", "API", "Charts"],
      live: "#",
      code: "#",
      hue: 190,
    },
    {
      title: "Aurora UI Kit",
      category: "Design",
      desc: "A glassmorphism component library with 60+ accessible components and dark/light theming.",
      tags: ["CSS", "Figma", "A11y"],
      live: "#",
      code: "#",
      hue: 320,
    },
    {
      title: "Weatherly",
      category: "Mobile",
      desc: "Minimal weather PWA with animated conditions, hourly forecasts and offline support.",
      tags: ["PWA", "React", "API"],
      live: "#",
      code: "#",
      hue: 40,
    },
    {
      title: "ShopSwift",
      category: "Web App",
      desc: "E-commerce storefront with cart, filters, wishlist and a buttery checkout flow.",
      tags: ["React", "Stripe", "Context"],
      live: "#",
      code: "#",
      hue: 140,
    },
    {
      title: "Brand Refresh",
      category: "Design",
      desc: "Complete visual identity and landing page redesign that lifted sign-ups for a SaaS startup.",
      tags: ["Branding", "UI", "Motion"],
      live: "#",
      code: "#",
      hue: 10,
    },
  ],
  experience: [
    {
      role: "Frontend Developer",
      company: "Zodeck",
      period: "2024 — Present",
      points: [
        "Building HRMS modules used by HR admins and employees daily.",
        "Improved page load times by 40% through code-splitting and caching.",
      ],
    },
    {
      role: "Junior Web Developer",
      company: "Freelance",
      period: "2022 — 2024",
      points: [
        "Delivered 25+ websites and dashboards for small businesses.",
        "Set up reusable component systems to cut build time in half.",
      ],
    },
    {
      role: "B.E. Computer Science",
      company: "University",
      period: "2018 — 2022",
      points: ["Graduated with distinction; led the college web dev club."],
    },
  ],
};

const NAV = ["home", "about", "skills", "projects", "experience", "contact"];

/* ============================================================
   HOOKS
   ============================================================ */

// Types out each role, deletes it, moves to the next
function useTyping(words, speed = 90, pause = 1600) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    let t;
    if (!deleting && text === word) {
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => i + 1);
    } else {
      t = setTimeout(
        () => setText(word.slice(0, text.length + (deleting ? -1 : 1))),
        deleting ? speed / 2 : speed
      );
    }
    return () => clearTimeout(t);
  }, [text, deleting, index, words, speed, pause]);

  return text;
}

// Adds "visible" class to .reveal elements as they scroll into view
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// Tracks which section is on screen for the nav highlight
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

// Page scroll progress 0–100
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */

function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div className="cursor-glow" ref={ref} aria-hidden="true" />;
}

function Counter({ value, suffix }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1400;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [value]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

function SectionTitle({ kicker, title }) {
  return (
    <div className="section-title reveal">
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
    </div>
  );
}

// Card that tilts in 3D following the pointer
function TiltCard({ children, className = "", style }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-y * 10}deg`);
    el.style.setProperty("--ry", `${x * 10}deg`);
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    ref.current.style.setProperty("--rx", "0deg");
    ref.current.style.setProperty("--ry", "0deg");
  };
  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  );
}

/* ============================================================
   SECTIONS
   ============================================================ */

function Navbar({ active, theme, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <a href="#home" className="logo">
        <span className="logo-mark">{DATA.initials}</span>
        <span className="logo-text">{DATA.name}</span>
      </a>

      <nav className={`nav-links ${open ? "open" : ""}`}>
        {NAV.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className={active === id ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {id}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? "☀" : "☾"}
        </button>
        <button
          className={`burger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  const typed = useTyping(DATA.roles);
  return (
    <section id="home" className="hero">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="grid-bg" />

      <div className="hero-content">
        <div className="badge reveal">
          <span className="pulse" /> Available for work
        </div>
        <h1 className="reveal">
          Hi, I'm <span className="gradient-text">{DATA.name}</span>
        </h1>
        <p className="typed reveal">
          {typed}
          <span className="caret">|</span>
        </p>
        <p className="lead reveal">{DATA.tagline}</p>

        <div className="hero-cta reveal">
          <a href="#projects" className="btn btn-primary">
            View my work <span className="arrow">→</span>
          </a>
          <a href={DATA.resume} className="btn btn-ghost">
            Download CV
          </a>
        </div>

        <div className="stats reveal">
          {DATA.stats.map((s) => (
            <div key={s.label} className="stat">
              <strong>
                <Counter value={s.value} suffix={s.suffix} />
              </strong>
              <small>{s.label}</small>
            </div>
          ))}
        </div>
      </div>

      <a href="#about" className="scroll-hint" aria-label="Scroll down">
        <span />
      </a>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <SectionTitle kicker="01 — About" title="A little about me" />
      <div className="about-grid">
        <div className="about-photo reveal">
          <div className="photo-ring">
            <div className="photo-inner">{DATA.initials}</div>
          </div>
          <div className="floating-chip chip-1">⚛ React</div>
          <div className="floating-chip chip-2">✦ UI/UX</div>
        </div>
        <div className="about-text reveal">
          {DATA.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <ul className="about-facts">
            <li>
              <span>Location</span>
              {DATA.location}
            </li>
            <li>
              <span>Email</span>
              {DATA.email}
            </li>
            <li>
              <span>Focus</span>
              React & Frontend
            </li>
            <li>
              <span>Status</span>
              Open to offers
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const tabs = Object.keys(DATA.skills);
  const [tab, setTab] = useState(tabs[0]);
  return (
    <section id="skills" className="section">
      <SectionTitle kicker="02 — Skills" title="What I work with" />
      <div className="tabs reveal">
        {tabs.map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="skills-grid" key={tab}>
        {DATA.skills[tab].map((s, i) => (
          <div
            key={s.name}
            className="skill glass"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="skill-head">
              <span>{s.name}</span>
              <span className="skill-pct">{s.level}%</span>
            </div>
            <div className="bar">
              <div className="bar-fill" style={{ "--w": `${s.level}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const cats = ["All", ...new Set(DATA.projects.map((p) => p.category))];
  const [filter, setFilter] = useState("All");
  const list =
    filter === "All" ? DATA.projects : DATA.projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section">
      <SectionTitle kicker="03 — Projects" title="Selected work" />
      <div className="tabs reveal">
        {cats.map((c) => (
          <button
            key={c}
            className={`tab ${filter === c ? "active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="projects-grid" key={filter}>
        {list.map((p, i) => (
          <TiltCard
            key={p.title}
            className="project"
            style={{ "--hue": p.hue, animationDelay: `${i * 90}ms` }}
          >
            <div className="project-cover">
              <span className="project-num">0{i + 1}</span>
              <div className="cover-shape" />
            </div>
            <div className="project-body">
              <span className="project-cat">{p.category}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={p.live}>Live ↗</a>
                <a href={p.code}>Code ↗</a>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="section">
      <SectionTitle kicker="04 — Journey" title="Experience & education" />
      <div className="timeline">
        {DATA.experience.map((e) => (
          <div key={e.role + e.company} className="timeline-item reveal">
            <div className="dot" />
            <div className="timeline-card glass">
              <span className="period">{e.period}</span>
              <h3>{e.role}</h3>
              <span className="company">{e.company}</span>
              <ul>
                {e.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const empty = { name: "", email: "", message: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const validate = (f) => {
    const e = {};
    if (f.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email";
    if (f.message.trim().length < 10) e.message = "Message should be at least 10 characters";
    return e;
  };

  const onChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (errors[e.target.name]) setErrors(validate(next));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1200)); // replace with your API / EmailJS
    setStatus("sent");
    setForm(empty);
    setTimeout(() => setStatus("idle"), 3500);
  };

  return (
    <section id="contact" className="section">
      <SectionTitle kicker="05 — Contact" title="Let's build something" />
      <div className="contact-grid">
        <div className="contact-info reveal">
          <p>
            Have a project in mind or just want to say hi? My inbox is always open. I'll
            get back to you within 24 hours.
          </p>
          <a href={`mailto:${DATA.email}`} className="mail-link">
            {DATA.email}
          </a>
          <div className="socials">
            {DATA.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <form className="contact-form glass reveal" onSubmit={onSubmit} noValidate>
          {["name", "email"].map((f) => (
            <div key={f} className={`float-field ${errors[f] ? "has-error" : ""}`}>
              <input
                id={f}
                name={f}
                type={f === "email" ? "email" : "text"}
                value={form[f]}
                onChange={onChange}
                placeholder=" "
              />
              <label htmlFor={f}>{f === "name" ? "Your name" : "Email address"}</label>
              {errors[f] && <small>{errors[f]}</small>}
            </div>
          ))}
          <div className={`float-field ${errors.message ? "has-error" : ""}`}>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={form.message}
              onChange={onChange}
              placeholder=" "
            />
            <label htmlFor="message">Your message</label>
            {errors.message && <small>{errors.message}</small>}
          </div>
          <button className="btn btn-primary full" disabled={status === "sending"}>
            {status === "sending" ? (
              <span className="spinner" />
            ) : status === "sent" ? (
              "Message sent ✔"
            ) : (
              <>
                Send message <span className="arrow">→</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {DATA.name}. Designed & built with React.
      </p>
      <a href="#home" className="to-top" aria-label="Back to top">
        ↑
      </a>
    </footer>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [theme, setTheme] = useState("dark");
  const active = useActiveSection(NAV);
  const progress = useScrollProgress();
  useReveal();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <>
      <div className="progress" style={{ width: `${progress}%` }} />
      <CursorGlow />
      <Navbar
        active={active}
        theme={theme}
        toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
