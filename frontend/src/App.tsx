import { useEffect, useMemo, useState } from 'react';

type Project = {
  id: number;
  title: string;
  summary: string;
  category: string;
  skills: string[];
  openRoles: number;
  teamSize: number;
  stage: 'Planning' | 'Building' | 'Testing';
  owner: string;
};

type ApiResult = { projects: Project[]; total: number; demo: boolean };
const categories = ['All projects', 'AI & Data', 'IoT', 'Web Apps', 'Developer Tools'];

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All projects');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/projects', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error('API returned ' + res.status);
        return (await res.json()) as ApiResult;
      })
      .then((data) => { setProjects(data.projects); setError(''); })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError('Could not reach the backend. Start npm run dev:api in another VS Code terminal.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => projects.filter((project) => {
    const text = [project.title, project.summary, ...project.skills].join(' ').toLowerCase();
    return text.includes(query.toLowerCase()) &&
      (category === 'All projects' || project.category === category);
  }), [projects, query, category]);

  return (
    <div className="site-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand"><span className="brand-icon">D<span>✦</span></span><div><strong>DevCollab</strong><small>AI PLATFORM</small></div></div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-items">
          <a className="nav-link selected" href="#discover">◈ <span>Discover projects</span></a>
          <a className="nav-link" href="#how-it-works">♧ <span>How it works</span></a>
        </nav>
        <div className="side-note"><div className="side-note-icon">✧</div><strong>Build something meaningful.</strong><p>Connect with builders, learn new skills, and turn ideas into products.</p><span>PHASE 1 PREVIEW</span></div>
        <div className="side-footer">Built for student developers</div>
      </aside>

      <main className="content">
        <header className="topbar"><div><span className="eyebrow">YOUR COMMUNITY, YOUR NEXT BIG IDEA</span><h1>Find your next <em>collaboration.</em></h1><p>Discover exciting projects, meet ambitious teammates, and grow your developer portfolio.</p></div><span className="phase-badge">● Live local preview</span></header>

        <section className="hero" aria-label="Welcome">
          <div className="hero-copy"><span className="hero-kicker">THE BUILDER NETWORK</span><h2>Great ideas deserve<br/>great teams.</h2><p>Your next hackathon project, open-source contribution, or startup begins here.</p><a className="hero-button" href="#discover">Explore projects <span aria-hidden="true">→</span></a></div>
          <div className="hero-art" aria-hidden="true"><span className="art-orbit orbit-1"/><span className="art-orbit orbit-2"/><span className="art-card art-1">⌘ <small>Collaborate</small></span><span className="art-card art-2">✦ <small>Build</small></span><span className="art-core">D<span>✦</span></span></div>
        </section>

        <section id="discover" className="discover">
          <div className="section-heading"><div><span className="section-tag">DISCOVER</span><h2>Explore open projects</h2><p>Find something that fits your skills and curiosity.</p></div><div className="total-badge">{loading ? 'Loading…' : filtered.length + ' projects'}</div></div>
          <div className="controls">
            <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search projects" placeholder="Search projects or skills..." value={query} onChange={e => setQuery(e.target.value)} /></label>
            <label className="select-wrap"><span className="sr-only">Category</span><select aria-label="Category" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
          </div>
          <div className="demo-notice">ⓘ &nbsp; Example projects for Phase 1. Database, accounts, applications, and AI matching arrive in later phases.</div>
          {error && <div role="alert" className="error-notice">{error}</div>}
          {loading ? <div className="empty">Loading projects from Express API…</div> : !error && filtered.length === 0 ? <div className="empty">No projects match your filters. Try another search.</div> : null}
          <div className="project-grid">
            {filtered.map((project, index) => (
              <article className="project-card" key={project.id}>
                <div className="card-top"><span className={'project-icon icon-' + index % 4}>{['◉','⌘','✺','✦'][index % 4]}</span><span className="status"><span className="status-dot"/>{project.stage}</span></div>
                <div className="category">{project.category}</div><h3>{project.title}</h3><p>{project.summary}</p>
                <div className="tag-row">{project.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}</div>
                <div className="card-foot"><span>✧ {project.openRoles} open {project.openRoles === 1 ? 'role' : 'roles'}</span><span>{project.teamSize} members</span></div>
              </article>
            ))}
          </div>
        </section>
        <section className="how" id="how-it-works"><span>01&nbsp; Discover</span><span>02&nbsp; Connect</span><span>03&nbsp; Build</span><p>Team applications and messaging are part of the next development phases.</p></section>
        <footer className="footer">DevCollab AI · Phase 1 · React + TypeScript + Express</footer>
      </main>
    </div>
  );
}
