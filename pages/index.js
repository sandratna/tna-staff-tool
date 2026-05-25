import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

const QUICK_CHIPS = [
  "What subjects do you offer?",
  "How much is the monthly fee?",
  "What is the class size?",
  "Is there a trial class?",
  "What levels do you teach?",
  "Where are you located?",
  "My child is struggling in Maths, can you help?",
  "Do you have holiday programmes?",
  "What is the Problem Sums Masterclass?",
  "What is Brain Train?"
];

function getTagClass(subject = '') {
  const s = subject.toLowerCase();
  if (s.includes('science')) return 'tag-science';
  if (s.includes('english') || s.includes('creative') || s.includes('bloom') && s.includes('english')) return 'tag-english';
  if (s.includes('secondary')) return 'tag-secondary';
  if (s.includes('brain')) return 'tag-brain';
  if (s.includes('bootcamp') || s.includes('holiday')) return 'tag-holiday';
  if (s.includes('bloom')) return 'tag-bloom';
  return 'tag-maths';
}

export default function Home() {
  const [view, setView] = useState('reply');
  const [programmes, setProgrammes] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  const [selectedProg, setSelectedProg] = useState('');
  const [parentMsg, setParentMsg] = useState('');
  const [reply, setReply] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detailProg, setDetailProg] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setDataError(false);
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error();
      const { programmes: p, faqs: f } = await res.json();
      setProgrammes(p);
      setFaqs(f);
      setLastRefresh(new Date());
    } catch {
      setDataError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function generateReply() {
    if (!parentMsg.trim()) return;
    setGenerating(true);
    setReply('');
    const prog = programmes.find(p => p.name === selectedProg);
    const progContext = prog
      ? `\nPROGRAMME: ${prog.name}\nSubject: ${prog.subject}\nLevel: ${prog.level}\nSchedule: ${prog.schedule}\nFee: ${prog.fee}\nClass size: ${prog.class_size || prog.size}\nCoverage: ${prog.topics}\nWho it's for: ${prog.who_is_it_for || prog.who}\nNotes: ${prog.notes}`
      : '\nALL PROGRAMMES:\n' + programmes.map(p => `- ${p.name} (${p.level || ''}): ${p.fee || ''}. ${p.notes || ''}`).join('\n');
    const faqContext = faqs.length
      ? '\n\nFAQs:\n' + faqs.map(f => `Q: ${f.question || f.q}\nA: ${f.answer || f.a}`).join('\n\n')
      : '';
    const system = `You are a WhatsApp reply assistant for The Nuggets Academy, a small-group academic coaching centre in Singapore.
Write in the warm, calm voice of Sandra Lim, the founder — a trusted mentor, never a salesperson.
Rules:
- Short paragraphs, conversational WhatsApp tone
- No bullet points — natural flowing text only
- Warm greeting (e.g. "Hi! Thanks for reaching out 😊")
- Answer the question directly using the knowledge below
- If a specific detail is missing, say "do drop us a message and we can share more" — never invent details
- End with a clear next step or invitation
- Sign off: "— The Nuggets Academy team"
- Max 3–4 short paragraphs. One or two emojis is fine.
KNOWLEDGE BASE:${progContext}${faqContext}`;
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          system,
          messages: [{ role: 'user', content: `Parent's message: "${parentMsg}"\n\nWrite a warm ready-to-send WhatsApp reply.` }]
        })
      });
      const data = await res.json();
      setReply(data.content?.find(b => b.type === 'text')?.text || 'Something went wrong. Please try again.');
    } catch {
      setReply('Connection error. Please try again.');
    }
    setGenerating(false);
  }

  function copyReply() {
    navigator.clipboard.writeText(reply).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const faqCategories = [...new Set(faqs.map(f => f.category || 'General'))];

  return (
    <>
      <Head>
        <title>TNA Staff Tool</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="logo">N</div>
          <div>
            <div className="header-title">The Nuggets Academy</div>
            <div className="header-sub">Staff Knowledge Tool</div>
          </div>
          <span className="badge">Internal Only</span>
        </header>

        <div className="layout">
          {/* SIDEBAR */}
          <nav className="sidebar">
            <div className="nav-label">Tools</div>
            <button className={`nav-item ${view === 'reply' ? 'active' : ''}`} onClick={() => setView('reply')}>
              <span>💬</span> Parent Reply Generator
            </button>
            <div className="nav-label" style={{marginTop:16}}>Knowledge Base</div>
            <button className={`nav-item ${view === 'programmes' ? 'active' : ''}`} onClick={() => { setDetailProg(null); setView('programmes'); }}>
              <span>📚</span> Programmes
            </button>
            <button className={`nav-item ${view === 'faqs' ? 'active' : ''}`} onClick={() => setView('faqs')}>
              <span>❓</span> FAQs
            </button>
          </nav>

          {/* MAIN */}
          <main className="main">
            {loading && (
              <div className="loading-state">
                <div className="dots"><span/><span/><span/></div>
                <p>Loading knowledge base...</p>
              </div>
            )}

            {!loading && dataError && (
              <div className="error-banner">
                ⚠️ Could not load data from Google Sheets. Check your API key and Sheet ID in environment variables.
                <button onClick={loadData} style={{marginLeft:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',color:'#CC4444',textDecoration:'underline'}}>Retry</button>
              </div>
            )}

            {/* REPLY GENERATOR */}
            {!loading && view === 'reply' && (
              <div>
                <h1 className="section-title">Parent Reply Generator</h1>
                <p className="section-sub">Paste a parent's WhatsApp message. Get a warm, ready-to-send reply in Sandra's voice — drawn from our live programme info and FAQs.</p>

                {lastRefresh && (
                  <div className="sync-bar">
                    <span className="sync-dot synced"/>
                    Data loaded from Google Sheets · {lastRefresh.toLocaleTimeString('en-SG', {hour:'2-digit',minute:'2-digit'})}
                    <button onClick={loadData} style={{marginLeft:'auto',background:'none',border:'none',fontSize:12,cursor:'pointer',color:'var(--muted)',fontFamily:'Poppins'}}>↻ Refresh</button>
                  </div>
                )}

                <div className="stack">
                  <div className="field-group">
                    <label className="field-label">Quick fill <span>— tap a common question</span></label>
                    <div className="chips">
                      {QUICK_CHIPS.map(q => (
                        <button key={q} className="chip" onClick={() => setParentMsg(q)}>{q}</button>
                      ))}
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Parent's message</label>
                    <textarea
                      value={parentMsg}
                      onChange={e => setParentMsg(e.target.value)}
                      placeholder="Paste the parent's WhatsApp message here..."
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Programme context <span>— optional</span></label>
                    <select value={selectedProg} onChange={e => setSelectedProg(e.target.value)}>
                      <option value="">— All programmes / not sure yet —</option>
                      {programmes.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <button className="gen-btn" onClick={generateReply} disabled={generating || !parentMsg.trim()}>
                      {generating ? '...' : '✦ Generate Reply'}
                    </button>
                  </div>
                </div>

                {(reply || generating) && (
                  <div className="output-card">
                    <div className="output-header">
                      <span className="output-label">✓ Ready to send on WhatsApp</span>
                      <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copyReply}>
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="output-body">
                      {generating
                        ? <div className="dots"><span/><span/><span/></div>
                        : reply}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PROGRAMMES */}
            {!loading && view === 'programmes' && (
              <div>
                <h1 className="section-title">Programme Reference</h1>
                <p className="section-sub">Tap any programme to see full details.</p>

                {detailProg ? (
                  <div className="detail-card">
                    <button className="back-btn" onClick={() => setDetailProg(null)}>← Back to all programmes</button>
                    <h2 className="detail-name">{detailProg.name}</h2>
                    <div className="detail-grid">
                      {[['Subject', detailProg.subject], ['Level', detailProg.level], ['Schedule', detailProg.schedule], ['Fee', detailProg.fee], ['Class Size', detailProg.class_size || detailProg.size]].map(([k,v]) => v ? (
                        <div key={k} className="detail-item">
                          <div className="detail-key">{k}</div>
                          <div className="detail-val">{v}</div>
                        </div>
                      ) : null)}
                    </div>
                    <hr className="divider"/>
                    {detailProg.topics && <div className="detail-item" style={{marginBottom:14}}><div className="detail-key">Topics Covered</div><div className="detail-val" style={{marginTop:5}}>{detailProg.topics}</div></div>}
                    {(detailProg.who_is_it_for || detailProg.who) && <div className="detail-item" style={{marginBottom:14}}><div className="detail-key">Who It's For</div><div className="detail-val" style={{marginTop:5}}>{detailProg.who_is_it_for || detailProg.who}</div></div>}
                    {detailProg.notes && <div className="detail-item"><div className="detail-key">Notes for Parents</div><div className="detail-val" style={{marginTop:5}}>{detailProg.notes}</div></div>}
                  </div>
                ) : (
                  <div className="prog-grid">
                    {programmes.length === 0 && <p style={{color:'var(--muted)'}}>No programmes found. Check your Google Sheet.</p>}
                    {programmes.map(p => (
                      <div key={p.name} className="prog-card" onClick={() => setDetailProg(p)}>
                        <div className="prog-name">{p.name}</div>
                        <span className={`tag ${getTagClass(p.subject)}`}>{p.subject}</span>
                        <div className="prog-snippet">{p.level}{p.class_size || p.size ? ` · ${p.class_size || p.size}` : ''}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FAQS */}
            {!loading && view === 'faqs' && (
              <div>
                <h1 className="section-title">FAQ Reference</h1>
                <p className="section-sub">All frequently asked questions, loaded live from Google Sheets.</p>
                {faqs.length === 0 && <p style={{color:'var(--muted)'}}>No FAQs found. Check your Google Sheet.</p>}
                {faqCategories.map(cat => (
                  <div key={cat} style={{marginBottom:28}}>
                    <div className="cat-label">{cat}</div>
                    {faqs.filter(f => (f.category||'General') === cat).map((f, i) => (
                      <div key={i} className="faq-item">
                        <div className="faq-q">{f.question || f.q}</div>
                        <div className="faq-a">{f.answer || f.a}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --cream: #FFF9EF;
          --cream-border: #E8DFC8;
          --yellow: #FFD817;
          --yellow-dark: #E6C200;
          --yellow-soft: #FFF9D0;
          --black: #000;
          --dark: #1A1A1A;
          --mid: #555;
          --muted: #888;
          --white: #fff;
          --pink: #FF86BB;
          --orange: #FF6632;
          --blue: #0074FF;
          --green: #7ED597;
          --radius: 12px;
          --shadow: 0 2px 10px rgba(0,0,0,0.07);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--cream); color: var(--dark); font-family: 'Poppins', sans-serif; font-size: 14px; }
        .app { min-height: 100vh; display: flex; flex-direction: column; }

        /* Header */
        .header { background: var(--black); height: 60px; padding: 0 28px; display: flex; align-items: center; gap: 14px; position: sticky; top: 0; z-index: 100; }
        .logo { width: 34px; height: 34px; background: var(--yellow); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 800; color: var(--black); flex-shrink: 0; }
        .header-title { font-size: 15px; font-weight: 700; color: #fff; }
        .header-sub { font-size: 11px; color: #888; }
        .badge { margin-left: auto; background: var(--yellow); border-radius: 20px; padding: 4px 12px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--black); }

        /* Layout */
        .layout { display: grid; grid-template-columns: 240px 1fr; flex: 1; }
        .sidebar { background: #fff; border-right: 1px solid var(--cream-border); padding: 20px 12px; }
        .nav-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 600; padding: 0 8px; margin-bottom: 4px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; color: var(--mid); border: 1.5px solid transparent; font-weight: 500; background: none; width: 100%; text-align: left; transition: all 0.15s; font-family: 'Poppins', sans-serif; }
        .nav-item:hover { background: var(--cream); color: var(--dark); }
        .nav-item.active { background: var(--yellow); border-color: var(--yellow-dark); color: var(--black); font-weight: 700; }
        .main { padding: 32px 40px; max-width: 820px; }

        /* Typography */
        .section-title { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
        .section-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; line-height: 1.6; }

        /* Fields */
        .stack { display: flex; flex-direction: column; gap: 18px; }
        .field-group { display: flex; flex-direction: column; gap: 7px; }
        .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; }
        .field-label span { color: var(--muted); font-weight: 400; text-transform: none; letter-spacing: 0; font-size: 12px; }
        textarea, select { background: #fff; border: 1.5px solid var(--cream-border); border-radius: var(--radius); color: var(--dark); font-family: 'Poppins', sans-serif; font-size: 13.5px; padding: 12px 15px; width: 100%; outline: none; box-shadow: var(--shadow); transition: border-color 0.2s; resize: vertical; }
        textarea { min-height: 110px; }
        textarea:focus, select:focus { border-color: var(--yellow-dark); box-shadow: 0 0 0 3px rgba(255,216,23,0.2); }
        select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23555' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; }

        /* Chips */
        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .chip { background: #fff; border: 1.5px solid var(--cream-border); border-radius: 20px; padding: 5px 13px; font-size: 12px; font-weight: 500; color: var(--mid); cursor: pointer; font-family: 'Poppins', sans-serif; transition: all 0.15s; }
        .chip:hover { border-color: var(--yellow-dark); color: var(--black); background: var(--yellow-soft); }

        /* Generate button */
        .gen-btn { background: var(--yellow); color: var(--black); border: none; border-radius: var(--radius); padding: 13px 28px; font-family: 'Poppins', sans-serif; font-size: 13.5px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(255,216,23,0.35); }
        .gen-btn:hover:not(:disabled) { background: var(--yellow-dark); transform: translateY(-1px); }
        .gen-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Output */
        .output-card { background: #fff; border: 2px solid var(--yellow); border-radius: var(--radius); margin-top: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .output-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-bottom: 1px solid var(--cream-border); background: var(--yellow-soft); border-radius: 10px 10px 0 0; }
        .output-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
        .output-body { padding: 18px 20px; font-size: 14px; line-height: 1.8; white-space: pre-wrap; min-height: 80px; }
        .copy-btn { background: var(--black); border: none; border-radius: 6px; padding: 5px 16px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: var(--yellow); cursor: pointer; transition: all 0.15s; }
        .copy-btn.copied { background: #2E8B57; color: #fff; }

        /* Sync bar */
        .sync-bar { display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: var(--muted); margin-bottom: 20px; padding: 9px 14px; background: #fff; border: 1px solid var(--cream-border); border-radius: 8px; }
        .sync-dot { width: 7px; height: 7px; border-radius: 50%; background: #ccc; flex-shrink: 0; }
        .sync-dot.synced { background: var(--green); }

        /* Programme cards */
        .prog-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .prog-card { background: #fff; border: 1.5px solid var(--cream-border); border-radius: var(--radius); padding: 16px 18px; cursor: pointer; transition: all 0.15s; box-shadow: var(--shadow); }
        .prog-card:hover { border-color: var(--yellow-dark); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .prog-name { font-size: 14px; font-weight: 700; margin-bottom: 7px; line-height: 1.3; }
        .prog-snippet { font-size: 12px; color: var(--muted); margin-top: 5px; }
        .tag { display: inline-block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; padding: 2px 9px; }
        .tag-maths { background: var(--yellow); color: var(--black); }
        .tag-bloom { background: #FFD817; color: var(--black); }
        .tag-science { background: var(--green); color: var(--black); }
        .tag-english { background: var(--pink); color: var(--black); }
        .tag-secondary { background: var(--blue); color: #fff; }
        .tag-brain { background: var(--orange); color: #fff; }
        .tag-holiday { background: #9B59B6; color: #fff; }

        /* Detail */
        .detail-card { background: #fff; border: 1.5px solid var(--cream-border); border-radius: var(--radius); padding: 26px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .back-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: var(--muted); font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; padding: 0; margin-bottom: 18px; }
        .back-btn:hover { color: var(--dark); }
        .detail-name { font-size: 20px; font-weight: 800; margin-bottom: 16px; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
        .detail-item { display: flex; flex-direction: column; gap: 3px; }
        .detail-key { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
        .detail-val { font-size: 13.5px; line-height: 1.5; }
        .divider { border: none; border-top: 1px solid var(--cream-border); margin: 14px 0; }

        /* FAQs */
        .cat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 10px; }
        .faq-item { background: #fff; border: 1.5px solid var(--cream-border); border-radius: 10px; padding: 14px 18px; margin-bottom: 9px; box-shadow: var(--shadow); }
        .faq-q { font-weight: 700; font-size: 13.5px; margin-bottom: 5px; }
        .faq-a { font-size: 13px; color: var(--mid); line-height: 1.6; }

        /* Loading/error */
        .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 16px; color: var(--muted); }
        .error-banner { background: #FFF0F0; border: 1px solid #FFCCCC; border-radius: 8px; padding: 12px 18px; color: #CC4444; font-size: 13px; margin-bottom: 20px; }
        .dots { display: flex; gap: 5px; align-items: center; }
        .dots span { width: 8px; height: 8px; background: var(--yellow-dark); border-radius: 50%; animation: bounce 1.2s infinite; opacity: 0.8; }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:0.5} 40%{transform:translateY(-6px);opacity:1} }

        @media (max-width: 768px) {
          .layout { grid-template-columns: 1fr; }
          .sidebar { display: none; }
          .main { padding: 20px; }
          .prog-grid, .detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
