import { useState } from 'react';
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { useArticles } from '../hooks/useNews';
import NewsCard from './NewsCard';

const SOURCE_NAMES = {
  dawn: 'Dawn', 'bbc-world': 'BBC World', bbc: 'BBC', aljazeera: 'Al Jazeera',
  'the-diplomat': 'The Diplomat', 'the-news': 'The News', 'foreign-policy': 'Foreign Policy',
  reuters: 'Reuters', guardian: 'Guardian', 'ap-news': 'AP News',
};

export default function NewsFeed({ source, category }) {
  const [search, setSearch] = useState('');
  const [compact, setCompact] = useState(false);
  const { articles, loading, error } = useArticles({ source, category, limit: 60 });

  const filtered = search.trim()
    ? articles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.summary || '').toLowerCase().includes(search.toLowerCase())
      )
    : articles;

  const pageTitle = source
    ? SOURCE_NAMES[source] || source
    : category || 'All News';

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white font-serif">{pageTitle}</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {loading ? 'Loading...' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Search & Controls */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2
                       text-sm text-slate-200 placeholder-slate-600
                       focus:outline-none focus:border-blue-500/50 focus:bg-white/8
                       transition-all duration-150"
          />
        </div>
        <button
          onClick={() => setCompact(!compact)}
          className={`btn-ghost ${compact ? 'text-blue-400 bg-blue-500/10' : ''}`}
          title="Toggle compact view"
        >
          <SlidersHorizontal size={15} />
          {compact ? 'Compact' : 'Full'}
        </button>
      </div>

      {/* Content */}
      {error ? (
        <div className="glass-card p-6 flex items-center gap-3 border-red-500/20 bg-red-500/5">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-300">Failed to load articles</p>
            <p className="text-xs text-red-400 mt-0.5">{error}</p>
          </div>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse space-y-2">
              <div className="flex gap-2 items-center">
                <div className="h-3 bg-white/5 rounded w-16" />
                <div className="h-3 bg-white/5 rounded w-24 ml-auto" />
              </div>
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-4/5" />
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Search size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">
            {search ? 'No articles match your search' : 'No articles available yet'}
          </p>
          {search && (
            <button onClick={() => setSearch('')} className="btn-ghost mt-3 mx-auto">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(article => (
            <NewsCard key={article.id} article={article} compact={compact} />
          ))}
        </div>
      )}
    </div>
  );
}
