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
  if (s.includes('english') || s.includes('creative')) return 'tag-english';
  if (s.includes('secondary') || s.includes('sec')) return 'tag-secondary';
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
  const [dataError, setDataError] = useState('');
  const [selectedProg, setSelectedProg] = useState('');
  const [parentMsg, setParentMsg] = useState('');
  const [reply, setReply] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detailProg, setDetailProg] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setDataError('');
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setProgrammes(json.programmes || []);
      setFaqs(json.faqs || []);
      setLastRefresh(new Date());
    } catch (e) {
      setDataError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function generateReply() {
    if (!parentMsg.trim()) return;
    setGenerating(true);
    setReply('');
    const prog = programmes.find(p => p.name === selectedProg) || null;
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentMsg, prog, programmes, faqs })
      });
      const data = await res.json();
      setReply(data.reply || data.error || 'Something went wrong.');
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="app">
        <header className="header">
          <div className="logo">N</div>
          <div>
            <div className="header-title">The Nuggets Academy</div>
            <div className="header-sub">Staff Knowledge Tool</div>
          </div>
          <span className="badge">Internal Only</span>
        </header>

        <div className="layout">
          <nav className="sidebar">
            <div className="nav-label">Tools</div>
            <button className={`nav-item${view==='reply'?' active':''}`} onClick={() => setView('reply')}>
              <span>💬</span> Parent Reply Generator
            </button>
            <div className="nav-label">Knowledge Base</div>
            <button className={`nav-item${view==='programmes'?' active':''}`} onClick={() => { setDetailProg(null); setView('programmes'); }}>
              <span>📚</span> Programmes
            </button>
            <button className={`nav-item${view==='faqs'?' active':''}`} onClick={() => setView('faqs')}>
              <span>❓</span> FAQs
            </button>
          </nav>

          <main className="main">
            {loading && (
              <div className="loading-state">
                <div className="dots"><span/><span/><span/></div>
                <p>Loading knowledge base from Google Sheets...</p>
              </div>
            )}

            {!loading && dataError && (
              <div className="error-banner">
                <strong>Could not load data:</strong> {dataError}
                <br/>Check your GOOGLE_SHEETS_API_KEY and SHEET_ID in Vercel environment variables.
                <button className="retry-btn" onClick={loadData}>↻ Retry</button>
              </div>
            )}

            {/* REPLY */}
            {!loading && view === 'reply' && (
              <div>
                <h1 className="section-title">Parent Reply Generator</h1>
                <p className="section-sub">Paste a parent's WhatsApp message. Get a warm, ready-to-send reply in Sandra's voice.</p>

                {lastRefresh && (
                  <div className="sync-bar">
                    <span className="sync-dot"/>
                    Data loaded · {lastRefresh.toLocaleTimeString('en-SG',{hour:'2-digit',minute:'2-digit'})}
                    <button className="refresh-btn" onClick={loadData}>↻ Refresh</button>
                  </div>
                )}

                <div className="stack">
                  <div className="field-group">
                    <label className="field-label">Quick fill <span className="label-sub">— tap a common question</span></label>
                    <div className="chips">
                      {QUICK_CHIPS.map(q => (
                        <button key={q} className="chip" onClick={() => setParentMsg(q)}>{q}</button>
                      ))}
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Parent's message</label>
                    <textarea value={parentMsg} onChange={e => setParentMsg(e.target.value)} placeholder="Paste the parent's WhatsApp message here..." />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Programme context <span className="label-sub">— optional</span></label>
                    <select value={selectedProg} onChange={e => setSelectedProg(e.target.value)}>
                      <option value="">— All programmes / not sure yet —</option>
                      {programmes.map(p => <option key={p.name} value={p.name}>{p.name} {p.subject ? `— ${p.subject}` : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <button className="gen-btn" onClick={generateReply} disabled={generating || !parentMsg.trim()}>
                      {generating ? 'Generating...' : '✦ Generate Reply'}
                    </button>
                  </div>
                </div>

                {(reply || generating) && (
                  <div className="output-card">
                    <div className="output-header">
                      <span className="output-label">✓ Ready to send on WhatsApp</span>
                      <button className={`copy-btn${copied?' copied':''}`} onClick={copyReply}>
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="output-body">
                      {generating ? <div className="dots"><span/><span/><span/></div> : reply}
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
                    <button className="back-btn" onClick={() => setDetailProg(null)}>← Back</button>
                    <h2 className="detail-name">{detailProg.name}</h2>
                    <div className="detail-grid">
                      {[['Subject',detailProg.subject],['Level',detailProg.level],['Schedule',detailProg.schedule],['Fee',detailProg.fee],['Class Size',detailProg.class_size]].filter(([,v])=>v).map(([k,v])=>(
                        <div key={k} className="detail-item">
                          <div className="detail-key">{k}</div>
                          <div className="detail-val">{v}</div>
                        </div>
                      ))}
                    </div>
                    <hr className="divider"/>
                    {detailProg.topics && <div className="detail-item mb"><div className="detail-key">Topics Covered</div><div className="detail-val">{detailProg.topics}</div></div>}
                    {detailProg.who_is_it_for && <div className="detail-item mb"><div className="detail-key">Who It's For</div><div className="detail-val">{detailProg.who_is_it_for}</div></div>}
                    {detailProg.notes && <div className="detail-item"><div className="detail-key">Notes for Parents</div><div className="detail-val">{detailProg.notes}</div></div>}
                  </div>
                ) : (
                  <div className="prog-grid">
                    {programmes.length === 0 && <p className="empty">No programmes found. Check your Google Sheet.</p>}
                    {programmes.map(p => (
                      <div key={p.name} className="prog-card" onClick={() => setDetailProg(p)}>
                        <div className="prog-name">{p.name}</div>
                        <span className={`tag ${getTagClass(p.subject)}`}>{p.subject}</span>
                        <div className="prog-snippet">{[p.level, p.class_size].filter(Boolean).join(' · ')}</div>
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
                {faqs.length === 0 && <p className="empty">No FAQs found. Check your Google Sheet.</p>}
                {faqCategories.map(cat => (
                  <div key={cat} className="faq-cat-group">
                    <div className="cat-label">{cat}</div>
                    {faqs.filter(f=>(f.category||'General')===cat).map((f,i)=>(
                      <div key={i} className="faq-item">
                        <div className="faq-q">{f.question}</div>
                        <div className="faq-a">{f.answer}</div>
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
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body { background: #FFF9EF; color: #1A1A1A; font-family: 'Poppins', sans-serif; font-size: 14px; line-height: 1.5; }
        .app { min-height: 100vh; display: flex; flex-direction: column; }

        /* Header */
        .header { background: #000; height: 60px; padding: 0 24px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100; }
        .logo { width: 34px; height: 34px; background: #FFD817; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 800; color: #000; flex-shrink: 0; }
        .header-title { font-size: 15px; font-weight: 700; color: #fff; line-height: 1.2; }
        .header-sub { font-size: 11px; color: #888; }
        .badge { margin-left: auto; background: #FFD817; border-radius: 20px; padding: 4px 12px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #000; white-space: nowrap; }

        /* Layout */
        .layout { display: grid; grid-template-columns: 230px 1fr; flex: 1; min-height: calc(100vh - 60px); }
        .sidebar { background: #fff; border-right: 1px solid #E8DFC8; padding: 20px 12px; display: flex; flex-direction: column; gap: 3px; }
        .nav-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; font-weight: 600; padding: 0 8px; margin-top: 14px; margin-bottom: 4px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; color: #555; border: 1.5px solid transparent; font-weight: 500; background: none; width: 100%; text-align: left; font-family: 'Poppins', sans-serif; transition: all 0.15s; }
        .nav-item:hover { background: #FFF9EF; color: #1A1A1A; }
        .nav-item.active { background: #FFD817; border-color: #E6C200; color: #000; font-weight: 700; }
        .main { padding: 32px 40px; max-width: 820px; }

        /* Type */
        .section-title { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
        .section-sub { font-size: 13px; color: #888; margin-bottom: 24px; line-height: 1.6; }
        .empty { color: #888; font-size: 13px; }

        /* Form elements */
        .stack { display: flex; flex-direction: column; gap: 18px; }
        .field-group { display: flex; flex-direction: column; gap: 7px; }
        .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #2C2C2C; }
        .label-sub { font-size: 12px; font-weight: 400; text-transform: none; letter-spacing: 0; color: #888; }
        textarea, select { background: #fff; border: 1.5px solid #E8DFC8; border-radius: 12px; color: #1A1A1A; font-family: 'Poppins', sans-serif; font-size: 13.5px; padding: 12px 15px; width: 100%; outline: none; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: border-color 0.2s, box-shadow 0.2s; resize: vertical; }
        textarea { min-height: 110px; }
        textarea:focus, select:focus { border-color: #E6C200; box-shadow: 0 0 0 3px rgba(255,216,23,0.2); }
        select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23555' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; }

        /* Chips */
        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .chip { background: #fff; border: 1.5px solid #E8DFC8; border-radius: 20px; padding: 5px 13px; font-size: 12px; font-weight: 500; color: #555; cursor: pointer; font-family: 'Poppins', sans-serif; transition: all 0.15s; }
        .chip:hover { border-color: #E6C200; color: #000; background: #FFF9D0; }

        /* Buttons */
        .gen-btn { background: #FFD817; color: #000; border: none; border-radius: 12px; padding: 13px 28px; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(255,216,23,0.35); }
        .gen-btn:hover:not(:disabled) { background: #E6C200; transform: translateY(-1px); }
        .gen-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .retry-btn { background: none; border: none; font-family: 'Poppins', sans-serif; font-size: 13px; color: #CC4444; text-decoration: underline; cursor: pointer; margin-left: 10px; }
        .refresh-btn { background: none; border: none; font-size: 12px; cursor: pointer; color: #888; font-family: 'Poppins', sans-serif; margin-left: auto; }
        .refresh-btn:hover { color: #1A1A1A; }

        /* Output */
        .output-card { background: #fff; border: 2px solid #FFD817; border-radius: 12px; margin-top: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .output-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-bottom: 1px solid #E8DFC8; background: #FFF9D0; border-radius: 10px 10px 0 0; }
        .output-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
        .output-body { padding: 18px 20px; font-size: 14px; line-height: 1.8; white-space: pre-wrap; min-height: 80px; }
        .copy-btn { background: #000; border: none; border-radius: 6px; padding: 6px 16px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #FFD817; cursor: pointer; transition: all 0.15s; }
        .copy-btn:hover { background: #2C2C2C; }
        .copy-btn.copied { background: #2E8B57; color: #fff; }

        /* Sync */
        .sync-bar { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #888; margin-bottom: 20px; padding: 9px 14px; background: #fff; border: 1px solid #E8DFC8; border-radius: 8px; }
        .sync-dot { width: 7px; height: 7px; border-radius: 50%; background: #7ED597; flex-shrink: 0; }

        /* Programmes */
        .prog-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .prog-card { background: #fff; border: 1.5px solid #E8DFC8; border-radius: 12px; padding: 16px 18px; cursor: pointer; transition: all 0.15s; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .prog-card:hover { border-color: #E6C200; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .prog-name { font-size: 14px; font-weight: 700; margin-bottom: 7px; line-height: 1.3; }
        .prog-snippet { font-size: 12px; color: #888; margin-top: 5px; }
        .tag { display: inline-block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; padding: 2px 9px; }
        .tag-maths { background: #FFD817; color: #000; }
        .tag-bloom { background: #FFD817; color: #000; }
        .tag-science { background: #7ED597; color: #000; }
        .tag-english { background: #FF86BB; color: #000; }
        .tag-secondary { background: #0074FF; color: #fff; }
        .tag-brain { background: #FF6632; color: #fff; }
        .tag-holiday { background: #9B59B6; color: #fff; }

        /* Detail */
        .detail-card { background: #fff; border: 1.5px solid #E8DFC8; border-radius: 12px; padding: 26px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .back-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: #888; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; padding: 0; margin-bottom: 18px; }
        .back-btn:hover { color: #1A1A1A; }
        .detail-name { font-size: 20px; font-weight: 800; margin-bottom: 16px; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
        .detail-item { display: flex; flex-direction: column; gap: 4px; }
        .detail-item.mb { margin-bottom: 14px; }
        .detail-key { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #888; }
        .detail-val { font-size: 13.5px; line-height: 1.5; margin-top: 4px; }
        .divider { border: none; border-top: 1px solid #E8DFC8; margin: 14px 0; }

        /* FAQs */
        .faq-cat-group { margin-bottom: 28px; }
        .cat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-bottom: 10px; }
        .faq-item { background: #fff; border: 1.5px solid #E8DFC8; border-radius: 10px; padding: 14px 18px; margin-bottom: 9px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .faq-q { font-weight: 700; font-size: 13.5px; margin-bottom: 6px; }
        .faq-a { font-size: 13px; color: #555; line-height: 1.6; }

        /* Loading/error */
        .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 16px; color: #888; }
        .error-banner { background: #FFF0F0; border: 1px solid #FFCCCC; border-radius: 8px; padding: 14px 18px; color: #CC4444; font-size: 13px; margin-bottom: 20px; line-height: 1.6; }
        .dots { display: flex; gap: 5px; align-items: center; }
        .dots span { width: 8px; height: 8px; background: #E6C200; border-radius: 50%; animation: bounce 1.2s infinite; opacity: 0.8; }
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
