import cron from 'node-cron';
import { fetchAllSources } from './rssService.js';
import { generateDailyBrief, findConnections } from './aiService.js';

let isRunning = false;

async function runPipeline(label = '') {
  if (isRunning) {
    console.log(`[Scheduler] Pipeline already running, skipping ${label}`);
    return;
  }
  isRunning = true;
  console.log(`[Scheduler] Starting pipeline${label ? ` (${label})` : ''}...`);
  try {
    // 1. Fetch all RSS feeds
    const fetchResults = await fetchAllSources();
    const successful = fetchResults.filter(r => r.success).length;
    console.log(`[Scheduler] Fetched from ${successful}/${fetchResults.length} sources`);

    // 2. Generate daily brief
    await generateDailyBrief();
    console.log('[Scheduler] Daily brief generated');

    // 3. Find story connections
    await findConnections();
    console.log('[Scheduler] Connections analyzed');
  } catch (err) {
    console.error('[Scheduler] Pipeline error:', err.message);
  } finally {
    isRunning = false;
  }
}

export function startScheduler() {
  // Run immediately on startup
  runPipeline('startup').catch(console.error);

  // Fetch news every 30 minutes
  cron.schedule('*/30 * * * *', () => {
    fetchAllSources().then(results => {
      const successful = results.filter(r => r.success).length;
      console.log(`[Cron] 30-min fetch: ${successful}/${results.length} sources`);
    }).catch(console.error);
  });

  // Generate daily brief at 7 AM
  cron.schedule('0 7 * * *', () => {
    console.log('[Cron] Generating morning daily brief...');
    generateDailyBrief().catch(console.error);
  });

  // Find connections at 8 AM and 6 PM
  cron.schedule('0 8,18 * * *', () => {
    console.log('[Cron] Finding story connections...');
    findConnections().catch(console.error);
  });

  console.log('[Scheduler] Cron jobs scheduled');
}

export { runPipeline };
