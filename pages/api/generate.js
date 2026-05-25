// pages/api/generate.js
// Calls Anthropic API server-side — API key never exposed to browser

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { parentMessage, programme, programmes, faqs } = req.body;

  if (!parentMessage) {
    return res.status(400).json({ error: 'parentMessage is required' });
  }

  const progContext = programme
    ? `\nPROGRAMME SELECTED:\nName: ${programme.name}\nSubject: ${programme.subject}\nLevel: ${programme.level}\nSchedule: ${programme.schedule}\nFee: ${programme.fee}\nClass size: ${programme.size}\nTopics: ${programme.topics}\nWho it's for: ${programme.who}\nNotes: ${programme.notes}`
    : '\nALL PROGRAMMES:\n' + (programmes || []).map(p => `- ${p.name} (${p.level}): ${p.fee}. ${p.notes}`).join('\n');

  const faqContext = (faqs || []).length
    ? '\n\nFAQs:\n' + faqs.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')
    : '';

  const system = `You are a WhatsApp reply assistant for The Nuggets Academy, a small-group academic coaching centre in Singapore.

Write in the warm, calm voice of Sandra Lim, the founder — like a trusted mentor, never a salesperson.

Rules:
- Short paragraphs, conversational WhatsApp tone
- No bullet points — natural flowing text only
- Warm greeting (e.g. "Hi! Thanks for reaching out 😊")
- Answer the question directly using the knowledge below
- If a specific detail is missing, say "do drop us a message and we can share more" — never invent details
- End with a clear next step or invitation
- Sign off: "— The Nuggets Academy team"
- Max 3–4 short paragraphs
- One or two emojis is fine, not on every sentence

KNOWLEDGE BASE:
${progContext}
${faqContext}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system,
        messages: [{ role: 'user', content: `Parent's WhatsApp message: "${parentMessage}"\n\nWrite a warm, ready-to-send WhatsApp reply.` }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Anthropic API error');
    }

    const reply = data.content?.find(b => b.type === 'text')?.text || '';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Generate error:', error);
    return res.status(500).json({ error: 'Failed to generate reply' });
  }
}
