import { RefreshCw, Link2, ExternalLink } from 'lucide-react';
import { useConnections } from '../hooks/useNews';

const SOURCE_NAMES = {
  dawn: 'Dawn', 'bbc-world': 'BBC World', bbc: 'BBC', aljazeera: 'Al Jazeera',
  'the-diplomat': 'The Diplomat', 'the-news': 'The News', 'foreign-policy': 'Foreign Policy',
  reuters: 'Reuters', guardian: 'Guardian', 'ap-news': 'AP News',
};

const SOURCE_COLORS = {
  dawn: '#00B04F', 'bbc-world': '#BB1919', bbc: '#BB1919',
  aljazeera: '#D4A017', 'the-diplomat': '#4A90D9', 'the-news': '#2E7D32',
  'foreign-policy': '#7B1FA2', reuters: '#FF6B00', guardian: '#052962', 'ap-news': '#CC0000',
};

function StrengthBadge({ strength }) {
  const cls = strength === 'high' ? 'strength-high' : strength === 'medium' ? 'strength-medium' : 'strength-low';
  return <span className={`badge ${cls} text-[10px] px-2 py-0.5`}>{strength}</span>;
}

export default function ConnectionsPanel() {
  const { connections, loading, refreshing, refresh } = useConnections();

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-serif">Story Connections</h2>
          <p className="text-sm text-slate-500 mt-0.5">AI-detected links between news stories</p>
        </div>
        <button onClick={refresh} disabled={refreshing} className="btn-ghost">
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Analyzing...' : 'Refresh'}
        </button>
      </div>

      {refreshing && (
        <div className="glass-card p-4 border-purple-500/30 bg-purple-500/5">
          <div className="flex items-center gap-3">
            <Link2 size={16} className="text-purple-400 animate-pulse" />
            <span className="text-sm text-purple-300">AI is finding connections across news sources...</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-5 space-y-3">
              <div className="h-5 bg-white/5 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
            </div>
          ))}
        </div>
      ) : connections.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Link2 size={32} className="text-purple-400 mx-auto mb-3 opacity-50" />
          <p className="text-slate-300 mb-1">No connections found yet</p>
          <p className="text-sm text-slate-500 mb-4">Fetch more news articles to enable connection analysis</p>
          <button onClick={refresh} className="btn-primary mx-auto">
            <Link2 size={14} /> Find Connections
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((conn) => (
            <div key={conn.id} className="glass-card p-5 hover:border-white/20 transition-all">
              {/* Connection Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Link2 size={13} className="text-purple-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{conn.connection_title}</h3>
                </div>
                <StrengthBadge strength={conn.strength} />
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{conn.connection_description}</p>

              {/* Connected Articles */}
              {conn.articles && conn.articles.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-600 font-medium uppercase tracking-wide mb-2">Connected Stories</p>
                  {conn.articles.map(article => (
                    <div key={article.id} className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: SOURCE_COLORS[article.source] || '#64748B' }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold" style={{ color: SOURCE_COLORS[article.source] || '#94A3B8' }}>
                          {SOURCE_NAMES[article.source] || article.source}
                        </span>
                        <p className="text-xs text-slate-300 leading-snug">{article.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
