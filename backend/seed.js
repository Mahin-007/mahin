/**
 * seed.js — Populate the database with sample current affairs articles,
 * a daily brief, and story connections for demonstration / development.
 *
 * Usage:  node seed.js
 */
import { getDb } from './db.js';
import crypto from 'crypto';

const db = getDb();
const now = new Date().toISOString();
const today = new Date().toISOString().split('T')[0];

function id(url) { return crypto.createHash('md5').update(url).digest('hex'); }

// ─── Articles ────────────────────────────────────────────────────────────────

const articles = [
  { source: 'dawn', category: 'Pakistan', title: 'Pakistan, China sign $2.4bn agreements under CPEC framework', summary: 'Pakistan and China signed multiple agreements worth $2.4 billion under the China-Pakistan Economic Corridor (CPEC) framework during a high-level meeting in Beijing, focusing on energy, infrastructure, and digital connectivity projects that are set to transform the country\'s economic landscape.', url: 'https://dawn.com/cpec-agreements-2025', published_at: new Date(Date.now() - 2*3600000).toISOString() },
  { source: 'dawn', category: 'Pakistan', title: 'Supreme Court takes up PTI funding case amid political tensions', summary: 'The Supreme Court of Pakistan resumed hearing the Pakistan Tehreek-e-Insaf foreign funding case, with the bench questioning the Election Commission\'s delayed proceedings. The case has significant implications for the party\'s legal status ahead of upcoming by-elections.', url: 'https://dawn.com/pti-funding-sc-2025', published_at: new Date(Date.now() - 4*3600000).toISOString() },
  { source: 'dawn', category: 'Pakistan', title: 'IMF review mission arrives in Islamabad for 9th programme assessment', summary: 'An International Monetary Fund review mission has arrived in Islamabad to assess Pakistan\'s progress under its Extended Fund Facility programme. The delegation will meet finance ministry officials and State Bank representatives over a two-week period before recommending release of the next tranche.', url: 'https://dawn.com/imf-review-2025', published_at: new Date(Date.now() - 6*3600000).toISOString() },
  { source: 'dawn', category: 'Pakistan', title: 'Water crisis deepens in Sindh as Indus flows decline sharply', summary: 'Farmers and local communities in Sindh province are facing an acute water shortage as flows in the Indus River reach critically low levels. Agricultural experts warn that delayed monsoon and upstream usage patterns are threatening the kharif crop season.', url: 'https://dawn.com/sindh-water-crisis-2025', published_at: new Date(Date.now() - 8*3600000).toISOString() },
  { source: 'bbc-world', category: 'International', title: 'Gaza ceasefire talks resume in Cairo as humanitarian crisis deepens', summary: 'Egyptian and Qatari mediators have resumed ceasefire negotiations between Israel and Hamas in Cairo, with international pressure mounting over the humanitarian situation in Gaza. UN agencies report critical shortages of food, medicine and clean water affecting over two million civilians.', url: 'https://bbc.co.uk/gaza-ceasefire-cairo-2025', published_at: new Date(Date.now() - 1*3600000).toISOString() },
  { source: 'bbc-world', category: 'International', title: 'Russia advances in eastern Ukraine as Western aid package stalls', summary: 'Russian forces have made incremental gains along the eastern front in Ukraine\'s Donetsk region while a new Western military aid package faces political delays in several European capitals. NATO allies are reassessing their long-term support commitments ahead of a crucial summit.', url: 'https://bbc.co.uk/ukraine-russia-advance-2025', published_at: new Date(Date.now() - 3*3600000).toISOString() },
  { source: 'bbc-world', category: 'International', title: 'UK economy enters technical recession as inflation remains sticky', summary: 'Britain\'s economy contracted for the second consecutive quarter, meeting the technical definition of recession, as persistently high inflation continues to squeeze consumer spending. The Bank of England faces difficult decisions on interest rates with growth stalling and price pressures remaining.', url: 'https://bbc.co.uk/uk-recession-2025', published_at: new Date(Date.now() - 5*3600000).toISOString() },
  { source: 'aljazeera', category: 'International', title: 'Iran-Saudi rapprochement enters new phase with ambassador exchange', summary: 'Iran and Saudi Arabia have formally exchanged ambassadors for the first time in nearly a decade, marking a significant milestone in the Chinese-brokered rapprochement between the two regional powers. Analysts say the development could reshape the geopolitical landscape of the Middle East.', url: 'https://aljazeera.com/iran-saudi-ambassadors-2025', published_at: new Date(Date.now() - 2*3600000).toISOString() },
  { source: 'aljazeera', category: 'International', title: 'Sudan conflict enters third year as humanitarian catastrophe unfolds', summary: 'The conflict between Sudan\'s armed forces and the Rapid Support Forces enters its third year with no end in sight, as the United Nations describes the situation as the world\'s largest humanitarian crisis. Over eight million people have been displaced in what aid agencies call a "forgotten war".', url: 'https://aljazeera.com/sudan-conflict-third-year-2025', published_at: new Date(Date.now() - 7*3600000).toISOString() },
  { source: 'aljazeera', category: 'International', title: 'BRICS expansion reshapes global economic governance structures', summary: 'The expanded BRICS bloc, now including Saudi Arabia, UAE, Egypt, Ethiopia and Iran, is working to establish alternative financial mechanisms that could reduce dollar dependency in global trade. The group\'s combined GDP now represents over 35% of global economic output.', url: 'https://aljazeera.com/brics-expansion-governance-2025', published_at: new Date(Date.now() - 9*3600000).toISOString() },
  { source: 'the-diplomat', category: 'Asia-Pacific', title: 'India-China border talks yield tentative disengagement deal in Ladakh', summary: 'Indian and Chinese military commanders have reached a tentative agreement on disengagement along contested sections of the Line of Actual Control in eastern Ladakh, following months of diplomatic negotiations. The deal covers buffer zones at two flashpoint locations but leaves several disputes unresolved.', url: 'https://thediplomat.com/india-china-ladakh-2025', published_at: new Date(Date.now() - 3*3600000).toISOString() },
  { source: 'the-diplomat', category: 'Asia-Pacific', title: 'South China Sea tensions rise as Philippines-US drills provoke Beijing', summary: 'China has lodged formal protests following expanded US-Philippines military exercises in the South China Sea, including simulated amphibious landings near contested features. Beijing has responded by increasing naval patrols around the Spratly Islands and the Second Thomas Shoal.', url: 'https://thediplomat.com/scs-us-philippines-drills-2025', published_at: new Date(Date.now() - 5*3600000).toISOString() },
  { source: 'the-diplomat', category: 'Asia-Pacific', title: 'Afghanistan\'s Taliban government faces mounting economic isolation', summary: 'Three years since the Taliban takeover, Afghanistan\'s economy remains in crisis with international recognition still withheld by all major powers. The suspension of foreign aid, collapse of banking systems, and restrictions on women\'s employment have created conditions the UN describes as systematic economic collapse.', url: 'https://thediplomat.com/afghanistan-economic-isolation-2025', published_at: new Date(Date.now() - 10*3600000).toISOString() },
  { source: 'the-news', category: 'Pakistan', title: 'Punjab government launches emergency wheat procurement drive', summary: 'The Punjab government has launched an emergency wheat procurement campaign to shore up grain reserves ahead of the lean season. The provincial food department has been directed to purchase 4 million metric tonnes at the government support price to stabilize flour rates across the province.', url: 'https://thenews.com.pk/punjab-wheat-procurement-2025', published_at: new Date(Date.now() - 4*3600000).toISOString() },
  { source: 'the-news', category: 'Pakistan', title: 'KP caretaker government announces mining sector reforms', summary: 'Khyber Pakhtunkhwa\'s government has unveiled sweeping reforms for the mineral extraction sector, including a new transparent auction system for mining licenses and a digitized regulatory framework. The province holds an estimated $800 billion in untapped mineral wealth.', url: 'https://thenews.com.pk/kp-mining-reforms-2025', published_at: new Date(Date.now() - 6*3600000).toISOString() },
  { source: 'foreign-policy', category: 'Geopolitics', title: 'The New Cold War is being fought through economic corridors', summary: 'The competition between the US-led Partnership for Global Infrastructure and Investment and China\'s Belt and Road Initiative has intensified into a defining feature of 21st century geopolitics. Analysis of recent deals shows developing nations increasingly leveraging both blocs for maximum benefit.', url: 'https://foreignpolicy.com/new-cold-war-corridors-2025', published_at: new Date(Date.now() - 8*3600000).toISOString() },
  { source: 'foreign-policy', category: 'Geopolitics', title: 'Dollar dominance faces structural challenge from BRICS payment systems', summary: 'The BRICS nations are advancing alternative payment systems that could gradually erode the US dollar\'s role as the world\'s reserve currency. While de-dollarization faces significant structural obstacles, the political will among major emerging economies marks a meaningful shift in the post-1945 monetary order.', url: 'https://foreignpolicy.com/dollar-brics-dedollarization-2025', published_at: new Date(Date.now() - 11*3600000).toISOString() },
  { source: 'reuters', category: 'International', title: 'Oil prices surge on Middle East supply fears and OPEC+ cuts', summary: 'Crude oil prices jumped over 3% on renewed concerns about Middle East supply disruptions combined with extended OPEC+ production cuts. Brent crude topped $94 per barrel as traders assessed risks to Iranian output and shipping through the Strait of Hormuz amid regional tensions.', url: 'https://reuters.com/oil-prices-middle-east-2025', published_at: new Date(Date.now() - 2*3600000).toISOString() },
  { source: 'reuters', category: 'International', title: 'Federal Reserve signals rate cuts may be delayed into second half', summary: 'Federal Reserve officials have signaled that interest rate cuts may be pushed back to the second half of the year as inflation proves stickier than expected. Fed chair comments at a policy conference indicated the central bank needs more confidence that inflation is sustainably declining before easing monetary policy.', url: 'https://reuters.com/fed-rate-cuts-delayed-2025', published_at: new Date(Date.now() - 4*3600000).toISOString() },
  { source: 'guardian', category: 'International', title: 'Climate finance gap widens as rich nations fall short on $100bn pledge', summary: 'A new analysis by climate researchers has revealed that developed nations have consistently fallen short of the $100 billion annual climate finance pledge made to developing countries in 2009. With COP30 approaching, pressure is mounting for a credible new financial commitment framework.', url: 'https://theguardian.com/climate-finance-gap-2025', published_at: new Date(Date.now() - 6*3600000).toISOString() },
  { source: 'guardian', category: 'International', title: 'UN warns of democratic backsliding across Asia and Africa', summary: 'A new United Nations report documents significant democratic backsliding across 34 countries in Asia and Africa over the past five years, with military coups, electoral manipulation and press freedom restrictions reaching their highest levels since the Cold War era according to governance indices.', url: 'https://theguardian.com/democratic-backsliding-un-2025', published_at: new Date(Date.now() - 9*3600000).toISOString() },
];

const insertArticle = db.prepare(`
  INSERT OR IGNORE INTO articles (id, title, summary, url, source, category, published_at, fetched_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

let articleCount = 0;
for (const a of articles) {
  const r = insertArticle.run(id(a.url), a.title, a.summary, a.url, a.source, a.category, a.published_at, now);
  if (r.changes) articleCount++;
}
console.log(`✅ Articles: inserted ${articleCount}/${articles.length}`);

// ─── Daily Brief ─────────────────────────────────────────────────────────────

db.prepare('DELETE FROM daily_briefs WHERE date = ?').run(today);

const briefText = `The international landscape today is defined by three converging pressures: escalating geopolitical competition between major powers, deepening economic fragmentation, and worsening humanitarian conditions in multiple conflict zones. Gaza ceasefire negotiations resumed in Cairo under Egyptian and Qatari mediation, yet meaningful progress remains elusive as Israeli military operations continue and UN agencies report catastrophic food and medicine shortages affecting over two million civilians. Simultaneously, Russia's incremental territorial advances in eastern Ukraine's Donetsk region are exposing fractures in Western resolve, with several European capitals delaying the latest military aid package amid domestic political pressures. These parallel crises are stretching international diplomatic bandwidth thin.

On the economic front, global markets are navigating a period of acute uncertainty. Oil prices surged over 3% on dual pressures — OPEC+ production cuts and renewed fears of Middle East supply disruption through the Strait of Hormuz — while the US Federal Reserve's signals of delayed interest rate cuts sent ripples through emerging market currencies. Pakistan, already under IMF programme conditions, faces compounded external pressures as the review mission arrives in Islamabad to assess fiscal consolidation targets. The IMF review outcome is critical: a successful assessment unlocks the next tranche and signals to global creditors that Pakistan's economic stabilisation trajectory remains intact.

For Pakistan specifically, today's news underscores the country's precarious but pivotal position at the intersection of great power competition. The CPEC framework's $2.4 billion in new agreements reflects Beijing's sustained strategic commitment, even as Washington advances its own infrastructure alternatives across the developing world. Internally, the PTI funding case before the Supreme Court adds legal uncertainty to an already complex political environment, while Sindh's worsening water crisis signals structural vulnerabilities in agricultural planning that will define the kharif crop season. The KP mining reforms, if implemented effectively, represent one of Pakistan's most significant untapped economic opportunities — an $800 billion mineral wealth base that could fundamentally alter its fiscal trajectory.

The broader structural shifts reshaping global order — BRICS expansion challenging dollar dominance, Iran-Saudi normalisation reshaping Middle East alignments, India-China border talks yielding tentative disengagement — all point to a multipolar transition that is accelerating faster than institutional frameworks can adapt. For students of current affairs, today's news is a masterclass in how domestic economic pressures, regional security dynamics, and great power competition intersect to define the choices available to states like Pakistan navigating this volatile environment.`;

const themes = ["Pakistan-IMF Programme", "Gaza & Middle East Crisis", "CPEC & China-Pakistan Relations", "Russia-Ukraine & Western Aid", "BRICS & De-dollarisation", "South Asia Security Dynamics"];

db.prepare('INSERT INTO daily_briefs (date, brief, key_themes, generated_at) VALUES (?,?,?,?)').run(today, briefText, JSON.stringify(themes), now);
console.log('✅ Daily brief created');

// ─── Connections ─────────────────────────────────────────────────────────────

db.prepare('DELETE FROM connections').run();

const allArticles = db.prepare('SELECT id, source FROM articles').all();
const bySource = (src) => allArticles.find(a => a.source === src)?.id;

const connections = [
  {
    ids: [bySource('dawn'), bySource('foreign-policy'), bySource('aljazeera')],
    title: 'CPEC, BRI & the New Economic Cold War',
    desc: 'Pakistan\'s new $2.4bn CPEC agreements, Foreign Policy\'s analysis of infrastructure competition, and BRICS expansion all reflect the same tectonic shift: China and its partners are building parallel economic architecture to rival Western-led institutions. For Pakistan, navigating between these blocs is both an opportunity and a strategic risk.',
    strength: 'high'
  },
  {
    ids: [bySource('dawn'), bySource('reuters'), bySource('bbc-world')],
    title: 'IMF, Fed Rates & Pakistan\'s External Pressures',
    desc: 'The IMF review mission in Islamabad, the Federal Reserve\'s delayed rate cuts, and the UK recession all point to a synchronised tightening of global financial conditions. For Pakistan — reliant on external financing and sensitive to dollar movements — a prolonged high-rate environment compounds the challenge of IMF programme compliance.',
    strength: 'high'
  },
  {
    ids: [bySource('aljazeera'), bySource('bbc-world'), bySource('reuters')],
    title: 'Middle East Crisis Driving Global Oil Volatility',
    desc: 'Gaza ceasefire failures in Cairo, heightened Strait of Hormuz risks, and oil\'s 3% surge are causally linked: sustained regional conflict directly threatens energy supply routes that underpin global commodity pricing. Pakistan, as a net energy importer, faces direct fiscal consequences from this volatility.',
    strength: 'high'
  },
  {
    ids: [bySource('the-diplomat'), bySource('aljazeera'), bySource('foreign-policy')],
    title: 'Asia\'s Shifting Alignments: India-China, BRICS & Afghanistan',
    desc: 'India-China border disengagement in Ladakh, BRICS economic expansion, and Afghanistan\'s ongoing isolation collectively reveal an Asian geopolitical landscape in flux. Tentative India-China thaw could reshape regional dynamics, while BRICS expansion signals a coordinated effort to build leverage outside Western multilateral institutions.',
    strength: 'medium'
  },
  {
    ids: [bySource('bbc-world'), bySource('guardian'), bySource('aljazeera')],
    title: 'Democratic Erosion & Humanitarian Crises',
    desc: 'The UN\'s democratic backsliding report, Sudan\'s third year of conflict, and the ongoing Ukraine war together illustrate a global pattern: weakening institutions create space for prolonged conflict and humanitarian emergencies. The climate finance gap further shows how international commitments collapse when political will is tested.',
    strength: 'medium'
  }
];

const insertConn = db.prepare('INSERT INTO connections (article_ids, connection_title, connection_description, strength, generated_at) VALUES (?,?,?,?,?)');
let connCount = 0;
for (const c of connections) {
  const ids = c.ids.filter(Boolean);
  if (ids.length >= 2) { insertConn.run(JSON.stringify(ids), c.title, c.desc, c.strength, now); connCount++; }
}
console.log(`✅ Story connections: ${connCount} created`);
console.log('\n📊 Final stats:');
console.log('  Articles:', db.prepare('SELECT COUNT(*) c FROM articles').get().c);
console.log('  Briefs:  ', db.prepare('SELECT COUNT(*) c FROM daily_briefs').get().c);
console.log('  Connections:', db.prepare('SELECT COUNT(*) c FROM connections').get().c);
