# TNA Staff Tool — Setup Instructions

---

## STEP 1 — Create your Google Sheet

1. Go to **sheets.google.com** and create a new spreadsheet
2. Name it: `TNA Staff Tool Data`
3. You need **two tabs** — rename them exactly as shown:

**Tab 1: Programmes**
Add these exact column headers in Row 1:
```
name | subject | level | schedule | fee | class_size | topics | who_is_it_for | notes
```

**Tab 2: FAQs**
Add these exact column headers in Row 1:
```
category | question | answer
```

4. Fill in your programme and FAQ data under those headers
5. Copy the Sheet ID from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID_IS_HERE/edit`
   - Copy the long string between `/d/` and `/edit`

---

## STEP 2 — Make the Sheet public (read-only)

1. Click **Share** (top right)
2. Under "General access" → change to **Anyone with the link**
3. Set permission to **Viewer** (read-only is fine)
4. Click Done

---

## STEP 3 — Get a Google Sheets API Key

1. Go to **console.cloud.google.com**
2. Create a new project (call it `TNA Staff Tool`)
3. In the search bar, search for **Google Sheets API**
4. Click **Enable**
5. Go to **Credentials** (left sidebar)
6. Click **+ Create Credentials** → **API Key**
7. Copy the API key
8. Optional but recommended: Click on the key → under "API restrictions" → restrict to Google Sheets API only

---

## STEP 4 — Deploy to Vercel

1. Go to **github.com** and create a new repository called `tna-staff-tool`
2. Upload all the files from this folder into that repo
3. Go to **vercel.com** → New Project → Import your GitHub repo
4. Before deploying, add these Environment Variables in Vercel:
   - `NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY` = your API key from Step 3
   - `NEXT_PUBLIC_SHEET_ID` = your Sheet ID from Step 1
5. Click **Deploy**
6. Vercel gives you a URL like `tna-staff-tool.vercel.app` — that's your permanent link

---

## STEP 5 — Embed in Notion

1. Copy your Vercel URL
2. In Notion, type `/embed`
3. Paste the URL
4. Done — it loads live inside Notion

---

## How to update programme info or FAQs

Just edit the Google Sheet directly. Changes appear in the tool within ~60 seconds (the tool refreshes data on each load, and staff can hit the ↻ Refresh button anytime).

No need to redeploy to Vercel when data changes — only redeploy if you change the code itself.

---

## Programmes to add to your sheet

| name | subject | level | schedule | fee | class_size | topics | who_is_it_for | notes |
|------|---------|-------|----------|-----|-----------|--------|--------------|-------|
| Weekly Classes — Primary Maths | Maths — Primary | P3 – P6 | Once a week, 1.5 hours | Contact us | Max 6 students | Number operations, fractions, decimals, percentages, ratio, problem sums frameworks, heuristics | Struggling or average students wanting to strengthen Maths foundation | Trial class available |
| Weekly Classes — Primary Science | Science — Primary | P3 – P6 | Once a week, 1.5 hours | Contact us | Max 6 students | Diversity of living things, cycles, systems, interactions, energy. SEQ answering frameworks | Students who find Science keywords and structured answers difficult | Trial class available |
| Weekly Classes — Primary English | English — Primary | P3 – P6 | Once a week, 1.5 hours | Contact us | Max 6 students | Comprehension, oral, composition, situational writing, grammar, vocabulary, cloze | Students who need to improve English across all components | Trial class available |
| Bloom Classes — Primary Maths | Maths — Bloom | P3 – P6 | Once a week, 1.5 hours | Contact us | Max 4 students | Customised Maths coaching — number operations, fractions, problem sums, heuristics. Tailored to each student's gaps | Students who need more personalised attention than a standard group class | Smaller group of 4 for more customised coaching. Trial available |
| Creative Writing | English — Creative Writing | P3 – P6 | Once a week | Contact us | Max 6 students | Story structure, character development, descriptive writing, dialogue, sensory language | Students wanting to improve composition writing | Can be standalone or alongside English class |
| Problem Sums Masterclass | Problem Sums Masterclass | P3 – P6 | Check current schedule | Contact us | Max 6 students | Model drawing, before-and-after, external transfer, simultaneous concepts, working backwards | Students who specifically struggle with problem sums | Popular before SA2 and PSLE |
| Weekly Classes — Secondary Maths | Maths — Secondary | Sec 1 – Sec 4 | Once a week, 1.5 hours | Contact us | Max 6 students | Algebra, geometry, trigonometry, statistics, functions. E-Maths and A-Maths | Secondary students closing gaps or preparing for O-Levels | Trial class available |
| Weekly Classes — Secondary Science | Science — Secondary | Sec 1 – Sec 4 | Once a week, 1.5 hours | Contact us | Max 6 students | Biology, Chemistry, Physics. O-Level syllabus. Structured answer techniques | Secondary students building understanding in Science | Specify subject when enquiring |
| Brain Train | Brain Train | P1 – P4 | Once a week | Contact us | Max 6 students | Logical thinking, pattern recognition, number sense, critical reasoning | Younger primary students building thinking foundations | Trains cognitive skills that support all subjects |
| Holiday Bootcamps | Holiday Bootcamp | P3 – P6 | School holidays only | Contact us per bootcamp | Small group | Intensive revision. Foundational gaps and exam-readiness | Students wanting to use holidays to catch up or get ahead | Limited spots. Early registration recommended |

