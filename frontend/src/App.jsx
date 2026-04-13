import { useState } from 'react';
import Sidebar from './components/Sidebar';
import NewsFeed from './components/NewsFeed';
import DailyBrief from './components/DailyBrief';
import ConnectionsPanel from './components/ConnectionsPanel';
import InsightsPanel from './components/InsightsPanel';
import { useSources, useStats, triggerRefresh } from './hooks/useNews';

export default function App() {
  const [activeView, setActiveView] = useState('brief');
  const [activeSource, setActiveSource] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const sources = useSources();
  const stats = useStats();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await triggerRefresh();
      // Give backend a moment then refresh page data
      setTimeout(() => window.location.reload(), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setRefreshing(false), 3000);
    }
  };

  const renderContent = () => {
    if (activeView === 'brief') return <DailyBrief />;
    if (activeView === 'connections') return <ConnectionsPanel />;
    if (activeView === 'stats') return <InsightsPanel />;
    // feed
    return <NewsFeed source={activeSource} category={activeCategory} />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0f1e]">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        activeSource={activeSource}
        setActiveSource={setActiveSource}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        sources={sources}
        stats={stats}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 px-8 py-3 border-b border-white/8 bg-[#0a0f1e]/90 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span className="text-xs text-slate-500">Live • Updates every 30 min</span>
          </div>
          <div className="text-xs text-slate-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-w-3xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
