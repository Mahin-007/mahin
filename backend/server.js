import express from 'express';
import cors from 'cors';
import { getArticles, getArticleCount, SOURCES } from './services/rssService.js';
import { generateDailyBrief, findConnections, analyzeArticle, getTodaysBrief, getRecentConnections } from './services/aiService.js';
import { startScheduler, runPipeline } from './services/scheduler.js';
import { getDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json());

// ─── Routes ────────────────────────────────────────────────

// GET /api/articles
app.get('/api/articles', (req, res) => {
  try {
    const { source, category, limit = '50', offset = '0' } = req.query;
    const articles = getArticles({
      source,
      category,
      limit: Math.min(parseInt(limit), 100),
      offset: parseInt(offset)
    });
    const { count } = getArticleCount();
    res.json({ articles, total: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/brief
app.get('/api/brief', async (req, res) => {
  try {
    let brief = getTodaysBrief();
    if (!brief) {
      brief = await generateDailyBrief();
    } else {
      // Parse key_themes if stored as string
      if (typeof brief.key_themes === 'string') {
        try { brief.key_themes = JSON.parse(brief.key_themes); } catch {}
      }
    }
    res.json(brief);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/brief/regenerate
app.post('/api/brief/regenerate', async (req, res) => {
  try {
    // Delete today's brief to force regeneration
    const today = new Date().toISOString().split('T')[0];
    getDb().prepare('DELETE FROM daily_briefs WHERE date = ?').run(today);
    const brief = await generateDailyBrief();
    res.json(brief);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/connections
app.get('/api/connections', (req, res) => {
  try {
    const connections = getRecentConnections(10);
    // Enrich with article titles
    const db = getDb();
    const enriched = connections.map(conn => {
      const articles = conn.article_ids.map(id =>
        db.prepare('SELECT id, title, source FROM articles WHERE id = ?').get(id)
      ).filter(Boolean);
      return { ...conn, articles };
    });
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/connections/refresh
app.post('/api/connections/refresh', async (req, res) => {
  try {
    const connections = await findConnections();
    res.json(connections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/article/:id/analyze
app.post('/api/article/:id/analyze', async (req, res) => {
  try {
    const result = await analyzeArticle(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/refresh
app.post('/api/refresh', async (req, res) => {
  try {
    res.json({ message: 'Refresh started in background' });
    runPipeline('manual').catch(console.error);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sources
app.get('/api/sources', (req, res) => {
  res.json(SOURCES.map(s => ({ id: s.id, name: s.name, category: s.category, color: s.color })));
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  try {
    const db = getDb();
    const total = db.prepare('SELECT COUNT(*) as count FROM articles').get();
    const today = new Date().toISOString().split('T')[0];
    const todayCount = db.prepare("SELECT COUNT(*) as count FROM articles WHERE fetched_at >= ?").get(today + 'T00:00:00.000Z');
    const briefs = db.prepare('SELECT COUNT(*) as count FROM daily_briefs').get();
    const connections = db.prepare('SELECT COUNT(*) as count FROM connections').get();
    res.json({
      totalArticles: total.count,
      todayArticles: todayCount.count,
      totalBriefs: briefs.count,
      totalConnections: connections.count,
      sources: SOURCES.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start ──────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🗞️  News Analyzer API running on http://localhost:${PORT}`);
  console.log(`📡 Starting news aggregation...\n`);
  startScheduler();
});
