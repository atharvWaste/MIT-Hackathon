import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600;700&display=swap');

  :root {
    --bg-dark: #060814;
    --bg-navy: #080d1f;
    --bg-card: #0d1530;
    --pink: #ff1f7d;
    --pink-glow: #ff1f7d88;
    --purple: #7c3aed;
    --blue: #2563eb;
    --cyan: #06b6d4;
    --text: #f0f4ff;
    --text-muted: #8a9bc4;
    --border: rgba(255,31,125,0.2);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  .gf-body {
    font-family: 'Exo 2', sans-serif;
    background: var(--bg-dark);
    color: var(--text);
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* Scanline overlay */
  .gf-body::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 2px);
  }

  /* NAV */
  .gf-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 5%;
    background: rgba(6,8,20,0.7);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .gf-logo {
    font-family: 'Orbitron', monospace;
    font-size: 1.6rem; font-weight: 900;
    background: linear-gradient(135deg, #fff 30%, var(--pink));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: 2px; text-decoration: none;
  }
  .gf-logo span { color: var(--pink); -webkit-text-fill-color: var(--pink); }
  .gf-nav-links { display: flex; gap: 2rem; list-style: none; }
  .gf-nav-links a {
    color: var(--text-muted); text-decoration: none;
    font-size: 0.85rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
    transition: color 0.3s;
  }
  .gf-nav-links a:hover { color: var(--pink); }
  .gf-nav-btns { display: flex; gap: 0.75rem; }

  /* BUTTONS */
  .gf-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.65rem 1.5rem;
    border-radius: 50px;
    font-family: 'Exo 2', sans-serif;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    border: none;
  }
  .gf-btn-outline {
    background: transparent;
    border: 1.5px solid var(--pink);
    color: var(--pink);
  }
  .gf-btn-outline:hover {
    background: var(--pink); color: #fff;
    box-shadow: 0 0 24px var(--pink-glow);
  }
  .gf-btn-primary {
    background: var(--pink); color: #fff;
    box-shadow: 0 0 20px var(--pink-glow);
  }
  .gf-btn-primary:hover {
    background: #ff4a96;
    box-shadow: 0 0 36px var(--pink-glow), 0 0 60px var(--pink-glow);
    transform: translateY(-2px);
  }
  .gf-btn-lg { padding: 1rem 2.2rem; font-size: 0.95rem; }
  .gf-btn-ghost {
    background: rgba(255,255,255,0.08);
    border: 1.5px solid rgba(255,255,255,0.15);
    color: #fff;
  }
  .gf-btn-ghost:hover {
    background: rgba(255,255,255,0.15);
    border-color: rgba(255,255,255,0.3);
  }

  /* HERO */
  .gf-hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    overflow: hidden;
  }
  .gf-hero-visual { position: relative; overflow: hidden; }
  .gf-hero-visual img {
    width: 100%; height: 100%; object-fit: cover;
    filter: saturate(1.3) brightness(0.75);
  }
  .gf-hero-visual::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 60%, var(--bg-dark) 100%),
                linear-gradient(180deg, transparent 70%, rgba(6,8,20,0.8) 100%);
  }
  .gf-hero-content {
    display: flex; flex-direction: column; justify-content: center;
    padding: 8rem 6% 4rem 4%;
    position: relative; z-index: 2;
    background: linear-gradient(90deg, var(--bg-dark) 0%, var(--bg-navy) 100%);
  }
  .gf-tag {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(255,31,125,0.12);
    border: 1px solid var(--border);
    color: var(--pink);
    font-size: 0.75rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 0.4rem 1rem;
    border-radius: 50px;
    margin-bottom: 1.5rem;
    width: fit-content;
  }
  .gf-tag::before {
    content: ''; width: 6px; height: 6px;
    background: var(--pink); border-radius: 50%;
    animation: gfPulse 2s ease infinite;
  }
  @keyframes gfPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }
  .gf-h1 {
    font-family: 'Orbitron', monospace;
    font-size: clamp(2.4rem, 4vw, 3.8rem);
    font-weight: 900; line-height: 1.1;
    letter-spacing: -0.5px; margin-bottom: 1.25rem;
  }
  .gf-accent { color: var(--pink); }
  .gf-hero-sub {
    font-size: 1.05rem; color: var(--text-muted);
    line-height: 1.7; max-width: 480px; margin-bottom: 2.5rem;
  }
  .gf-hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }

  /* Floating badge */
  .gf-badge {
    position: absolute; bottom: 3rem; left: 3rem;
    background: rgba(13,21,48,0.85);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1rem 1.4rem;
    display: flex; align-items: center; gap: 0.9rem;
    z-index: 5;
    animation: gfFloat 3s ease-in-out infinite alternate;
  }
  @keyframes gfFloat {
    from { transform: translateY(0); }
    to { transform: translateY(-8px); }
  }
  .gf-badge-icon { font-size: 1.8rem; }
  .gf-badge-label { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
  .gf-badge-val { font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 700; color: var(--pink); }

  /* Orbs */
  .gf-orb {
    position: absolute; border-radius: 50%; pointer-events: none;
    filter: blur(80px); opacity: 0.25;
  }
  .gf-orb-pink { width: 500px; height: 500px; background: var(--pink); }
  .gf-orb-purple { width: 400px; height: 400px; background: var(--purple); }
  .gf-orb-blue { width: 350px; height: 350px; background: var(--blue); }

  /* STATS BAR */
  .gf-stats {
    background: var(--bg-card);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 2rem 5%;
    display: flex; justify-content: center;
    gap: 4rem; flex-wrap: wrap;
  }
  .gf-stat { text-align: center; }
  .gf-stat-num {
    font-family: 'Orbitron', monospace;
    font-size: 2.2rem; font-weight: 900;
    color: var(--pink); display: block;
  }
  .gf-stat-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-top: 0.3rem; }

  /* SPLIT SECTIONS */
  .gf-split {
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: 85vh; align-items: center;
    padding: 5rem 5%; gap: 4rem;
    position: relative; overflow: hidden;
  }
  .gf-split-reverse { direction: rtl; }
  .gf-split-reverse > * { direction: ltr; }

  .gf-sec-visual {
    position: relative; border-radius: 20px;
    overflow: hidden; aspect-ratio: 4/3;
  }
  .gf-sec-visual img {
    width: 100%; height: 100%; object-fit: cover;
    filter: saturate(1.3) brightness(0.8);
    transition: transform 0.6s ease;
  }
  .gf-sec-visual:hover img { transform: scale(1.04); }
  .gf-sec-visual::before {
    content: ''; position: absolute; inset: 0; z-index: 2;
    border-radius: 20px;
    box-shadow: inset 0 0 40px rgba(255,31,125,0.15), 0 0 60px rgba(255,31,125,0.1);
    pointer-events: none;
  }
  .gf-sec-visual::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 3;
    background: linear-gradient(135deg, rgba(255,31,125,0.3) 0%, transparent 20%),
                linear-gradient(315deg, rgba(124,58,237,0.3) 0%, transparent 20%);
    border-radius: 20px; pointer-events: none;
  }

  .gf-sec-content { padding: 1rem 0; }
  .gf-sec-num {
    font-family: 'Orbitron', monospace;
    font-size: 5rem; font-weight: 900;
    color: rgba(255,31,125,0.08);
    line-height: 1; margin-bottom: -1rem; letter-spacing: -3px;
  }
  .gf-h2 {
    font-family: 'Orbitron', monospace;
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: 700; line-height: 1.15;
    margin-bottom: 1.2rem; letter-spacing: -0.5px;
  }
  .gf-h2 .pink { color: var(--pink); }
  .gf-h2 .cyan { color: var(--cyan); }
  .gf-sec-desc {
    font-size: 1rem; color: var(--text-muted);
    line-height: 1.75; max-width: 460px; margin-bottom: 2.2rem;
  }

  /* Pills */
  .gf-pills { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 2rem; }
  .gf-pill {
    background: rgba(255,31,125,0.08);
    border: 1px solid rgba(255,31,125,0.2);
    color: var(--pink);
    font-size: 0.75rem; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase;
    padding: 0.35rem 0.85rem; border-radius: 50px;
  }
  .gf-pill-blue { background: rgba(37,99,235,0.1); border-color: rgba(37,99,235,0.3); color: #60a5fa; }
  .gf-pill-purple { background: rgba(124,58,237,0.1); border-color: rgba(124,58,237,0.3); color: #a78bfa; }

  /* BG Grid */
  .gf-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: linear-gradient(rgba(255,31,125,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,31,125,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* CTA */
  .gf-cta {
    padding: 8rem 5%; text-align: center;
    position: relative; overflow: hidden;
    background: var(--bg-navy);
  }
  .gf-cta-sub {
    font-size: 1.05rem; color: var(--text-muted);
    max-width: 500px; margin: 0 auto 3rem; line-height: 1.7;
  }
  .gf-cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .gf-glow-line {
    width: 120px; height: 2px;
    background: linear-gradient(90deg, transparent, var(--pink), transparent);
    margin: 1.5rem auto; border-radius: 2px;
  }

  /* FOOTER */
  .gf-footer {
    background: var(--bg-navy);
    border-top: 1px solid var(--border);
    padding: 2.5rem 5%;
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 1rem;
  }
  .gf-footer-logo {
    font-family: 'Orbitron', monospace; font-size: 1.2rem; font-weight: 900;
    background: linear-gradient(135deg, #fff 30%, var(--pink));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .gf-footer-copy { font-size: 0.8rem; color: var(--text-muted); }
  .gf-footer-links { display: flex; gap: 1.5rem; }
  .gf-footer-links a { color: var(--text-muted); text-decoration: none; font-size: 0.8rem; transition: color 0.3s; }
  .gf-footer-links a:hover { color: var(--pink); }

  /* Animations */
  .gf-fade { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .gf-fade-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .gf-fade-right { opacity: 0; transform: translateX(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .gf-visible { opacity: 1 !important; transform: none !important; }

  /* Responsive */
  @media (max-width: 900px) {
    .gf-hero { grid-template-columns: 1fr; }
    .gf-hero-visual { height: 50vh; }
    .gf-hero-visual::after { background: linear-gradient(180deg, transparent 50%, var(--bg-dark) 100%); }
    .gf-hero-content { padding: 2rem 5% 4rem; }
    .gf-split { grid-template-columns: 1fr; min-height: unset; }
    .gf-split-reverse { direction: ltr; }
    .gf-nav-links { display: none; }
    .gf-stats { gap: 2rem; }
    .gf-footer { flex-direction: column; text-align: center; }
  }
`;

const PageOne = () => {
    const navigate = useNavigate();
    const observerRef = useRef(null);

    useEffect(() => {
        // Inject styles
        const styleEl = document.createElement("style");
        styleEl.id = "gameflix-styles";
        styleEl.textContent = styles;
        if (!document.getElementById("gameflix-styles")) {
            document.head.appendChild(styleEl);
        }

        // Intersection Observer for scroll animations
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add("gf-visible");
                });
            },
            { threshold: 0.12 }
        );

        document
            .querySelectorAll(".gf-fade, .gf-fade-left, .gf-fade-right")
            .forEach((el) => observerRef.current.observe(el));

        // Trigger hero immediately
        setTimeout(() => {
            document.querySelectorAll(".gf-hero .gf-fade").forEach((el) =>
                el.classList.add("gf-visible")
            );
        }, 200);

        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    return (
        <div className="gf-body">
            {/* NAV */}
            <nav className="gf-nav">
                <a href="/" className="gf-logo">Game<span>Flix</span></a>
                <ul className="gf-nav-links">
                    <li><a href="#">Gaming</a></li>
                    <li><a href="#">Esports</a></li>
                    <li><a href="#">Sports</a></li>
                    <li><a href="#">Live</a></li>
                </ul>
                <div className="gf-nav-btns">
                    <button className="gf-btn gf-btn-outline" onClick={() => navigate("/Login")}>Sign In</button>
                    <button className="gf-btn gf-btn-primary" onClick={() => navigate("/SignIn")}>Sign Up</button>
                </div>
            </nav>

            {/* HERO */}
            <section className="gf-hero">
                <div className="gf-hero-visual">
                    <img
                        src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&q=80"
                        alt="Gaming setup with neon lighting"
                    />
                    <div className="gf-badge">
                        <div className="gf-badge-icon">🎮</div>
                        <div>
                            <div className="gf-badge-label">Now Streaming</div>
                            <div className="gf-badge-val">500+ Titles</div>
                        </div>
                    </div>
                    <div className="gf-orb gf-orb-pink" style={{ top: "-100px", left: "-100px" }} />
                    <div className="gf-orb gf-orb-purple" style={{ bottom: 0, right: 0 }} />
                </div>

                <div className="gf-hero-content gf-fade">
                    <div className="gf-grid" />
                    <div className="gf-orb gf-orb-blue" style={{ top: "20%", right: "-100px", opacity: 0.15 }} />
                    <div className="gf-tag">🔴 Live Now</div>
                    <h1 className="gf-h1">
                        Structured<br />
                        <span className="gf-accent">Gaming</span><br />
                        Entertainment
                    </h1>
                    <p className="gf-hero-sub">
                        Watch Gaming, Esports, and Sports content organized into seasons and episodes — the streaming platform built for gamers.
                    </p>
                    <div className="gf-hero-btns">
                        <button className="gf-btn gf-btn-primary gf-btn-lg" onClick={() => navigate("/SignIn")}>Sign Up Free</button>
                        <button className="gf-btn gf-btn-ghost gf-btn-lg" onClick={() => navigate("/Login")}>Sign In</button>
                    </div>
                </div>
            </section>

            {/* STATS BAR */}
            <div className="gf-stats">
                {[
                    { num: "500+", label: "Game Titles" },
                    { num: "200+", label: "Esports Events" },
                    { num: "50K+", label: "Active Viewers" },
                    { num: "4K", label: "Ultra HD Quality" },
                ].map((s, i) => (
                    <div className="gf-stat gf-fade" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                        <span className="gf-stat-num">{s.num}</span>
                        <span className="gf-stat-label">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* SECTION 2: Gaming Series */}
            <section style={{ background: "var(--bg-navy)" }}>
                <div className="gf-split">
                    <div className="gf-sec-visual gf-fade-left">
                        <img
                            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=80"
                            alt="Gaming player with controller"
                        />
                    </div>
                    <div className="gf-sec-content gf-fade-right">
                        <div className="gf-sec-num">01</div>
                        <h2 className="gf-h2">Watch <span className="pink">Gaming</span> Series</h2>
                        <div className="gf-pills">
                            {["GTA V", "Minecraft", "Fortnite", "Valorant"].map((g, i) => (
                                <span key={i} className={`gf-pill${i === 1 ? " gf-pill-blue" : i === 2 ? " gf-pill-purple" : ""}`}>{g}</span>
                            ))}
                        </div>
                        <p className="gf-sec-desc">
                            Experience your favorite games like GTA V and Minecraft in structured episodes and seasons — just like a Netflix series, but for gaming content.
                        </p>
                        <button className="gf-btn gf-btn-primary gf-btn-lg" onClick={() => navigate("/SignIn")}>
                            Sign Up to Continue →
                        </button>
                    </div>
                </div>
                <div className="gf-grid" style={{ opacity: 0.5 }} />
            </section>

            {/* SECTION 3: Esports & Sports */}
            <section style={{ background: "var(--bg-dark)", position: "relative" }}>
                <div className="gf-split gf-split-reverse">
                    <div className="gf-sec-visual gf-fade-right">
                        <img
                            src="https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?w=900&q=80"
                            alt="Esports tournament arena"
                        />
                    </div>
                    <div className="gf-sec-content gf-fade-left">
                        <div className="gf-sec-num">02</div>
                        <h2 className="gf-h2">Esports &amp; <span className="cyan">Sports</span> Content</h2>
                        <div className="gf-pills">
                            {["Tournaments", "Highlights", "Live Matches"].map((g, i) => (
                                <span key={i} className={`gf-pill${i === 0 ? " gf-pill-blue" : i === 2 ? " gf-pill-purple" : ""}`}>{g}</span>
                            ))}
                        </div>
                        <p className="gf-sec-desc">
                            Watch global tournaments, championship highlights, and competitive gameplay in an organized, binge-worthy format. Never miss a moment.
                        </p>
                        <button className="gf-btn gf-btn-outline gf-btn-lg" onClick={() => navigate("/SignIn")}>
                            Create Account →
                        </button>
                    </div>
                </div>
                <div className="gf-grid" style={{ opacity: 0.5 }} />
                <div className="gf-orb gf-orb-purple" style={{ left: "-150px", top: "50%", transform: "translateY(-50%)", opacity: 0.2 }} />
            </section>

            {/* FINAL CTA */}
            <section className="gf-cta">
                <div className="gf-grid" />
                <div className="gf-orb gf-orb-pink" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0.12, width: "700px", height: "700px" }} />
                <div style={{ position: "relative", zIndex: 2 }} className="gf-fade">
                    <div className="gf-tag" style={{ margin: "0 auto 1.5rem" }}>🚀 Join GameFlix Today</div>
                    <h2 className="gf-h2">
                        Join the <span className="pink">Future</span> of<br />Gaming Entertainment
                    </h2>
                    <div className="gf-glow-line" />
                    <p className="gf-cta-sub">
                        Start streaming Gaming, Esports, and Sports content organized into seasons and episodes. Your next obsession awaits.
                    </p>
                    <div className="gf-cta-btns">
                        <button className="gf-btn gf-btn-primary gf-btn-lg" onClick={() => navigate("/SignIn")}>Sign Up Free</button>
                        <button className="gf-btn gf-btn-ghost gf-btn-lg" onClick={() => navigate("/Login")}>Sign In</button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="gf-footer">
                <div className="gf-footer-logo">GameFlix</div>
                <div className="gf-footer-links">
                    <a href="#">About</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Contact</a>
                </div>
                <div className="gf-footer-copy">© 2026 GameFlix. All rights reserved.</div>
            </footer>
        </div>
    );
};

export default PageOne;
