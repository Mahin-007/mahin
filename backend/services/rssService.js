import Parser from 'rss-parser';
import { getDb } from '../db.js';
import crypto from 'crypto';

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NewsAnalyzer/1.0)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  },
  customFields: {
    item: [['media:thumbnail', 'mediaThumbnail'], ['enclosure', 'enclosure'], ['dc:creator', 'creator']]
  }
});

export const SOURCES = [
  {
    id: 'dawn',
    name: 'Dawn',
    url: 'https://www.dawn.com/feeds/home',
    category: 'Pakistan',
    color: '#00B04F',
    flag: 'PK'
  },
  {
    id: 'bbc-world',
    name: 'BBC World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'International',
    color: '#BB1919',
    flag: 'GB'
  },
  {
    id: 'bbc',
    name: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    category: 'International',
    color: '#BB1919',
    flag: 'GB'
  },
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'International',
    color: '#D4A017',
    flag: 'QA'
  },
  {
    id: 'the-diplomat',
    name: 'The Diplomat',
    url: 'https://thediplomat.com/feed/',
    category: 'Asia-Pacific',
    color: '#4A90D9',
    flag: 'INT'
  },
  {
    id: 'the-news',
    name: 'The News',
    url: 'https://www.thenews.com.pk/rss/1/1',
    category: 'Pakistan',
    color: '#2E7D32',
    flag: 'PK'
  },
  {
    id: 'foreign-policy',
    name: 'Foreign Policy',
    url: 'https://foreignpolicy.com/feed/',
    category: 'Geopolitics',
    color: '#7B1FA2',
    flag: 'INT'
  },
  {
    id: 'reuters',
    name: 'Reuters',
    url: 'https://feeds.reuters.com/reuters/topNews',
    category: 'International',
    color: '#FF6B00',
    flag: 'INT'
  },
  {
    id: 'guardian',
    name: 'The Guardian',
    url: 'https://www.theguardian.com/world/rss',
    category: 'International',
    color: '#052962',
    flag: 'GB'
  },
  {
    id: 'ap-news',
    name: 'AP News',
    url: 'https://rsshub.app/ap/topics/apf-topnews',
    category: 'International',
    color: '#CC0000',
    flag: 'US'
  }
];

function generateId(url) {
  return crypto.createHash('md5').update(url).digest('hex');
}

function extractImage(item) {
  if (item.mediaThumbnail?.$ ?.url) return item.mediaThumbnail.$.url;
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) return item.enclosure.url;
  // Try to extract from content
  const contentMatch = (item.content || item['content:encoded'] || '').match(/<img[^>]+src="([^"]+)"/i);
  if (contentMatch) return contentMatch[1];
  return null;
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchSource(source) {
  try {
    const feed = await parser.parseURL(source.url);
    const db = getDb();
    const now = new Date().toISOString();
    let newCount = 0;

    const insert = db.prepare(`
      INSERT OR IGNORE INTO articles (id, title, summary, url, source, category, published_at, fetched_at, image_url, author)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of (feed.items || []).slice(0, 20)) {
      if (!item.link || !item.title) continue;
      const id = generateId(item.link);
      const summary = cleanText(item.contentSnippet || item.summary || item.content || '').substring(0, 500);
      const result = insert.run(
        id,
        cleanText(item.title),
        summary,
        item.link,
        source.id,
        source.category,
        item.pubDate ? new Date(item.pubDate).toISOString() : now,
        now,
        extractImage(item),
        cleanText(item.creator || item.author || '')
      );
      if (result.changes > 0) newCount++;
    }

    console.log(`[${source.name}] Fetched ${feed.items?.length || 0} items, ${newCount} new`);
    return { source: source.id, success: true, newCount };
  } catch (err) {
    console.error(`[${source.name}] Error: ${err.message}`);
    return { source: source.id, success: false, error: err.message };
  }
}

export async function fetchAllSources() {
  const results = await Promise.allSettled(SOURCES.map(s => fetchSource(s)));
  return results.map((r, i) => r.status === 'fulfilled' ? r.value : { source: SOURCES[i].id, success: false });
}

export function getArticles({ source, category, limit = 50, offset = 0 } = {}) {
  const db = getDb();
  let query = 'SELECT * FROM articles WHERE 1=1';
  const params = [];

  if (source) { query += ' AND source = ?'; params.push(source); }
  if (category) { query += ' AND category = ?'; params.push(category); }

  query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  return db.prepare(query).all(...params);
}

export function getArticleCount() {
  return getDb().prepare('SELECT COUNT(*) as count FROM articles').get();
}
