// pages/api/knowledge.js
// Returns all programmes and FAQs from Google Sheets

import { getProgrammes, getFaqs } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [programmes, faqs] = await Promise.all([
      getProgrammes(),
      getFaqs(),
    ]);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json({ programmes, faqs });
  } catch (error) {
    console.error('Knowledge fetch error:', error);
    return res.status(500).json({ error: 'Failed to load knowledge base' });
  }
}
