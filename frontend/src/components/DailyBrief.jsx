import { RefreshCw, Sparkles, Calendar, Tag, TrendingUp } from 'lucide-react';
import { useBrief } from '../hooks/useNews';
import { format } from 'date-fns';

export default function DailyBrief() {
  const { brief, loading, error, regenerate, regenerating } = useBrief();

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-white/5 rounded-lg w-48 animate-pulse" />
        <div className="glass-card p-6 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-4 bg-white/5 rounded animate-pulse ${i === 3 ? 'w-3/4' : 'w-full'}`} />
          ))}
        </div>
      </div>
    );
  }

  if (error && !brief) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-slate-400 mb-3">Failed to load daily brief</p>
        <button onClick={regenerate} className="btn-primary mx-auto">
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-serif">Daily Brief</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Calendar size={13} className="text-slate-500" />
            <span className="text-sm text-slate-500">{today}</span>
          </div>
        </div>
        <button
          onClick={regenerate}
          disabled={regenerating}
          className="btn-ghost"
        >
          <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
          {regenerating ? 'Generating...' : 'Regenerate'}
        </button>
      </div>

      {regenerating && (
        <div className="glass-card p-4 border-blue-500/30 bg-blue-500/5">
          <div className="flex items-center gap-3">
            <Sparkles size={16} className="text-blue-400 animate-pulse" />
            <span className="text-sm text-blue-300">AI is analyzing today's news and generating your brief...</span>
          </div>
        </div>
      )}

      {brief ? (
        <>
          {/* Main Brief */}
          <div className="glass-card p-6 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-6 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Intelligence Summary</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[15px] whitespace-pre-wrap">{brief.brief}</p>
            {brief.generated_at && (
              <p className="text-xs text-slate-600 mt-4">
                Generated at {format(new Date(brief.generated_at), 'HH:mm')}
              </p>
            )}
          </div>

          {/* Key Themes */}
          {brief.key_themes && Array.isArray(brief.key_themes) && brief.key_themes.length > 0 && (
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-300">Key Themes Today</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {brief.key_themes.map((theme, i) => (
                  <span key={i} className="badge bg-white/8 text-slate-300 border border-white/10 py-1 px-3 text-xs">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Critical Stories */}
          {brief.critical_stories && brief.critical_stories.length > 0 && (
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-amber-400" />
                <span className="text-sm font-semibold text-slate-300">Critical Stories</span>
              </div>
              <div className="space-y-3">
                {brief.critical_stories.map((story, i) => (
                  <div key={i} className="flex gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{story.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{story.analysis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="glass-card p-8 text-center">
          <Sparkles size={32} className="text-blue-400 mx-auto mb-3 opacity-50" />
          <p className="text-slate-300 mb-1">No brief available yet</p>
          <p className="text-sm text-slate-500 mb-4">Fetch news first, then generate your daily brief</p>
          <button onClick={regenerate} className="btn-primary mx-auto">
            <Sparkles size={14} /> Generate Brief
          </button>
        </div>
      )}
    </div>
  );
}
