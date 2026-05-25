import { fetchProgrammes, fetchFAQs } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const [programmes, faqs] = await Promise.all([fetchProgrammes(), fetchFAQs()]);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json({ programmes, faqs });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load data' });
  }
}
