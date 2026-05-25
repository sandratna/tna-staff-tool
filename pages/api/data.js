export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
  const SHEET_ID = process.env.SHEET_ID;

  if (!API_KEY || !SHEET_ID) {
    return res.status(500).json({ error: 'Missing GOOGLE_SHEETS_API_KEY or SHEET_ID environment variables' });
  }

  const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

  function rowsToObjects(rows) {
    if (!rows || rows.length < 2) return [];
    const headers = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    return rows.slice(1)
      .filter(r => r.some(cell => cell?.trim()))
      .map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = (row[i] || '').trim(); });
        return obj;
      });
  }

  try {
    const [progRes, faqRes] = await Promise.all([
      fetch(`${BASE}/Programmes!A1:Z500?key=${API_KEY}`),
      fetch(`${BASE}/FAQs!A1:Z500?key=${API_KEY}`)
    ]);

    if (!progRes.ok) {
      const err = await progRes.text();
      return res.status(500).json({ error: `Programmes fetch failed: ${err}` });
    }
    if (!faqRes.ok) {
      const err = await faqRes.text();
      return res.status(500).json({ error: `FAQs fetch failed: ${err}` });
    }

    const [progData, faqData] = await Promise.all([progRes.json(), faqRes.json()]);
    const programmes = rowsToObjects(progData.values || []);
    const faqs = rowsToObjects(faqData.values || []);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ programmes, faqs });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
