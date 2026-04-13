import { Globe, Newspaper, Link2, BarChart2, RefreshCw, BookOpen, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Pakistan', 'International', 'Asia-Pacific', 'Geopolitics'];

const SOURCE_COLORS = {
  dawn: '#00B04F',
  'bbc-world': '#BB1919',
  bbc: '#BB1919',
  aljazeera: '#D4A017',
  'the-diplomat': '#4A90D9',
  'the-news': '#2E7D32',
  'foreign-policy': '#7B1FA2',
  reuters: '#FF6B00',
  guardian: '#052962',
  'ap-news': '#CC0000',
};

export default function Sidebar({ activeView, setActiveView, activeSource, setActiveSource, activeCategory, setActiveCategory, sources, stats, onRefresh, refreshing }) {
  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/10 bg-[#070c1a]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Current Affairs</h1>
            <p className="text-xs text-slate-500">Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Views */}
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-2 mb-2">Overview</p>
          <div className="space-y-0.5">
            <button
              onClick={() => { setActiveView('feed'); setActiveSource(null); setActiveCategory(null); }}
              className={`nav-item w-full text-left ${activeView === 'feed' && !activeSource && !activeCategory ? 'active' : ''}`}
            >
              <Newspaper size={15} />
              <span>News Feed</span>
              {stats && <span className="ml-auto text-xs text-slate-600">{stats.totalArticles}</span>}
            </button>
            <button
              onClick={() => setActiveView('brief')}
              className={`nav-item w-full text-left ${activeView === 'brief' ? 'active' : ''}`}
            >
              <BookOpen size={15} />
              <span>Daily Brief</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            </button>
            <button
              onClick={() => setActiveView('connections')}
              className={`nav-item w-full text-left ${activeView === 'connections' ? 'active' : ''}`}
            >
              <Link2 size={15} />
              <span>Connections</span>
            </button>
            <button
              onClick={() => setActiveView('stats')}
              className={`nav-item w-full text-left ${activeView === 'stats' ? 'active' : ''}`}
            >
              <BarChart2 size={15} />
              <span>Insights</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-2 mb-2">Categories</p>
          <div className="space-y-0.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveView('feed');
                  setActiveCategory(cat === 'All' ? null : cat);
                  setActiveSource(null);
                }}
                className={`nav-item w-full text-left ${activeCategory === (cat === 'All' ? null : cat) && activeView === 'feed' && !activeSource ? 'active' : ''}`}
              >
                <Globe size={14} className="opacity-70" />
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-2 mb-2">Sources</p>
          <div className="space-y-0.5">
            {sources.map(source => (
              <button
                key={source.id}
                onClick={() => {
                  setActiveView('feed');
                  setActiveSource(source.id);
                  setActiveCategory(null);
                }}
                className={`nav-item w-full text-left group ${activeSource === source.id ? 'active' : ''}`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: SOURCE_COLORS[source.id] || '#64748B' }}
                />
                <span className="truncate">{source.name}</span>
                <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {stats && (
          <div className="glass-card px-3 py-2 text-xs text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Articles today</span>
              <span className="text-slate-300 font-medium">{stats.todayArticles}</span>
            </div>
            <div className="flex justify-between">
              <span>Sources active</span>
              <span className="text-slate-300 font-medium">{stats.sources}</span>
            </div>
          </div>
        )}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="btn-ghost w-full justify-center"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh All'}
        </button>
      </div>
    </aside>
  );
}
