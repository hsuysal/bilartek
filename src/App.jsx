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
  const frameStep = 0.033; // 30 FPS hassasiyeti

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
        <header className="h-14 bg-[#ff4b2b] px-4 flex items-center justify-between shadow-md shrink-0 text-white">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1"><Menu /></button>
            <h1 className="font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] truncate">
              {activeTab === 'home' ? 'Bilimsel Araştırma' : activeTab === 'jump' ? 'Dikey Sıçrama Analizi' : 'Zamanlama Analizi'}
            </h1>
          </div>
          {videoSrc && (
            <button onClick={() => setVideoSrc(null)} className="opacity-80 hover:opacity-100 p-2">
              <RefreshCw size={18}/>
            </button>
          )}
        </header>

        <main className="flex-1 overflow-hidden flex flex-col bg-black">
          {activeTab === 'home' ? (
            <div className="flex-1 bg-white p-4 sm:p-8 overflow-y-auto space-y-8 animate-in fade-in duration-500">
              <div className="bg-gradient-to-br from-[#ff4b2b] to-[#ff416c] p-8 sm:p-12 rounded-[2.5rem] text-white shadow-xl">
                <h2 className="text-2xl sm:text-4xl font-black mb-4 uppercase tracking-tight">BİLARTEK</h2>
                <p className="text-sm sm:text-lg font-medium opacity-90 leading-relaxed">
                  Bu dijital platform, <span className="font-black underline">Bilimsel Araştırma Teknikleri</span> dersi kapsamında spor bilimleri öğrencileri için özel olarak geliştirilmiştir.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center">
                    <Activity className="mr-2 text-[#ff4b2b]" size={20} /> Sıçrama Testleri
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Squat Jump (SJ), Countermovement Jump (CMJ), Drop Jump (DJ) ve Abalakov gibi temel dikey sıçrama modellerini milisaniye hassasiyetinde analiz eder.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center">
                    <Zap className="mr-2 text-[#ff4b2b]" size={20} /> Hız ve Çeviklik
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Hıza dayalı sürat testleri, yön değiştirme (COD) hızı ve reaktif çeviklik analizleri için video tabanlı zamanlama sağlar.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 p-6 sm:p-10 rounded-[2.5rem] text-gray-300">
                <h3 className="text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-6 flex items-center">
                  <Info className="mr-2 text-[#ff4b2b]" size={18} /> Akademik Temeller
                </h3>
                <div className="space-y-4 text-[10px] sm:text-[11px] italic leading-loose opacity-80">
                  <p>"Manual frame-by-frame analysis is a valid and reliable alternative to force plates." (Glatthorn et al., 2011).</p>
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
                  <label className="bg-[#ff4b2b] text-white px-10 py-3 sm:px-12 sm:py-4 rounded-full font-black shadow-xl cursor-pointer active:scale-95 transition-transform text-sm sm:text-base">
                    YÜKLE
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                  </label>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full relative">
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
                    />
                    
                    {/* Şeffaf İleri/Geri Okları */}
                    <button 
                      onClick={() => stepFrame(-1)}
                      className="absolute left-4 sm:left-8 top-[65%] -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 bg-black/10 backdrop-blur-[2px] text-white/50 rounded-full flex items-center justify-center border border-white/10 active:bg-[#ff4b2b]/40"
                    >
                      <ChevronLeft size={32} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => stepFrame(1)}
                      className="absolute right-4 sm:right-8 top-[65%] -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 bg-black/10 backdrop-blur-[2px] text-white/50 rounded-full flex items-center justify-center border border-white/10 active:bg-[#ff4b2b]/40"
                    >
                      <ChevronRight size={32} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Kontrol Paneli */}
                  <div className="bg-[#ff4b2b] shrink-0 border-t border-white/20 text-white">
                    <div className="px-4 py-3 bg-black/10">
                      <div className="flex justify-between text-[10px] font-black mb-1 font-mono">
                        <span>{currentTime.toFixed(3)}s</span>
                        <span>{duration.toFixed(3)}s</span>
                      </div>
                      <input 
                        type="range" min="0" max={duration > 0 ? duration : 1} step="0.001" value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/20 rounded-full appearance-none accent-white cursor-pointer"
                      />
                    </div>

                    <div className="flex h-16 sm:h-24 bg-white text-gray-900">
                      <button onClick={() => setStartMarker(currentTime)} className="flex-1 flex flex-col items-center justify-center border-r border-gray-100 active:bg-gray-50">
                        <span className="text-[8px] font-black text-gray-400">START</span>
                        <span className={`text-lg sm:text-3xl font-black ${startMarker !== null ? 'text-[#ff4b2b]' : 'text-gray-200'}`}>
                          {startMarker !== null ? `${startMarker.toFixed(3)}s` : '0.000s'}
                        </span>
                      </button>
                      <button onClick={() => setEndMarker(currentTime)} className="flex-1 flex flex-col items-center justify-center active:bg-gray-50">
                        <span className="text-[8px] font-black text-gray-400">END</span>
                        <span className={`text-lg sm:text-3xl font-black ${endMarker !== null ? 'text-[#ff4b2b]' : 'text-gray-200'}`}>
                          {endMarker !== null ? `${endMarker.toFixed(3)}s` : '0.000s'}
                        </span>
                      </button>
                    </div>

                    <div className="flex h-12 sm:h-16 border-t border-white/10">
                       <button disabled={startMarker === null || endMarker === null} onClick={calculateResult} className="flex-1 flex items-center justify-center font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] active:bg-black/20 disabled:opacity-30">
                         SONUCU GÖR <ChevronRight size={18} className="ml-2"/>
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
                 <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[#ff4b2b] mx-auto shadow-sm"><Calculator size={28}/></div>
                 <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase">BMI Analizi</h2>
                 <div className="space-y-4">
                    <input id="h" type="number" placeholder="BOY (CM)" className="w-full p-4 bg-gray-50 border-none rounded-xl font-black focus:ring-2 focus:ring-[#ff4b2b] outline-none" />
                    <input id="w" type="number" placeholder="KİLO (KG)" className="w-full p-4 bg-gray-50 border-none rounded-xl font-black focus:ring-2 focus:ring-[#ff4b2b] outline-none" />
                    <button onClick={() => {
                        const h = parseFloat(document.getElementById('h').value)/100;
                        const w = parseFloat(document.getElementById('w').value);
                        if(h > 0 && w > 0) {
                          const bmi = (w/(h*h)).toFixed(1);
                          setModalData({ title: "BMI ANALİZİ", value: bmi, unit: "kg/m²", detail: "ANTROPOMETRİK VERİ", formula: "Kilo / Boy²" });
                          setShowModal(true);
                        }
                    }} className="w-full py-4 bg-[#ff4b2b] text-white rounded-full font-black shadow-xl">HESAPLA</button>
                 </div>
               </div>
            </div>
          )}
        </main>
      </div>

      {/* Result Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative z-10 text-center text-gray-900">
            <p className="text-[9px] font-black text-gray-300 uppercase mb-2">{modalData.title}</p>
            <div className="flex items-baseline justify-center space-x-1 mb-4">
              <span className="text-6xl sm:text-8xl font-black tracking-tighter">{modalData.value}</span>
              <span className="text-lg sm:text-xl font-bold text-[#ff4b2b]">{modalData.unit}</span>
            </div>
            <button onClick={() => setShowModal(false)} className="w-full py-4 bg-[#ff4b2b] text-white rounded-full font-black">YENİ ANALİZ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;