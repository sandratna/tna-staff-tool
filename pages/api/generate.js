export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { parentMsg, prog, programmes, faqs } = req.body;
  if (!parentMsg) return res.status(400).json({ error: 'No message provided' });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY' });

  const progContext = prog
    ? `\nPROGRAMME: ${prog.name}\nSubject: ${prog.subject}\nLevel: ${prog.level}\nSchedule: ${prog.schedule}\nFee: ${prog.fee}\nClass size: ${prog.class_size || prog.size || ''}\nCoverage: ${prog.topics}\nWho it's for: ${prog.who_is_it_for || prog.who || ''}\nNotes: ${prog.notes || ''}`
    : '\nALL PROGRAMMES:\n' + (programmes || []).map(p => `- ${p.name} (${p.level || ''}): ${p.fee || ''}. ${p.notes || ''}`).join('\n');

  const faqContext = (faqs || []).length
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
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system,
        messages: [{ role: 'user', content: `Parent's message: "${parentMsg}"\n\nWrite a warm ready-to-send WhatsApp reply.` }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: `Anthropic error: ${data.error.message || JSON.stringify(data.error)}` });
    if (!data.content) return res.status(500).json({ error: `Unexpected response: ${JSON.stringify(data)}` });
    const reply = data.content?.find(b => b.type === 'text')?.text || 'Something went wrong.';
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
