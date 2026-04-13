import { BarChart2, Globe, Newspaper, Link2, BookOpen, TrendingUp } from 'lucide-react';
import { useStats, useSources } from '../hooks/useNews';

const SOURCE_COLORS = {
  dawn: '#00B04F', 'bbc-world': '#BB1919', bbc: '#BB1919',
  aljazeera: '#D4A017', 'the-diplomat': '#4A90D9', 'the-news': '#2E7D32',
  'foreign-policy': '#7B1FA2', reuters: '#FF6B00', guardian: '#052962', 'ap-news': '#CC0000',
};

function StatCard({ icon: Icon, label, value, color = 'text-blue-400' }) {
  return (
    <div className="glass-card p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className={color} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function InsightsPanel() {
  const stats = useStats();
  const sources = useSources();

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white font-serif">Platform Insights</h2>
        <p className="text-sm text-slate-500 mt-0.5">Overview of your news intelligence dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Newspaper} label="Total Articles" value={stats?.totalArticles} color="text-blue-400" />
        <StatCard icon={TrendingUp} label="Fetched Today" value={stats?.todayArticles} color="text-emerald-400" />
        <StatCard icon={BookOpen} label="Daily Briefs" value={stats?.totalBriefs} color="text-amber-400" />
        <StatCard icon={Link2} label="Connections" value={stats?.totalConnections} color="text-purple-400" />
      </div>

      {/* Sources Status */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={15} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-300">News Sources</span>
          <span className="ml-auto badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {sources.length} Active
          </span>
        </div>
        <div className="space-y-2">
          {sources.map(source => (
            <div key={source.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: SOURCE_COLORS[source.id] || '#64748B' }}
              />
              <span className="text-sm text-slate-300 flex-1">{source.name}</span>
              <span className="text-xs text-slate-600 badge bg-white/5">{source.category}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card p-5 border-blue-500/20 bg-blue-500/5">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={15} className="text-blue-400" />
          <span className="text-sm font-semibold text-blue-300">How This Works</span>
        </div>
        <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
          <div className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
            <p><strong className="text-slate-300">RSS Aggregation:</strong> News is automatically fetched from {sources.length} major sources every 30 minutes.</p>
          </div>
          <div className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
            <p><strong className="text-slate-300">Daily Brief:</strong> Claude AI generates a comprehensive current affairs brief every morning at 7 AM.</p>
          </div>
          <div className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
            <p><strong className="text-slate-300">Connections:</strong> AI identifies how different stories are related across sources twice daily.</p>
          </div>
          <div className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
            <p><strong className="text-slate-300">Article Analysis:</strong> Click "AI Analysis" on any article for exam-focused current affairs insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
