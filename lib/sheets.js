// Fetches data from Google Sheets (public sheet, read-only via API key)

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;

const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

function rowsToObjects(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  return rows.slice(1).filter(r => r.some(cell => cell?.trim())).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (row[i] || '').trim(); });
    return obj;
  });
}

export async function fetchProgrammes() {
  try {
    const res = await fetch(`${BASE}/Programmes!A1:Z200?key=${API_KEY}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Sheet fetch failed');
    const data = await res.json();
    return rowsToObjects(data.values || []);
  } catch (e) {
    console.error('fetchProgrammes error:', e);
    return [];
  }
}

export async function fetchFAQs() {
  try {
    const res = await fetch(`${BASE}/FAQs!A1:Z500?key=${API_KEY}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Sheet fetch failed');
    const data = await res.json();
    return rowsToObjects(data.values || []);
  } catch (e) {
    console.error('fetchFAQs error:', e);
    return [];
  }
}
