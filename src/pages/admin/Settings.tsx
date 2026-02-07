import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Save, Search, CheckCircle2, Loader2, Plus, Globe, X, Link as LinkIcon, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { AppDispatch, RootState } from '../../store/store';
import { fetchSeoByUrl, saveSeoMetadata } from '../../store/slice/seoSlice';
import { uploadFileAction } from '../../store/slice/mediaSlice'; // Hàng về đây rồi bro!
import { SeoMetadata } from '../../type/seo';
import { toast } from 'react-toastify';

export default function SEOSettings() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Lấy state từ cả 2 slice
  const { currentSeo, isLoading: isSeoLoading } = useSelector((state: RootState) => state.seo);
  const { isUploading, lastUploadedUrl } = useSelector((state: RootState) => state.media);

  const [tabs, setTabs] = useState([
    { label: 'Home Page', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'Certificates', path: '/certificates' }
  ]);
  const [activeTab, setActiveTab] = useState('/');
  const [isAdding, setIsAdding] = useState(false);
  const [newPath, setNewPath] = useState('');
  const pathInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<SeoMetadata>({
    pageUrl: '/', title: '', description: '', keywords: '', ogImage: '', canonicalUrl: '', h1Override: ''
  });

  useEffect(() => { dispatch(fetchSeoByUrl('/')); }, [dispatch]);

  // Sync dữ liệu SEO từ Store
  useEffect(() => {
    if (currentSeo) {
      setFormData(currentSeo);
    } else {
      setFormData({ pageUrl: activeTab, title: '', description: '', keywords: '', ogImage: '', canonicalUrl: '', h1Override: '' });
    }
  }, [currentSeo, activeTab]);

  // QUAN TRỌNG: Khi upload thành công, cập nhật ogImage vào formData
  useEffect(() => {
    if (lastUploadedUrl) {
      setFormData(prev => ({ ...prev, ogImage: lastUploadedUrl }));
    }
  }, [lastUploadedUrl]);

  // --- LOGIC: THÊM PATH MỚI ---
  const confirmAddPath = () => {
    if (!newPath) { setIsAdding(false); return; }
    let formattedPath = newPath.startsWith('/') ? newPath : `/${newPath}`;
    if (!tabs.find(t => t.path === formattedPath)) {
      setTabs([...tabs, { label: formattedPath, path: formattedPath }]);
    }
    handleTabChange(formattedPath);
    setNewPath('');
    setIsAdding(false);
  };

  const handleTabChange = (path: string) => {
    setActiveTab(path);
    dispatch(fetchSeoByUrl(path));
  };

  // --- LOGIC: UPLOAD ẢNH QUA REDUX ACTION ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Gọi action thần thánh của ông đây
      await dispatch(uploadFileAction({ file, folder: 'seo-previews' })).unwrap();
      toast.success("Cloudinary đã húp được ảnh! Ngon lành.");
    } catch (err) {
      toast.error("Cloudinary từ chối rồi bro: " + err);
    }
  };

  const calculateSEOScore = () => {
    let score = 0;
    if (formData.title.length >= 50 && formData.title.length <= 70) score += 25;
    if (formData.description.length >= 140 && formData.description.length <= 165) score += 25;
    if (formData.keywords && formData.keywords.split(',').length >= 3) score += 20;
    if (formData.ogImage) score += 15;
    if (formData.canonicalUrl.startsWith('http')) score += 15;
    return score;
  };

  const handleDeploy = async () => {
    try {
      await dispatch(saveSeoMetadata(formData)).unwrap();
      toast.success(`🚀 SEO Live for ${activeTab}!`);
    } catch (err) {
      toast.error('Lỗi rồi con vợ ơi: ' + err);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Loading Overlay thông minh hơn */}
      {(isSeoLoading || isUploading) && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[100] flex items-center justify-center transition-all">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col items-center gap-4">
            <div className="relative">
                <Loader2 className="animate-spin text-indigo-600" size={56} />
                <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-200" size={20} />
            </div>
            <p className="font-[1000] text-gray-700 uppercase tracking-widest text-[10px]">
                {isUploading ? "Uploading to Cloudinary..." : "Syncing SEO Data..."}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
            <h1 className="text-5xl font-[1000] text-gray-900 tracking-tighter italic uppercase">SEO<span className="text-indigo-600 not-italic tracking-normal">Hub</span></h1>
            <p className="text-gray-400 font-bold mt-2 flex items-center gap-2 uppercase text-[10px] tracking-[0.3em]">
                <span className="w-8 h-[1.5px] bg-indigo-600"></span> Management Console
            </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6 px-2">
                <label className="text-[11px] font-[900] text-gray-400 uppercase tracking-[0.25em]">Sitemap Targets</label>
                {!isAdding && (
                    <button 
                        onClick={() => { setIsAdding(true); setTimeout(() => pathInputRef.current?.focus(), 100); }}
                        className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                )}
            </div>

            <nav className="space-y-2.5">
              {tabs.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleTabChange(item.path)}
                  className={`w-full group flex items-center justify-between px-5 py-4 rounded-[1.25rem] font-bold transition-all duration-300 ${
                    activeTab === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-x-1' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Search size={18} className={activeTab === item.path ? 'opacity-100' : 'opacity-40'} />
                    <span className="truncate text-sm tracking-tight">{item.label}</span>
                  </div>
                </button>
              ))}

              {isAdding && (
                <div className="relative animate-in slide-in-from-left-2 duration-200">
                    <input 
                        ref={pathInputRef}
                        value={newPath}
                        onChange={(e) => setNewPath(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && confirmAddPath()}
                        onBlur={() => !newPath && setIsAdding(false)}
                        placeholder="/new-page-url..."
                        className="w-full pl-5 pr-12 py-4 bg-indigo-50 border-2 border-indigo-200 rounded-[1.25rem] outline-none text-sm font-bold text-indigo-700 placeholder:text-indigo-300 shadow-inner"
                    />
                    <button onClick={confirmAddPath} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:scale-110 transition-transform"><Save size={14} /></button>
                </div>
              )}
            </nav>

            {/* Score Card */}
            <div className={`mt-10 p-6 rounded-[1.5rem] border transition-all duration-500 ${calculateSEOScore() > 75 ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex justify-between items-end mb-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Health Score</p>
                        <h3 className={`text-3xl font-[1000] ${calculateSEOScore() > 75 ? 'text-green-600' : 'text-orange-500'}`}>{calculateSEOScore()}%</h3>
                    </div>
                    <CheckCircle2 size={32} className={calculateSEOScore() > 75 ? 'text-green-500' : 'text-orange-400'} strokeWidth={2.5} />
                </div>
                <div className="w-full bg-white h-2.5 rounded-full p-0.5 border border-gray-100 overflow-hidden shadow-inner">
                    <div className={`h-full rounded-full transition-all duration-1000 ease-out ${calculateSEOScore() > 75 ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 'bg-orange-500'}`} style={{ width: `${calculateSEOScore()}%` }}></div>
                </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 p-8 md:p-12 relative">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-3 h-12 bg-indigo-600 rounded-full shadow-lg shadow-indigo-100"></div>
                <div>
                    <h2 className="text-3xl font-[1000] text-gray-800 tracking-tighter uppercase">Metadata Control</h2>
                    <p className="text-indigo-600 font-bold text-xs italic tracking-tight flex items-center gap-2 mt-1">
                        <LinkIcon size={14} strokeWidth={3} /> {activeTab}
                    </p>
                </div>
            </div>

            <div className="space-y-10">
              {/* OG Image Upload Section */}
              <div className="group">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Social Preview Image (Cloudinary)</label>
                <div className="flex flex-col xl:flex-row gap-8 items-start">
                    <div className="w-full xl:w-80 aspect-video bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group/img shadow-inner">
                        {formData.ogImage ? (
                            <>
                                <img src={formData.ogImage} alt="SEO Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center">
                                    <button onClick={() => setFormData(prev => ({ ...prev, ogImage: '' }))} className="p-3 bg-red-500 text-white rounded-2xl hover:scale-110 transition-transform shadow-xl">
                                        <X size={20} strokeWidth={3} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-gray-300">
                                <ImageIcon size={48} strokeWidth={1} />
                                <span className="text-[10px] font-black tracking-widest uppercase opacity-60">No Image Found</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                name="ogImage"
                                value={formData.ogImage}
                                onChange={(e) => setFormData(prev => ({ ...prev, ogImage: e.target.value }))}
                                placeholder="https://res.cloudinary.com/..."
                                className="flex-1 px-7 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-sm shadow-sm"
                            />
                            <label className="px-8 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black cursor-pointer hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 shrink-0 group/btn">
                                <UploadCloud size={20} className="group-hover/btn:animate-bounce" />
                                <span className="text-xs tracking-widest">UPLOAD FILE</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </label>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold px-3 italic uppercase tracking-tighter">
                            💡 Tip: Best resolution for social share is 1200 x 630 pixels.
                        </p>
                    </div>
                </div>
              </div>

              {/* Title & Desc Fields */}
              <div className="group">
                <div className="flex justify-between mb-3 px-1">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] group-focus-within:text-indigo-600 transition-colors">Meta Title</label>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${formData.title.length >= 50 && formData.title.length <= 70 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {formData.title.length} / 70
                    </span>
                </div>
                <input name="title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="SEO Title..." className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-gray-800 text-xl shadow-sm"/>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Meta Description</label>
                <textarea name="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={4} placeholder="Meta description..." className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-gray-600 leading-relaxed shadow-sm"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1 text-indigo-400">Keywords</label>
                  <input name="keywords" value={formData.keywords} onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))} className="w-full px-8 py-6 bg-indigo-50/20 border-2 border-transparent rounded-[1.5rem] focus:border-indigo-400 outline-none font-bold text-gray-700 shadow-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">H1 Override</label>
                  <input name="h1Override" value={formData.h1Override} onChange={(e) => setFormData(prev => ({ ...prev, h1Override: e.target.value }))} className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:border-indigo-500 outline-none font-bold text-gray-800 shadow-sm"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Canonical Link</label>
                <input name="canonicalUrl" value={formData.canonicalUrl} onChange={(e) => setFormData(prev => ({ ...prev, canonicalUrl: e.target.value }))} className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:border-indigo-500 outline-none font-medium text-indigo-600 shadow-sm"/>
              </div>

              <div className="flex items-center gap-6 pt-10">
                <button onClick={handleDeploy} disabled={isSeoLoading || isUploading} className="flex-[2] flex items-center justify-center gap-4 px-8 py-7 bg-indigo-600 text-white rounded-[2rem] font-black hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50">
                    <Save size={24} />
                    <span className="uppercase tracking-[0.2em] text-sm">Deploy to Cloud</span>
                </button>
                <button onClick={() => dispatch(fetchSeoByUrl(activeTab))} className="flex-1 px-8 py-7 bg-white border-2 border-gray-100 text-gray-400 rounded-[2rem] font-black hover:border-indigo-600 hover:text-indigo-600 transition-all uppercase text-[10px] tracking-[0.3em]">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}