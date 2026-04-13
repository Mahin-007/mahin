import Anthropic from '@anthropic-ai/sdk';
import { getDb } from '../db.js';
import { getArticles } from './rssService.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function formatArticlesForAI(articles) {
  return articles.slice(0, 30).map((a, i) =>
    `[${i + 1}] SOURCE: ${a.source.toUpperCase()} | ${a.title}\n${a.summary || 'No summary available.'}`
  ).join('\n\n');
}

export async function generateDailyBrief() {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  // Check if brief already exists for today
  const existing = db.prepare('SELECT * FROM daily_briefs WHERE date = ?').get(today);
  if (existing) return existing;

  const articles = getArticles({ limit: 40 });
  if (articles.length === 0) return null;

  const articleText = formatArticlesForAI(articles);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: `You are an expert analyst for current affairs, specializing in Pakistani and international geopolitics, economics, and diplomacy.
Your task is to create concise, insightful daily news briefs for students and professionals preparing for competitive exams or current affairs analysis.
Always write in a formal, analytical tone. Identify the most significant stories and their implications.`,
      messages: [{
        role: 'user',
        content: `Today is ${today}. Below are the latest news articles from major international and Pakistani news sources.

${articleText}

Please provide:
1. **DAILY BRIEF**: A comprehensive 3-4 paragraph summary of the most important news of the day. Focus on geopolitics, Pakistan, economy, and international relations.

2. **KEY THEMES** (list 4-6 major themes/topics dominating today's news, as a JSON array of strings)

3. **CRITICAL STORIES** (the 3 most important stories today with a one-line analysis each)

Format your response as JSON:
{
  "brief": "Full text of daily brief...",
  "key_themes": ["Theme 1", "Theme 2", ...],
  "critical_stories": [
    {"title": "Story title", "analysis": "One-line analysis"},
    ...
  ]
}`
      }],
    });

    const content = response.content[0].text;
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      parsed = {
        brief: content,
        key_themes: ['International Relations', 'Pakistan', 'Economy'],
        critical_stories: []
      };
    }

    const result = db.prepare(`
      INSERT OR REPLACE INTO daily_briefs (date, brief, key_themes, generated_at)
      VALUES (?, ?, ?, ?)
    `).run(today, parsed.brief, JSON.stringify(parsed.key_themes), new Date().toISOString());

    return {
      id: result.lastInsertRowid,
      date: today,
      brief: parsed.brief,
      key_themes: parsed.key_themes,
      critical_stories: parsed.critical_stories || [],
      generated_at: new Date().toISOString()
    };
  } catch (err) {
    console.error('AI brief generation error:', err.message);
    throw err;
  }
}

export async function findConnections() {
  const db = getDb();
  const articles = getArticles({ limit: 30 });
  if (articles.length < 3) return [];

  const articleText = articles.slice(0, 25).map((a, i) =>
    `[${i + 1}] ${a.source.toUpperCase()}: ${a.title}`
  ).join('\n');

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: `You are an expert news analyst. Your job is to identify meaningful connections between news stories from different sources — stories that are related, causally linked, or illuminate the same geopolitical/economic theme.`,
      messages: [{
        role: 'user',
        content: `Analyze these news articles and identify 3-5 meaningful connections between them:

${articleText}

Return JSON array of connections:
[
  {
    "article_indices": [1, 4, 7],
    "title": "Short connection title",
    "description": "2-3 sentence explanation of how these stories connect and why it matters",
    "strength": "high|medium|low"
  }
]

Focus on genuinely meaningful connections (same event from different angles, cause-effect relationships, related geopolitical dynamics). Return only JSON.`
      }],
    });

    const content = response.content[0].text;
    let connections = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      connections = JSON.parse(jsonMatch ? jsonMatch[0] : '[]');
    } catch {
      return [];
    }

    // Save connections to DB
    const insert = db.prepare(`
      INSERT INTO connections (article_ids, connection_title, connection_description, strength, generated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    const savedConnections = connections.map(conn => {
      const articleIds = (conn.article_indices || []).map(i => articles[i - 1]?.id).filter(Boolean);
      if (articleIds.length < 2) return null;
      const result = insert.run(
        JSON.stringify(articleIds),
        conn.title,
        conn.description,
        conn.strength || 'medium',
        now
      );

      // Attach article titles for display
      const linkedArticles = articleIds.map(id => articles.find(a => a.id === id)).filter(Boolean);
      return {
        id: result.lastInsertRowid,
        title: conn.title,
        description: conn.description,
        strength: conn.strength || 'medium',
        articles: linkedArticles.map(a => ({ id: a.id, title: a.title, source: a.source })),
        generated_at: now
      };
    }).filter(Boolean);

    return savedConnections;
  } catch (err) {
    console.error('Connection finding error:', err.message);
    return [];
  }
}

export async function analyzeArticle(articleId) {
  const db = getDb();
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId);
  if (!article) throw new Error('Article not found');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `Analyze this news article for a current affairs student:

Title: ${article.title}
Source: ${article.source}
Summary: ${article.summary}

Provide:
1. Key facts (3 bullet points)
2. Significance for Pakistan/region (2 sentences)
3. Exam angle: What current affairs question could this generate?

Keep it concise and analytical.`
    }],
  });

  return {
    article,
    analysis: response.content[0].text
  };
}

export function getTodaysBrief() {
  const today = new Date().toISOString().split('T')[0];
  const db = getDb();
  return db.prepare('SELECT * FROM daily_briefs WHERE date = ?').get(today);
}

export function getRecentConnections(limit = 10) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM connections ORDER BY generated_at DESC LIMIT ?').all(limit);
  return rows.map(r => ({
    ...r,
    article_ids: JSON.parse(r.article_ids || '[]')
  }));
}
