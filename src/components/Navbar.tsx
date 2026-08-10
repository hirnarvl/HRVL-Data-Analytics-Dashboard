import React, { useState } from 'react';
import { 
  PlusCircle, 
  FileSpreadsheet, 
  Download, 
  FileText, 
  Moon, 
  Sun, 
  Play, 
  Filter,
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
  HardDrive,
  UserCircle, 
  LogOut,
  LayoutDashboard,
  MapPin,
  Table,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { 
  FilterState, 
  Locale
} from '../types';
import { soundEngine } from '../utils/sound';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { LANGUAGE_OPTIONS } from '../utils/translations';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { locale: ctxLocale, setLocale: ctxSetLocale, t: ctxT } = useI18n();

  const activeLocale = locale || ctxLocale;
  const t = ctxT;

  const handleLocaleChange = (newLoc: Locale) => {
    if (setLocale) {
      setLocale(newLoc);
    } else {
      ctxSetLocale(newLoc);
    }
  };

  const { user, logout } = useAuth();

  const toggleSound = () => {
    const next = !soundEnabled;
    soundEngine.enabled = next;
    setSoundEnabled(next);
    if (next) soundEngine.playBlip();
  };

  const navItems = [
    { id: 'Dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'Map', label: t.map, icon: MapPin },
    { id: 'Tables', label: t.tables, icon: Table },
  ] as const;

  return (
    <>
      {/* Mobile Sticky Top Header Bar (visible on small/medium screens) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          {/* 3D Clipped Brand Logo Badge */}
          <div className="relative group shrink-0 cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500/40 via-teal-400/30 to-indigo-500/40 rounded-2xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300" />
            <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200/90 dark:border-slate-700/80 p-1 flex items-center justify-center shadow-md group-hover:-translate-y-0.5 group-hover:scale-105 transition-all duration-300 overflow-hidden">
              <img 
                src="/hrvl-emblem.png" 
                alt="HRVL Emblem" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('11EzymHeJj2N0w6qLhal60Cj6_zJiX3Ww')) {
                    target.src = 'https://lh3.googleusercontent.com/d/11EzymHeJj2N0w6qLhal60Cj6_zJiX3Ww';
                  }
                }}
                className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)] contrast-110" 
              />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate max-w-[170px] sm:max-w-xs">
              {t.title}
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[170px] sm:max-w-xs">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Day / Night Toggle on Mobile */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setDarkMode((prev: boolean) => !prev);
            }}
            title={darkMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            aria-label="Toggle theme"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" /> : <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />}
          </button>

          {/* Quick Log Arrival Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenLogModal();
            }}
            className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs cursor-pointer"
            title={t.logArrival}
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsMobileMenuOpen(prev => !prev);
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
            aria-label="Toggle Navigation Drawer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay for Mobile Drawer */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Left Vertical Navigation Sidebar Panel */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-30
        w-72 xl:w-80 h-screen
        bg-white dark:bg-slate-900/98 border-r border-slate-200 dark:border-slate-800
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        overflow-y-auto custom-scrollbar shadow-xl lg:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header & Brand */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            {/* 3D Glass Badge Logo Emblem */}
            <div className="relative group shrink-0 cursor-pointer">
              {/* Outer 3D Ambient Ring & Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 rounded-2xl blur-xs opacity-50 group-hover:opacity-100 transition duration-300 animate-pulse" />
              
              {/* Beveled Glass Container */}
              <div className="relative h-13 w-13 rounded-2xl bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-2 border-emerald-500/30 dark:border-emerald-400/40 p-1 flex items-center justify-center shadow-[0_8px_20px_-3px_rgba(16,185,129,0.35)] dark:shadow-[0_10px_25px_-5px_rgba(52,211,153,0.35)] group-hover:-translate-y-1 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 overflow-hidden">
                {/* 3D Highlight Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                
                <img 
                  src="/hrvl-emblem.png" 
                  alt="HRVL Emblem" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('11EzymHeJj2N0w6qLhal60Cj6_zJiX3Ww')) {
                      target.src = 'https://lh3.googleusercontent.com/d/11EzymHeJj2N0w6qLhal60Cj6_zJiX3Ww';
                    }
                  }}
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_10px_rgba(16,185,129,0.6)] contrast-110" 
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {t.title}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800">
                  {t.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 truncate">
                <Building2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{t.subtitle}</span>
              </p>
            </div>
          </div>

          {/* Offline / Online Local Data Cache Status */}
          <div 
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
              !isOnline 
                ? 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700 animate-pulse'
                : 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800'
            }`}
          >
            <div className="flex items-center space-x-2 truncate">
              {!isOnline ? (
                <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              ) : (
                <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              )}
              <span className="truncate">
                {!isOnline ? t.offlineCacheActive : t.cachedLocally}
              </span>
            </div>
            <span className="ml-1.5 px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/80 text-[10px] font-mono shrink-0">
              {cachedRecordsCount} recs
            </span>
          </div>

          {/* Imported Data Date Range */}
          {dataMinDate && dataMaxDate && (
            <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/60 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">{t.importedDataRange} {dataMinDate} to {dataMaxDate}</span>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Body */}
        <div className="p-4 space-y-6 flex-1">
          {/* Main Navigation Section */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Navigation Menu
            </p>

            {setActiveTab && navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-1 ring-emerald-500' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-0.5 text-white' : 'opacity-40'}`} />
                </button>
              );
            })}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenLogModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 flex items-center justify-center space-x-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer border border-emerald-500"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.logArrival}</span>
            </button>
          </div>

          {/* Quick Zone Filter */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="px-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Zone Filter
            </p>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-2 border border-slate-200 dark:border-slate-700">
              <Filter className="w-4 h-4 text-slate-400 ml-1 mr-2 shrink-0" />
              <select
                aria-label="Filter by Zone"
                value={filters.zone}
                onChange={(e) => {
                  soundEngine.playClick();
                  setFilters(prev => ({ ...prev, zone: e.target.value as any }));
                }}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="All" className="dark:bg-slate-900">{t.allZones}</option>
                <option value="E/H" className="dark:bg-slate-900">{t.eastHararghe}</option>
                <option value="W/H" className="dark:bg-slate-900">{t.westHararghe}</option>
              </select>
            </div>
          </div>

          {/* Tools & Analytics Quick Actions */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="px-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tools & Analytics
            </p>
            
            <div className="grid grid-cols-1 gap-1.5">
              {/* Profile Simulator */}
              <button
                onClick={() => {
                  soundEngine.playBlip();
                  onToggleSimulator();
                }}
                className={`w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  isSimulatorRunning
                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold animate-pulse'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <Play className={`w-4 h-4 shrink-0 ${isSimulatorRunning ? 'fill-slate-950 text-slate-950' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span className="truncate">{isSimulatorRunning ? t.simulatorActive : t.profileSimulator}</span>
              </button>

              {/* Multi-Excel Import */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenImportModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{t.multiExcelImport}</span>
              </button>

              {/* YoY Analysis */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenYoYModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="truncate">{t.yoyAnalysis}</span>
              </button>

              {/* CSV Export */}
              <button
                onClick={() => {
                  soundEngine.playSuccess();
                  onExportAllCSV();
                }}
                className="w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">{t.csvExport}</span>
              </button>

              {/* AI SitRep Report */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenReportModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="truncate">{t.aiSitrepReport}</span>
              </button>

              {/* Google Drive Cloud Integration */}
              {onOpenGoogleDrive && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onOpenGoogleDrive();
                    setIsMobileMenuOpen(false);
                  }}
                  title="Backup & Import Reports via Google Drive Cloud Integration"
                  className="w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
                >
                  <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate">{t.googleDrive}</span>
                </button>
              )}

              {/* Support Template */}
              {onOpenSupportModal && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onOpenSupportModal();
                    setIsMobileMenuOpen(false);
                  }}
                  title="View & Copy Support Email Template (+251-93331-0270 / henz@hirnarvl.onmicrosoft.com)"
                  className="w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="truncate">{t.supportTemplate}</span>
                </button>
              )}

              {/* Open Access Portals */}
              {onOpenExternalResources && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onOpenExternalResources();
                    setIsMobileMenuOpen(false);
                  }}
                  title="Open Access Portals for Veterinary Research & Epidemiology"
                  className="w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="truncate">{t.openAccessPortal}</span>
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
                  className={`w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    isPortraitMode
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/80'
                  }`}
                >
                  {isPortraitMode ? (
                    <>
                      <Maximize2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">{t.portraitActive}</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span className="truncate">{t.portraitView}</span>
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
                className={`w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  isPrintFriendlyMode
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs animate-pulse'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <Printer className={`w-4 h-4 shrink-0 ${isPrintFriendlyMode ? 'text-slate-950' : 'text-amber-600 dark:text-amber-400'}`} />
                <span className="truncate">{isPrintFriendlyMode ? t.exitPrintView : t.fieldPrintSnapshot}</span>
              </button>

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
                  className="w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t.resetCache}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Controls: Night/Day Toggle, Language Selector, Sound, Auth */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          
          {/* Night / Day Mode Toggle (Prominent) */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setDarkMode((prev: boolean) => !prev);
            }}
            title={darkMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            aria-label="Toggle theme"
            className="w-full py-2.5 px-3 flex items-center justify-between text-xs font-bold rounded-xl border transition-all cursor-pointer bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500"
          >
            <div className="flex items-center space-x-2.5">
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/20 dark:text-indigo-400" />
              )}
              <span>{darkMode ? t.dayMode : t.nightMode}</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
              {darkMode ? 'Night' : 'Day'}
            </span>
          </button>

          <div className="flex items-center justify-between gap-2">
            {/* Language Selector Dropdown */}
            <div className="flex-1 flex items-center bg-white dark:bg-slate-800 rounded-xl px-2.5 py-1.5 border border-slate-200 dark:border-slate-700">
              <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mr-1.5 shrink-0" />
              <select
                aria-label={t.selectLanguage}
                title={t.selectLanguage}
                value={activeLocale}
                onChange={(e) => {
                  soundEngine.playClick();
                  handleLocaleChange(e.target.value as Locale);
                }}
                className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
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
              className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                soundEnabled 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-white text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

          {/* User Auth Section */}
          <div className="pt-1">
            {user ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2 min-w-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 object-cover shrink-0" />
                  ) : (
                    <UserCircle className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    logout();
                  }}
                  title={t.signOut}
                  className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenAuthModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 flex items-center justify-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <UserCircle className="w-4 h-4" />
                <span>{t.signIn}</span>
              </button>
            )}
          </div>

        </div>
      </aside>
    </>
  );
};


