import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, Activity, Zap, Calculator, Menu, X, Upload, 
  ChevronLeft, ChevronRight, 
  Info, CheckCircle2, TrendingUp,
  RefreshCw, Trash2
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const videoRef = useRef(null);
  // Kare hızı hassasiyeti (30 FPS bazlı: 1/30 ≈ 0.033)
  const frameStep = 0.033; 

  // iPhone yerleşik oynatıcısını engellemek ve manuel kontrolü zorlamak için konfigürasyon
  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.load();
      videoRef.current.pause();
    }
  }, [videoSrc]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // İlk karenin yüklenmesi için ufak bir tetikleme
      videoRef.current.currentTime = 0.001; 
      setCurrentTime(0);
    }
  };

  const stepFrame = (direction) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(videoRef.current.currentTime + (direction * frameStep), duration));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (videoSrc) URL.revokeObjectURL(videoSrc);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setStartMarker(null);
      setEndMarker(null);
      setCurrentTime(0);
    }
  };

  const calculateResult = () => {
    if (startMarker !== null && endMarker !== null) {
      const timeDiff = Math.abs(endMarker - startMarker);
      if (activeTab === 'jump') {
        const g = 9.81;
        const height = (g * Math.pow(timeDiff, 2)) / 8;
        setModalData({
          title: "Sıçrama Sonucu",
          value: (height * 100).toFixed(2),
          unit: "cm",
          detail: `Uçuş Süresi: ${timeDiff.toFixed(3)} sn`,
          formula: "h = (g * t²) / 8"
        });
      } else {
        setModalData({
          title: "Zamanlama Sonucu",
          value: timeDiff.toFixed(3),
          unit: "sn",
          detail: "İşaretlenen kareler arası net fark.",
          formula: "Δt = t₂ - t₁"
        });
      }
      setShowModal(true);
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => { setActiveTab(id); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
      className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all ${
        activeTab === id ? 'bg-[#ff4b2b] text-white shadow-lg' : 'hover:bg-gray-100 text-gray-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans select-none">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-64 bg-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-[#ff4b2b] p-2 rounded-lg text-white"><TrendingUp size={20}/></div>
            <span className="text-xl font-black text-gray-900 tracking-tight">BİLARTEK</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400"><X /></button>
        </div>
        <nav className="p-4 space-y-2">
          <SidebarItem id="home" icon={Home} label="Ana Sayfa" />
          <SidebarItem id="jump" icon={Activity} label="Dikey Sıçrama" />
          <SidebarItem id="velocity" icon={Zap} label="Hıza Dayalı Testler" />
          <SidebarItem id="bmi" icon={Calculator} label="BMI Hesaplama" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-14 bg-[#ff4b2b] px-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-white p-1"><Menu /></button>
            <h1 className="font-bold text-white text-[10px] sm:text-xs uppercase tracking-[0.2em] truncate">
              {activeTab === 'home' ? 'Bilimsel Araştırma' : activeTab === 'jump' ? 'Dikey Sıçrama Analizi' : 'Zamanlama Analizi'}
            </h1>
          </div>
          {videoSrc && (
            <button onClick={() => setVideoSrc(null)} className="text-white opacity-80 hover:opacity-100 transition-opacity p-2">
              <RefreshCw size={18}/>
            </button>
          )}
        </header>

        <main className="flex-1 overflow-hidden flex flex-col bg-black">
          {activeTab === 'home' ? (
            <div className="flex-1 bg-white p-4 sm:p-8 overflow-y-auto space-y-6">
              <div className="bg-gray-50 p-6 sm:p-10 rounded-[2rem] border border-gray-100">
                <h2 className="text-xl sm:text-3xl font-black text-gray-900 mb-3 text-center sm:text-left">Biyomekanik Analiz Modülü</h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 text-center sm:text-left">
                  Akademik çalışmalarda kullanılmak üzere tasarlanmış, video tabanlı manuel veri toplama sistemi. Saha şartlarında yüksek hassasiyet sunar.
                </p>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm italic text-[10px] sm:text-xs text-gray-500">
                  "Mobile video analysis of vertical jumps offers a valid and reliable practical tool for practitioners in the field."
                  <p className="mt-2 font-bold">— Balsalobre-Fernández et al. (2015), Journal of Sports Sciences.</p>
                </div>
              </div>
            </div>
          ) : (activeTab === 'jump' || activeTab === 'velocity') && (
            <div className="flex-1 flex flex-col relative h-full">
              {!videoSrc ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-50 rounded-full flex items-center justify-center text-[#ff4b2b] mb-6 animate-pulse">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2 uppercase">Video Yükle</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-8 max-w-[250px]">Analiz için bir video dosyası seçin ve hareketi dondurarak işaretleyin.</p>
                  <label className="bg-[#ff4b2b] text-white px-10 py-3 sm:px-12 sm:py-4 rounded-full font-black shadow-xl cursor-pointer active:scale-95 transition-transform text-sm sm:text-base">
                    DOSYA SEÇ
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                  </label>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full relative">
                  
                  {/* Video Area - Saf Analiz Ekranı */}
                  <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[200px]">
                    <video 
                      key={videoSrc}
                      ref={videoRef}
                      src={videoSrc}
                      className="max-h-full w-full object-contain pointer-events-none"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      playsInline
                      muted
                      preload="auto"
                    />
                    
                    {/* İleri/Geri Okları - Aşağı çekildi (top-[65%]) ve Şeffaflaştırıldı */}
                    <button 
                      onClick={() => stepFrame(-1)}
                      className="absolute left-4 sm:left-8 top-[65%] -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 bg-black/10 backdrop-blur-[2px] text-white/50 rounded-full flex items-center justify-center border border-white/10 active:bg-[#ff4b2b]/40 active:text-white hover:text-white transition-all"
                    >
                      <ChevronLeft size={32} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => stepFrame(1)}
                      className="absolute right-4 sm:right-8 top-[65%] -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 bg-black/10 backdrop-blur-[2px] text-white/50 rounded-full flex items-center justify-center border border-white/10 active:bg-[#ff4b2b]/40 active:text-white hover:text-white transition-all"
                    >
                      <ChevronRight size={32} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Alt Kontrol Paneli - Responsive Yükseklik */}
                  <div className="bg-[#ff4b2b] shrink-0 border-t border-white/20">
                    
                    {/* Scrubber Area */}
                    <div className="px-4 sm:px-8 py-3 sm:py-4 bg-black/10">
                      <div className="flex justify-between text-[9px] sm:text-[10px] text-white/90 font-black mb-1.5 font-mono">
                        <span className="bg-black/20 px-2 py-0.5 rounded">{currentTime.toFixed(3)}s</span>
                        <span className="bg-black/20 px-2 py-0.5 rounded">{duration.toFixed(3)}s</span>
                      </div>
                      <input 
                        type="range" min="0" max={duration > 0 ? duration : 1} step="0.001" value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 sm:h-2 bg-white/20 rounded-full appearance-none accent-white cursor-pointer"
                      />
                    </div>

                    {/* Veri Ekranı - Responsive Yazı Boyutları */}
                    <div className="flex h-16 sm:h-24 bg-white shadow-inner">
                      <button 
                        onClick={() => setStartMarker(currentTime)}
                        className="flex-1 flex flex-col items-center justify-center border-r border-gray-100 active:bg-gray-50 transition-colors"
                      >
                        <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">START</span>
                        <span className={`text-lg sm:text-3xl font-black ${startMarker !== null ? 'text-[#ff4b2b]' : 'text-gray-200'}`}>
                          {startMarker !== null ? `${startMarker.toFixed(3)}s` : '0.000s'}
                        </span>
                      </button>
                      <button 
                        onClick={() => setEndMarker(currentTime)}
                        className="flex-1 flex flex-col items-center justify-center active:bg-gray-50 transition-colors"
                      >
                        <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">END</span>
                        <span className={`text-lg sm:text-3xl font-black ${endMarker !== null ? 'text-[#ff4b2b]' : 'text-gray-200'}`}>
                          {endMarker !== null ? `${endMarker.toFixed(3)}s` : '0.000s'}
                        </span>
                      </button>
                    </div>

                    {/* Sonuç Butonu */}
                    <div className="flex h-12 sm:h-16 border-t border-white/10">
                       <button 
                         disabled={startMarker === null || endMarker === null}
                         onClick={calculateResult}
                         className="flex-1 flex items-center justify-center text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] active:bg-black/20 disabled:opacity-30 transition-all px-4"
                       >
                         SONUCU GÖR <ChevronRight size={18} className="ml-2 hidden sm:block"/>
                       </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bmi' && (
            <div className="flex-1 bg-white p-6 sm:p-12 overflow-y-auto">
               <div className="max-w-md mx-auto text-center space-y-6 pt-6 sm:pt-12">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-[#ff4b2b] mx-auto shadow-sm">
                    <Calculator size={28}/>
                 </div>
                 <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase">BMI Analizi</h2>
                 <div className="space-y-4">
                    <input id="h" type="number" placeholder="BOY (CM)" className="w-full p-4 sm:p-5 bg-gray-50 border-none rounded-xl sm:rounded-2xl font-black focus:ring-2 focus:ring-[#ff4b2b] outline-none text-sm sm:text-base" />
                    <input id="w" type="number" placeholder="KİLO (KG)" className="w-full p-4 sm:p-5 bg-gray-50 border-none rounded-xl sm:rounded-2xl font-black focus:ring-2 focus:ring-[#ff4b2b] outline-none text-sm sm:text-base" />
                    <button onClick={() => {
                        const h = parseFloat(document.getElementById('h').value)/100;
                        const w = parseFloat(document.getElementById('w').value);
                        if(h > 0 && w > 0) {
                          const bmi = (w/(h*h)).toFixed(1);
                          setModalData({ title: "BMI ANALİZİ", value: bmi, unit: "kg/m²", detail: "ANTROPOMETRİK VERİ", formula: "Kilo / Boy²" });
                          setShowModal(true);
                        }
                    }} className="w-full py-4 sm:py-5 bg-[#ff4b2b] text-white rounded-full font-black shadow-xl tracking-widest text-sm sm:text-base">HESAPLA</button>
                 </div>
               </div>
            </div>
          )}
        </main>
      </div>

      {/* Result Modal - Responsive Boyutlandırma */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] w-full max-w-sm p-8 sm:p-12 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 text-center text-gray-900">
            <p className="text-[9px] sm:text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2 sm:mb-4">{modalData.title}</p>
            <div className="flex items-baseline justify-center space-x-1 sm:space-x-2 mb-4 sm:mb-6">
              <span className="text-6xl sm:text-8xl font-black tracking-tighter">{modalData.value}</span>
              <span className="text-lg sm:text-xl font-bold text-[#ff4b2b] uppercase">{modalData.unit}</span>
            </div>
            <p className="font-black text-xs sm:text-sm uppercase tracking-widest mb-8 sm:mb-10 leading-tight">{modalData.detail}</p>
            <button onClick={() => setShowModal(false)} className="w-full py-4 sm:py-5 bg-[#ff4b2b] text-white rounded-full font-black shadow-2xl active:scale-95 transition-all text-sm sm:text-base">YENİ ANALİZ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;