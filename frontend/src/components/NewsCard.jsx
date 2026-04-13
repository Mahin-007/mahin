import { useState } from 'react';
import { ExternalLink, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { analyzeArticle } from '../hooks/useNews';

const SOURCE_COLORS = {
  dawn: '#00B04F', 'bbc-world': '#BB1919', bbc: '#BB1919',
  aljazeera: '#D4A017', 'the-diplomat': '#4A90D9', 'the-news': '#2E7D32',
  'foreign-policy': '#7B1FA2', reuters: '#FF6B00', guardian: '#052962', 'ap-news': '#CC0000',
};

const SOURCE_NAMES = {
  dawn: 'Dawn', 'bbc-world': 'BBC World', bbc: 'BBC', aljazeera: 'Al Jazeera',
  'the-diplomat': 'The Diplomat', 'the-news': 'The News', 'foreign-policy': 'Foreign Policy',
  reuters: 'Reuters', guardian: 'Guardian', 'ap-news': 'AP News',
};

function timeAgo(dateStr) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return 'recently';
  }
}

export default function NewsCard({ article, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const color = SOURCE_COLORS[article.source] || '#64748B';
  const sourceName = SOURCE_NAMES[article.source] || article.source;

  const handleAnalyze = async (e) => {
    e.stopPropagation();
    if (analysis) { setShowAnalysis(!showAnalysis); return; }
    setAnalyzing(true);
    try {
      const result = await analyzeArticle(article.id);
      setAnalysis(result.analysis);
      setShowAnalysis(true);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="news-card animate-fadeIn group">
      <div className="flex gap-3">
        {/* Source indicator */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
          <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Source + time */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-semibold" style={{ color }}>
              {sourceName}
            </span>
            {article.category && (
              <span className="badge bg-white/8 text-slate-400 text-[10px]">{article.category}</span>
            )}
            <span className="text-slate-600 text-xs ml-auto">{timeAgo(article.published_at)}</span>
          </div>

          {/* Title */}
          <h3 className={`font-medium text-slate-100 leading-snug mb-2 ${compact ? 'text-sm' : 'text-[15px]'}`}>
            {article.title}
          </h3>

          {/* Summary */}
          {!compact && article.summary && (
            <div>
              <p className={`text-sm text-slate-400 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                {article.summary}
              </p>
              {article.summary.length > 150 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-blue-400 hover:text-blue-300 mt-1 flex items-center gap-0.5"
                >
                  {expanded ? <><ChevronUp size={12} /> Less</> : <><ChevronDown size={12} /> More</>}
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="btn-ghost text-xs py-1 px-2"
            >
              <ExternalLink size={12} />
              Read full
            </a>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="btn-ghost text-xs py-1 px-2"
            >
              <Sparkles size={12} className={analyzing ? 'animate-spin text-blue-400' : 'text-blue-400'} />
              {analyzing ? 'Analyzing...' : analysis ? (showAnalysis ? 'Hide analysis' : 'Show analysis') : 'AI Analysis'}
            </button>
          </div>

          {/* AI Analysis Panel */}
          {showAnalysis && analysis && (
            <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 relative animate-fadeIn">
              <button
                onClick={() => setShowAnalysis(false)}
                className="absolute top-2 right-2 text-slate-500 hover:text-slate-300"
              >
                <X size={14} />
              </button>
              <p className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-1">
                <Sparkles size={11} /> AI Analysis
              </p>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{analysis}</p>
            </div>
          )}
        </div>

        {/* Image */}
        {!compact && article.image_url && (
          <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-white/5">
            <img
              src={article.image_url}
              alt=""
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
