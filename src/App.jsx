import React, { useState, useEffect } from 'react';
import { 
  Home, Plus, Refrigerator, Settings, Moon, Sun, 
  Search, Utensils, Clock, Flame, ChevronLeft, 
  Minus, Plus as PlusIcon, Check, Leaf,
  Link2, Filter, AlertCircle, X, Trash2
} from 'lucide-react';

const initialRecipes = [
  {
    id: '1',
    title: '西京燒烤鱈魚排',
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=1000&auto=format&fit=crop',
    prepTime: '15m',
    cookTime: '20m',
    baseServings: 2,
    tags: ['Japanese', 'Seafood', 'Healthy', 'Premium'],
    ingredients: [
      { key: '鱈魚排', baseAmount: 300, unit: 'g' },
      { key: '白味噌', baseAmount: 60, unit: 'g' },
      { key: '味醂', baseAmount: 45, unit: 'ml' }
    ],
    instructions: [
      '調配醬汁：將白味噌、味醂、清酒與白糖攪拌至完全滑順。',
      '醃製魚肉：將鱈魚排擦乾，均勻塗抹上西京燒味噌醬。放入冰箱醃製至少2小時。',
      '烤箱預熱：烤箱預熱至 200°C (400°F)。',
      '完美烘烤：烘烤 15-20 分鐘直至魚肉可用叉子輕易撥開。'
    ],
    nutrition: { calories: 340, protein: 28, carbs: 12, fat: 15 }
  },
  {
    id: '2',
    title: '奢華松露野菇燉飯',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1000&auto=format&fit=crop',
    prepTime: '10m',
    cookTime: '30m',
    baseServings: 4,
    tags: ['Italian', 'Vegetarian', 'Dinner', 'Truffle'],
    ingredients: [
      { key: '義大利米', baseAmount: 250, unit: 'g' },
      { key: '綜合野菇', baseAmount: 300, unit: 'g' },
      { key: '松露油', baseAmount: 15, unit: 'ml' }
    ],
    instructions: [
      '溫熱高湯：在湯鍋中將蔬菜高湯加熱，保持微溫。',
      '煸炒香氣：加入洋蔥丁炒至半透明，隨後加入切片野菇，炒至金黃香脆。',
      '燉煮稻米：加入 Arborio 義大利米翻炒。',
      '慢燉入味：一次加入一勺溫熱高湯，不斷攪拌直至高湯被吸收，重複約20分鐘。'
    ],
    nutrition: { calories: 420, protein: 12, carbs: 55, fat: 16 }
  }
];

export default function App() {
  const [theme, setTheme] = useState('system'); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [quickImportUrl, setQuickImportUrl] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = () => {
      if (theme === 'dark' || (theme === 'system' && mediaQuery.matches)) {
        root.classList.add('dark');
        setIsDarkMode(true);
      } else {
        root.classList.remove('dark');
        setIsDarkMode(false);
      }
    };

    handleThemeChange();
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleQuickImport = (e) => {
    e.preventDefault();
    if (!quickImportUrl) return;
    showToast("智能導入功能暫時停用，僅供靜態展示。");
    setQuickImportUrl('');
  };

  const filteredRecipes = initialRecipes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans antialiased text-zinc-900 dark:text-zinc-100 transition-colors duration-500 bg-stone-100/50 dark:bg-zinc-950/80 selection:bg-zinc-900/10 selection:dark:bg-white/10 relative overflow-x-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-amber-200/20 to-rose-200/20 dark:from-amber-900/10 dark:to-rose-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-emerald-200/20 to-sky-200/20 dark:from-emerald-950/10 dark:to-sky-950/10 blur-[130px]" />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 max-w-md bg-white/70 dark:bg-zinc-900/85 backdrop-blur-2xl px-6 py-4 rounded-[22px] shadow-2xl flex items-center gap-3 border border-white/40 animate-slide-up">
          <p className="text-xs font-semibold">{toast}</p>
          <button onClick={() => setToast(null)} className="p-1"><X size={15} /></button>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-[260px] shrink-0 border-r border-white/30 dark:border-zinc-900/40 bg-white/40 dark:bg-zinc-950/45 backdrop-blur-2xl p-7 justify-between sticky top-0 h-screen z-30">
          <div className="space-y-9">
            <div className="flex items-center gap-3 py-1">
              <div className="w-10 h-10 bg-gradient-to-tr from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 rounded-2xl flex items-center justify-center text-white dark:text-zinc-950 shadow-lg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
              </div>
              <div>
                <h1 className="text-base font-black tracking-widest leading-tight uppercase truncate">Gourmet Vault</h1>
                <p className="text-[9px] tracking-widest uppercase text-zinc-400 font-bold mt-0.5 truncate">Lite Version</p>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'home', icon: Home, label: '首頁探索' },
                { id: 'pantry', icon: Refrigerator, label: '食材冰箱' },
                { id: 'add', icon: Plus, label: '新增食譜' },
                { id: 'settings', icon: Settings, label: '偏好設定' },
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSelectedRecipe(null); }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md scale-[1.02]' : 'text-zinc-400 hover:bg-zinc-950/5'
                    }`}
                  >
                    <Icon size={16} strokeWidth={2.5} /><span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 pb-32 md:pb-8 max-w-6xl mx-auto w-full z-10">
          <header className="flex items-center justify-between mb-9">
            <div>
              <p className="text-[9px] font-black tracking-widest text-zinc-400 uppercase">您的私廚智能食譜庫</p>
              <h1 className="text-2xl font-black mt-1 capitalize">{activeTab}</h1>
            </div>
            <button onClick={toggleTheme} className="md:hidden p-3 rounded-2xl bg-white/40 border border-white/30 backdrop-blur-md shadow-sm">
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </header>

          {activeTab === 'home' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white/40 dark:bg-zinc-900/40 border border-white/50 rounded-[28px] p-6 shadow-xl backdrop-blur-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-zinc-950/5 shrink-0"><Link2 size={18} /></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black">AI 智能連結解析</h3>
                    <p className="text-xs text-zinc-400">貼上網頁連結...</p>
                  </div>
                </div>
                <form onSubmit={handleQuickImport} className="mt-4 flex gap-3">
                  <input 
                    type="url" placeholder="https://..." value={quickImportUrl} onChange={(e) => setQuickImportUrl(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl bg-white/50 border border-white/20 outline-none text-xs shadow-inner"
                  />
                  <button type="submit" className="px-6 py-3.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black text-xs uppercase shadow-md">
                    導入
                  </button>
                </form>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400"><Filter size={12} /><span className="text-[9px] font-black uppercase">全部料理</span></div>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={12} />
                  <input 
                    type="text" placeholder="搜尋食譜..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white/40 border border-white/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRecipes.map(recipe => (
                  <div 
                    key={recipe.id} onClick={() => setSelectedRecipe(recipe)}
                    className="cursor-pointer bg-white/40 dark:bg-zinc-900/45 rounded-[28px] overflow-hidden border border-white/30 hover:scale-[1.01] backdrop-blur-md flex flex-col transition-transform"
                  >
                    <div className="relative h-44 overflow-hidden shrink-0">
                      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-2xl text-[10px] font-bold text-zinc-800 shadow-sm flex items-center gap-1">
                        <Flame size={12} className="text-orange-500" /> {recipe.nutrition.calories} kcal
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-base font-bold mb-1.5">{recipe.title}</h3>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-400 mb-4">
                          <span className="flex items-center gap-1"><Clock size={12} /> {recipe.cookTime}</span>
                          <span className="flex items-center gap-1"><Utensils size={12} /> {recipe.baseServings} 人份</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap pt-4 border-t border-zinc-200/30">
                        {recipe.tags.slice(0,2).map(t => <span key={t} className="text-[9px] font-bold uppercase px-2.5 py-1 bg-zinc-950/5 rounded-full">{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pantry' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-center py-20">
               <Refrigerator size={48} className="mx-auto text-zinc-300 mb-4" />
               <h2 className="text-xl font-bold">食材冰箱功能建置中...</h2>
               <p className="text-xs text-zinc-400">目前為 Lite 版本，未來將重新引入實時同步功能。</p>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="max-w-md mx-auto animate-fade-in text-center py-20">
               <PlusIcon size={48} className="mx-auto text-zinc-300 mb-4" />
               <h2 className="text-xl font-bold">新增食譜功能建置中...</h2>
               <p className="text-xs text-zinc-400">請期待後續更新。</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-md mx-auto animate-fade-in">
              <div className="bg-white/40 border border-white/50 rounded-[28px] p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-950/5 rounded-xl"><Layers size={15} /></div>
                    <div><h4 className="font-bold text-xs">外觀主題</h4></div>
                  </div>
                  <select value={theme} onChange={(e) => setTheme(e.target.value)} className="bg-white/80 text-xs font-bold px-3 py-2 rounded-xl outline-none cursor-pointer">
                    <option value="system">系統預設</option>
                    <option value="light">淺色模式</option>
                    <option value="dark">深色模式</option>
                  </select>
                </div>
                <div className="bg-white/20 p-4 rounded-2xl flex items-start gap-3 border border-white/20">
                  <AlertCircle className="text-zinc-400 shrink-0 mt-0.5" size={14} />
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold">目前為安全精簡模式</p>
                    <p className="text-[10px] text-zinc-400">確保能順利部署至 Vercel。</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-stone-100/80 dark:bg-zinc-950/90 backdrop-blur-3xl overflow-y-auto animate-fade-in">
          <div className="max-w-3xl mx-auto min-h-screen flex flex-col bg-white/50 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl border-x border-white/20 pb-24">
            <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
              <img src={selectedRecipe.image} alt="Recipe" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/10"></div>
              <div className="absolute top-6 left-6 flex justify-between w-full pr-12 z-10">
                <button onClick={() => setSelectedRecipe(null)} className="p-3.5 rounded-2xl bg-black/30 text-white backdrop-blur-md"><ChevronLeft size={18} /></button>
                <button className="p-3.5 rounded-2xl bg-black/30 text-white backdrop-blur-md"><Share2 size={16} /></button>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-3xl font-black tracking-tight">{selectedRecipe.title}</h2>
              </div>
            </div>
            
            <div className="p-6 md:p-10 space-y-8">
              <div className="flex items-center justify-between p-5 bg-white/30 rounded-[24px] border border-white/20">
                <div><span className="text-[9px] font-black text-zinc-400 uppercase">人份</span><p className="text-xs font-black">{selectedRecipe.baseServings} 人份</p></div>
              </div>

              <div className="bg-white/30 rounded-[24px] p-5 space-y-4 border border-white/20">
                <div className="flex items-center gap-1.5 text-zinc-400"><Leaf size={14} /><span className="text-[9px] font-black uppercase">每份營養</span></div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { l: '卡路里', v: selectedRecipe.nutrition.calories, u: 'kcal' },
                    { l: '蛋白質', v: selectedRecipe.nutrition.protein, u: 'g' },
                    { l: '碳水', v: selectedRecipe.nutrition.carbs, u: 'g' },
                    { l: '脂肪', v: selectedRecipe.nutrition.fat, u: 'g' }
                  ].map((n, i) => (
                    <div key={i} className="text-center bg-white/50 py-3 rounded-2xl border border-white/20">
                      <span className="text-[9px] text-zinc-400 block">{n.l}</span><span className="text-sm font-black">{n.v}</span><span className="text-[8px] text-zinc-400 block">{n.u}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase">配料</h3>
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 px-4 rounded-2xl text-xs border bg-white/40 border-white/35 shadow-sm">
                      <span className="font-bold">{ing.key}</span>
                      <span className="font-black">{ing.baseAmount} {ing.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase">步驟</h3>
                <div className="space-y-4">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/40 border border-white/40">
                      <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] border border-zinc-300 text-zinc-400">{idx + 1}</div>
                      <p className="text-xs leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-6 pb-6 pt-2 bg-gradient-to-t from-stone-100/90 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto bg-white/70 backdrop-blur-2xl rounded-full px-6 py-3.5 flex justify-between shadow-2xl pointer-events-auto border border-white/40">
          {[
            { id: 'home', icon: Home }, { id: 'pantry', icon: Refrigerator }, { id: 'add', icon: Plus }, { id: 'settings', icon: Settings }
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedRecipe(null); }} className={`p-2 transition-transform ${activeTab === item.id ? 'text-zinc-950 scale-110' : 'text-zinc-400'}`}>
              <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            </button>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px) translateX(-50%); opacity: 0; } to { transform: translateY(0) translateX(-50%); opacity: 1; } }
      `}} />
    </div>
  );
}