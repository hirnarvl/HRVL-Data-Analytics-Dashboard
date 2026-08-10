import React, { useState } from 'react';
import { 
  Activity, 
  PlusCircle, 
  FileSpreadsheet, 
  Download, 
  FileText, 
  Moon, 
  Sun, 
  Play, 
  Filter,
  ShieldCheck,
  Building2,
  Printer,
  Volume2,
  VolumeX,
  TrendingUp,
  Wifi,
  WifiOff,
  Database,
  RotateCcw,
  Smartphone,
  Maximize2,
  Calendar,
  HelpCircle,
  Globe,
  HardDrive
} from 'lucide-react';
import { 
  FilterState, 
  ZoneName,
  Locale
} from '../types';
import { soundEngine } from '../utils/sound';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle, LogOut } from 'lucide-react';
import { translations, LANGUAGE_OPTIONS } from '../utils/translations';

interface NavbarProps {
  locale?: Locale;
  setLocale?: (loc: Locale) => void;
  activeTab?: 'Dashboard' | 'Map' | 'Tables';
  setActiveTab?: (tab: 'Dashboard' | 'Map' | 'Tables') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenLogModal: () => void;
  onOpenImportModal: () => void;
  onOpenYoYModal: () => void;
  onOpenReportModal: () => void;
  onOpenAuthModal: () => void;
  onOpenSupportModal?: () => void;
  onOpenExternalResources?: () => void;
  onOpenGoogleDrive?: () => void;
  onExportAllCSV: () => void;
  onToggleSimulator: () => void;
  isSimulatorRunning: boolean;
  onTogglePrintMode: () => void;
  isPrintFriendlyMode: boolean;
  isPortraitMode?: boolean;
  onTogglePortraitMode?: () => void;
  isOnline?: boolean;
  cachedRecordsCount?: number;
  onResetCache?: () => void;
  dataMinDate?: string;
  dataMaxDate?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  locale,
  setLocale,
  darkMode,
  setDarkMode,
  filters,
  setFilters,
  onOpenLogModal,
  onOpenImportModal,
  onOpenYoYModal,
  onOpenReportModal,
  onExportAllCSV,
  onToggleSimulator,
  isSimulatorRunning,
  onTogglePrintMode,
  isPrintFriendlyMode,
  isPortraitMode = false,
  onTogglePortraitMode,
  isOnline = true,
  cachedRecordsCount = 0,
  onResetCache,
  dataMinDate,
  dataMaxDate,
  onOpenAuthModal,
  onOpenSupportModal,
  onOpenExternalResources,
  onOpenGoogleDrive,
  activeTab = 'Dashboard',
  setActiveTab
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEngine.enabled);
  const [internalLocale, setInternalLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('hrvl_locale');
    if (saved === 'en' || saved === 'om' || saved === 'am') return saved;
    return 'en';
  });

  const activeLocale = locale || internalLocale;
  const t = translations[activeLocale];

  const handleLocaleChange = (newLoc: Locale) => {
    if (setLocale) {
      setLocale(newLoc);
    } else {
      setInternalLocale(newLoc);
    }
    localStorage.setItem('hrvl_locale', newLoc);
  };

  const { user, logout } = useAuth();

  const toggleSound = () => {
    const next = !soundEnabled;
    soundEngine.enabled = next;
    setSoundEnabled(next);
    if (next) soundEngine.playBlip();
  };
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Top Row — 3-column grid so the nav tabs are truly centered on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] lg:items-center py-2.5 gap-3">
          
          {/* Brand & Logo - 3D Floating Frameless Logo */}
          <div className="flex items-center space-x-3 shrink-0 min-w-0">
            <div className="relative group shrink-0 cursor-pointer">
              <div className="h-12 w-12 flex items-center justify-center bg-transparent transition-all duration-300 transform group-hover:-translate-y-1 group-hover:scale-110 group-hover:rotate-3 filter drop-shadow-[0_8px_16px_rgba(16,185,129,0.35)] dark:drop-shadow-[0_10px_22px_rgba(52,211,153,0.45)]">
                <img 
                  src="/hrvl-emblem.png" 
                  alt="HRVL Emblem" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('1B-I4DeFvksl-bfA9KXPemqmEx7efTI8C')) {
                      target.src = 'https://lh3.googleusercontent.com/d/1B-I4DeFvksl-bfA9KXPemqmEx7efTI8C';
                    }
                  }}
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]" 
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                  {t.title}
                </h1>
                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800 whitespace-nowrap">
                  {t.badge}
                </span>
                
                {/* Offline LocalStorage Cache Indicator Badge */}
                <div 
                  className={`inline-flex items-center space-x-1 px-2 py-0.5 text-[11px] font-bold rounded-full border transition-all whitespace-nowrap ${
                    !isOnline 
                      ? 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700 animate-pulse'
                      : 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800'
                  }`}
                  title={isOnline ? `Surveillance data cached in browser localStorage (${cachedRecordsCount} records)` : `Offline Mode: Field entries saved locally to localStorage (${cachedRecordsCount} records)`}
                >
                  {!isOnline ? (
                    <>
                      <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>{t.offlineCacheActive} ({cachedRecordsCount} recs)</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <span>{t.cachedLocally} ({cachedRecordsCount} recs)</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 min-w-0">
                <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{t.subtitle}</span>
              </p>
              {dataMinDate && dataMaxDate && (
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 min-w-0">
                  <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{t.importedDataRange} {dataMinDate} to {dataMaxDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs - truly centered (grid column auto + justify-self-center) */}
          {setActiveTab && (
            <div className="flex bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 shrink-0 justify-self-center lg:justify-self-center">
              {(['Dashboard', 'Map', 'Tables'] as const).map(tab => {
                const tabLabel = tab === 'Dashboard' ? t.dashboard : tab === 'Map' ? t.map : t.tables;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveTab(tab);
                    }}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                      activeTab === tab
                        ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    {tabLabel}
                  </button>
                );
              })}
            </div>
          )}

          {/* Top Right Controls: Zone Filter, Language Toggle, Sound, Theme, Auth */}
          <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-end shrink-0">
            {/* Quick Zone Filter */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              <select
                aria-label="Filter by Zone"
                value={filters.zone}
                onChange={(e) => {
                  soundEngine.playClick();
                  setFilters(prev => ({ ...prev, zone: e.target.value as any }));
                }}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none pr-2 cursor-pointer"
              >
                <option value="All" className="dark:bg-slate-900">{t.allZones}</option>
                <option value="E/H" className="dark:bg-slate-900">{t.eastHararghe}</option>
                <option value="W/H" className="dark:bg-slate-900">{t.westHararghe}</option>
              </select>
            </div>

            {/* Language Toggle Dropdown */}
            <div className="flex items-center bg-indigo-50 dark:bg-indigo-950/80 rounded-lg p-1 border border-indigo-200 dark:border-indigo-800/80 shadow-xs">
              <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ml-1.5 mr-1 shrink-0" />
              <select
                aria-label={t.selectLanguage}
                title={t.selectLanguage}
                value={activeLocale}
                onChange={(e) => {
                  soundEngine.playClick();
                  handleLocaleChange(e.target.value as Locale);
                }}
                className="bg-transparent text-xs font-extrabold text-indigo-950 dark:text-indigo-200 focus:outline-none pr-1 cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold">
                    {opt.flag} {opt.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Acoustic Telemetry Sound Switch */}
            <button
              onClick={toggleSound}
              aria-label="Toggle acoustic telemetry sound effects"
              title={soundEnabled ? 'Acoustic Telemetry Audio: ON' : 'Acoustic Telemetry Audio: MUTED'}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                soundEnabled 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Auth Toggle */}
            {user ? (
              <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-700 pl-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 object-cover" />
                ) : (
                  <UserCircle className="w-5 h-5 text-slate-500" />
                )}
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate hidden sm:inline">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    logout();
                  }}
                  title={t.signOut}
                  className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center border-l border-slate-200 dark:border-slate-700 pl-2">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onOpenAuthModal();
                  }}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>{t.signIn}</span>
                </button>
              </div>
            )}

            {/* Dark / Light Toggle */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setDarkMode((prev: boolean) => !prev);
              }}
              title={darkMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              aria-label="Toggle theme"
              className="px-2.5 py-1.5 inline-flex items-center space-x-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-2xs"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                  <span className="hidden sm:inline text-xs font-semibold">{t.dayMode}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/20 dark:text-indigo-400" />
                  <span className="hidden sm:inline text-xs font-semibold">{t.nightMode}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Secondary Action Toolbar Row - horizontal scroll on mobile, wrap+center on desktop */}
        <div className="flex items-center gap-1.5 overflow-x-auto lg:overflow-x-visible lg:flex-wrap py-2 border-t border-slate-200/80 dark:border-slate-800/80 no-scrollbar justify-start lg:justify-center">
          {/* Primary Action: Log Arrival */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenLogModal();
            }}
            className="h-8 px-3 inline-flex items-center justify-center space-x-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 border border-emerald-600"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.logArrival}</span>
          </button>

          {/* Profile Simulator */}
          <button
            onClick={() => {
              soundEngine.playBlip();
              onToggleSimulator();
            }}
            className={`h-8 px-2.5 inline-flex items-center justify-center space-x-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              isSimulatorRunning
                ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulatorRunning ? 'fill-slate-950 text-slate-950' : 'text-emerald-600 dark:text-emerald-400'}`} />
            <span>{isSimulatorRunning ? t.simulatorActive : t.profileSimulator}</span>
          </button>

          {/* Multi-Excel Import */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenImportModal();
            }}
            className="h-8 px-2.5 inline-flex items-center justify-center space-x-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200/90 dark:border-slate-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.multiExcelImport}</span>
          </button>

          {/* YoY Analysis */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenYoYModal();
            }}
            className="h-8 px-2.5 inline-flex items-center justify-center space-x-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200/90 dark:border-slate-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <TrendingUp className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{t.yoyAnalysis}</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={() => {
              soundEngine.playSuccess();
              onExportAllCSV();
            }}
            className="h-8 px-2.5 inline-flex items-center justify-center space-x-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200/90 dark:border-slate-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{t.csvExport}</span>
          </button>

          {/* AI SitRep Report */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenReportModal();
            }}
            className="h-8 px-2.5 inline-flex items-center justify-center space-x-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200/90 dark:border-slate-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{t.aiSitrepReport}</span>
          </button>

          {/* Google Drive Backup */}
          {onOpenGoogleDrive && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenGoogleDrive();
              }}
              title="Backup & Import Reports via Google Drive Cloud Integration"
              className="h-8 px-2.5 inline-flex items-center justify-center space-x-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200/90 dark:border-slate-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t.googleDrive}</span>
            </button>
          )}

          {/* Open Access Portals */}
          {onOpenExternalResources && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenExternalResources();
              }}
              title="Open Access Portals for Veterinary Research & Epidemiology"
              className="h-8 px-2.5 inline-flex items-center justify-center space-x-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200/90 dark:border-slate-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{t.openAccessPortal}</span>
            </button>
          )}

          {/* Support Template */}
          {onOpenSupportModal && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenSupportModal();
              }}
              title="View & Copy Support Email Template (+251-93331-0270 / henz@hirnarvl.onmicrosoft.com)"
              className="h-8 px-2.5 inline-flex items-center justify-center space-x-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200/90 dark:border-slate-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t.supportTemplate}</span>
            </button>
          )}

          {/* Reset Cache */}
          {onResetCache && (
            <button
              onClick={() => {
                if (window.confirm('Reset offline cached records and revert to default sample dataset?')) {
                  soundEngine.playClick();
                  onResetCache();
                }
              }}
              title="Reset offline cache and restore default sample data"
              className="h-8 px-2.5 inline-flex items-center justify-center space-x-1 text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200/90 dark:border-slate-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetCache}</span>
            </button>
          )}

          {/* Portrait Mobile/Tablet Layout Toggle */}
          {onTogglePortraitMode && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onTogglePortraitMode();
              }}
              title={isPortraitMode ? 'Switch to Full Landscape Desktop View' : 'Switch to Focused Vertical Portrait Layout'}
              className={`h-8 px-2.5 inline-flex items-center justify-center space-x-1 text-xs font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isPortraitMode
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
              }`}
            >
              {isPortraitMode ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{t.portraitActive}</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{t.portraitView}</span>
                </>
              )}
            </button>
          )}

          {/* Field Print Snapshot Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onTogglePrintMode();
            }}
            className={`h-8 px-2.5 inline-flex items-center justify-center space-x-1 text-xs font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              isPrintFriendlyMode
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
            }`}
          >
            <Printer className={`w-3.5 h-3.5 ${isPrintFriendlyMode ? 'text-slate-950' : 'text-amber-600 dark:text-amber-400'}`} />
            <span>{isPrintFriendlyMode ? t.exitPrintView : t.fieldPrintSnapshot}</span>
          </button>
        </div>

      </div>
    </header>
  );
};

