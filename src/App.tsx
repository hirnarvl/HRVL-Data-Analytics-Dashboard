/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Printer, X, ShieldCheck, FileText, Check, Activity, Building2, UserCircle2 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { KPICards } from './components/KPICards';
import { MELScorecardPanel } from './components/MELScorecardPanel';
import { OutbreakMap } from './components/OutbreakMap';
import { TrendCharts } from './components/TrendCharts';
import { SpeciesDonutChart } from './components/SpeciesDonutChart';
import { CFRTrendChart } from './components/CFRTrendChart';
import { DiseaseSummaryTable } from './components/DiseaseSummaryTable';
import { OutbreakTable } from './components/OutbreakTable';
import { SurveillanceTable } from './components/SurveillanceTable';
import { ComplianceTable } from './components/ComplianceTable';
import { FooterBanner } from './components/FooterBanner';
import { NewArrivalModal } from './components/NewArrivalModal';
import { ExcelImportModal } from './components/ExcelImportModal';
import { YoYTrendAnalysisModal } from './components/YoYTrendAnalysisModal';
import { AIReportModal } from './components/AIReportModal';
import { PrintableReportView } from './components/PrintableReportView';
import { AuthModal } from './components/AuthModal';
import { SupportModal } from './components/SupportModal';
import { ExternalResourcesModal } from './components/ExternalResourcesModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { HRVL_LOGO_URL } from './components/Logo';

import { 
  FilterState, 
  SurveillanceRecord, 
  Outbreak, 
  WoredaCompliance, 
  DiseaseSummary,
  NarrativeReport,
  Locale
} from './types';

import { 
  INITIAL_SURVEILLANCE_RECORDS, 
  INITIAL_OUTBREAKS, 
  generateInitialCompliance, 
  DISEASE_SUMMARIES 
} from './data/sampleData';
import { HARARGHE_WOREDAS } from './data/woredas';
import { exportToCSV } from './utils/export';
import { loadCachedRecords, saveCachedRecords, clearCachedRecords } from './utils/storage';
import { subscribeToFirestoreRecords, saveRecordToFirestore } from './utils/firebaseStorage';
import { useAuth } from './contexts/AuthContext';
import { useI18n } from './contexts/I18nContext';
import { soundEngine } from './utils/sound';

export default function App() {
  const { user, loading, signInAsGuest } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('hrvl_theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return true;
  });
  
  // Primary Dashboard State - Initialized from localStorage cache for field offline resilience
  const [records, setRecords] = useState<SurveillanceRecord[]>(loadCachedRecords);
  const [outbreaks, setOutbreaks] = useState<Outbreak[]>(INITIAL_OUTBREAKS);
  const [complianceList, setComplianceList] = useState<WoredaCompliance[]>(generateInitialCompliance());
  const [diseaseSummaries, setDiseaseSummaries] = useState<DiseaseSummary[]>(DISEASE_SUMMARIES);

  // Network Connectivity State (Field Offline Mode Tracking)
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Synchronize network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Automatic localStorage Sync Effect whenever surveillance records change
  useEffect(() => {
    saveCachedRecords(records);
  }, [records]);

  // Real-time Firestore sync effect
  useEffect(() => {
    const unsub = subscribeToFirestoreRecords((remoteRecords) => {
      if (remoteRecords && remoteRecords.length > 0) {
        setRecords(remoteRecords);
      }
    });
    return () => unsub();
  }, []);

  // Reset local storage cache to initial default data
  const handleResetCache = () => {
    clearCachedRecords();
    setRecords(INITIAL_SURVEILLANCE_RECORDS);
  };

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    zone: 'All',
    woreda: 'All',
    disease: 'All',
    species: 'All',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });

  // Simulator, Portrait Layout & Print Mode State
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const [isPrintFriendlyMode, setIsPrintFriendlyMode] = useState(false);
  const [isPortraitMode, setIsPortraitMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Map' | 'Tables'>('Dashboard');

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isYoYModalOpen, setIsYoYModalOpen] = useState(false);
  const [isAIReportModalOpen, setIsAIReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState(false);
  const [isExternalResourcesOpen, setIsExternalResourcesOpen] = useState(false);
  const [printableReport, setPrintableReport] = useState<NarrativeReport | null>(null);

  // Toggle Dark Class on <html> element with persistent theme storage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hrvl_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hrvl_theme', 'light');
    }
  }, [darkMode]);

  // Real-time Field Profile Simulator Interval
  useEffect(() => {
    let interval: any = null;
    if (isSimulatorRunning) {
      interval = setInterval(() => {
        // Pick random woreda from 36 Hararghe woredas
        const randomWoreda = HARARGHE_WOREDAS[Math.floor(Math.random() * HARARGHE_WOREDAS.length)];
        const diseases = [
          'Foot-and-Mouth Disease (FMD)',
          'Peste des Petits Ruminants (PPR)',
          'Lumpy Skin Disease (LSD)',
          'Contagious Bovine Pleuropneumonia (CBPP)',
          'Newcastle Disease (ND)'
        ];
        const speciesList = ['Cattle', 'Goats', 'Sheep', 'Poultry', 'Equines'];
        
        const isZero = Math.random() < 0.25; // 25% chance of zero report
        const randomDisease = isZero ? 'None (Zero Reporting)' : diseases[Math.floor(Math.random() * diseases.length)];
        const randomSpecies = isZero ? 'Cattle' : speciesList[Math.floor(Math.random() * speciesList.length)];
        const cases = isZero ? 0 : Math.floor(Math.random() * 25) + 5;
        const deaths = isZero ? 0 : Math.floor(cases * (Math.random() * 0.2));

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];

        const simRecord: SurveillanceRecord = {
          id: `SIM-${Date.now()}`,
          date: dateStr,
          timestamp: now.getTime(),
          woreda: randomWoreda.name,
          zone: randomWoreda.zone,
          lat: randomWoreda.lat,
          lng: randomWoreda.lng,
          disease: randomDisease,
          species: randomSpecies,
          cases,
          deaths,
          risk: deaths > 3 ? 'Critical' : cases > 15 ? 'High' : 'Medium',
          comment: `Live simulated field telemetry stream arrival on ${now.toLocaleTimeString()}`,
          reporter: 'Automated HRVL Stream',
          isZeroReport: isZero
        };

        setRecords(prev => [simRecord, ...prev]);
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulatorRunning]);

  // Handle adding new arrival record manually or from quick simulator
  const handleAddLogArrival = (rec: Partial<SurveillanceRecord>) => {
    const fullRec: SurveillanceRecord = {
      id: rec.id || `SR-${Date.now()}`,
      date: rec.date || new Date().toISOString().split('T')[0],
      timestamp: rec.timestamp || Date.now(),
      woreda: rec.woreda || 'Haramaya',
      zone: rec.zone || 'E/H',
      lat: rec.lat || 9.4123,
      lng: rec.lng || 42.0123,
      disease: rec.disease || 'Foot-and-Mouth Disease (FMD)',
      species: rec.species || 'Cattle',
      cases: rec.cases !== undefined ? rec.cases : 10,
      deaths: rec.deaths !== undefined ? rec.deaths : 1,
      risk: rec.risk || 'High',
      comment: rec.comment || 'Field record added manually',
      reporter: rec.reporter || 'Vet Officer',
      isZeroReport: rec.isZeroReport || false
    };

    setRecords(prev => [fullRec, ...prev]);
    saveRecordToFirestore(fullRec);

    // Recalculate disease summary counts
    setDiseaseSummaries(prev => prev.map(ds => {
      if (ds.disease === fullRec.disease) {
        return {
          ...ds,
          totalCases: ds.totalCases + fullRec.cases,
          totalDeaths: ds.totalDeaths + fullRec.deaths,
          cfrPercent: Number((((ds.totalDeaths + fullRec.deaths) / (ds.totalCases + fullRec.cases)) * 100).toFixed(1))
        };
      }
      return ds;
    }));
  };

  // Handle Excel Batch Import
  const handleImportRecords = (newRecords: SurveillanceRecord[], minDate?: string, maxDate?: string) => {
    setRecords(prev => [...newRecords, ...prev]);
    newRecords.forEach(rec => saveRecordToFirestore(rec));
    if (minDate && maxDate) {
      setFilters(prev => ({ ...prev, dateFrom: minDate, dateTo: maxDate }));
    }
  };

  // Export All 4 Tables as CSV Bundle
  const handleExportAllCSV = () => {
    exportToCSV('HRVL_Surveillance_Records_All', records);
    exportToCSV('HRVL_Outbreaks_All', outbreaks);
    exportToCSV('HRVL_Woreda_Compliance_All', complianceList);
    exportToCSV('HRVL_Disease_Summary_All', diseaseSummaries);
  };

  // Filtered dataset according to Navbar selection
  const filteredRecords = records.filter(rec => {
    if (filters.zone !== 'All' && rec.zone !== filters.zone) return false;
    return true;
  });

  const validDates = records
    .map(r => r.date)
    .filter(d => Boolean(d) && !isNaN(new Date(d).getTime()))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
  const dataMinDate = validDates.length > 0 ? validDates[0] : undefined;
  const dataMaxDate = validDates.length > 0 ? validDates[validDates.length - 1] : undefined;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen font-sans transition-colors duration-200 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4`}>
         <div className="text-center space-y-6 max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="mx-auto h-20 w-20 flex items-center justify-center">
              <img 
                 src={HRVL_LOGO_URL} 
                 alt="HRVL Emblem" 
                 referrerPolicy="no-referrer"
                className="w-full h-full object-contain" 
               />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Hirna RVL Analytics
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Secure access required. Please sign in to view the geospatial disease surveillance dashboard and epidemiological data.
              </p>
            </div>
            
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsAuthModalOpen(true);
              }}
              className="w-full flex justify-center items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Sign In to Access Dashboard</span>
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-400">or</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                signInAsGuest();
              }}
              className="w-full flex justify-center items-center space-x-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Skip Firebase authentication — useful on preview domains not yet authorized in the Firebase Console."
            >
              <UserCircle2 className="w-5 h-5" />
              <span>Continue as Guest</span>
            </button>

            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-3">
              Guest mode bypasses Firebase login so you can explore the dashboard immediately. Cloud sync features will be unavailable until you sign in with a real account.
            </p>
         </div>

         <AuthModal
           isOpen={isAuthModalOpen}
           onClose={() => setIsAuthModalOpen(false)}
         />
      </div>
    );
  }

  // If printable report view is active
  if (printableReport) {
    return (
      <PrintableReportView
        report={printableReport}
        outbreaks={outbreaks}
        records={records}
        complianceList={complianceList}
        onBack={() => setPrintableReport(null)}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 flex flex-col lg:flex-row ${
      isPrintFriendlyMode 
        ? 'bg-white text-slate-900 border-t-8 border-amber-500' 
        : 'bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    }`}>
      
      {/* Left Vertical Navigation Bar */}
      <div className={isPrintFriendlyMode ? 'print:hidden' : 'shrink-0'}>
        <Navbar
          locale={locale}
          setLocale={setLocale}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          filters={filters}
          setFilters={setFilters}
          onOpenLogModal={() => setIsLogModalOpen(true)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onOpenYoYModal={() => setIsYoYModalOpen(true)}
          onOpenReportModal={() => setIsAIReportModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenSupportModal={() => setIsSupportModalOpen(true)}
          onOpenExternalResources={() => setIsExternalResourcesOpen(true)}
          onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
          onExportAllCSV={handleExportAllCSV}
          onTogglePrintMode={() => setIsPrintFriendlyMode(prev => !prev)}
          isPrintFriendlyMode={isPrintFriendlyMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOnline={isOnline}
          cachedRecordsCount={records.length}
          onResetCache={handleResetCache}
          dataMinDate={dataMinDate}
          dataMaxDate={dataMaxDate}
        />
      </div>

      {/* Main Right Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">

        {/* Sticky Top Field Print Snapshot Alert Banner (Hidden when printing) */}
        {isPrintFriendlyMode && (
          <div className="print:hidden sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-2 border-b border-amber-600">
            <div className="flex items-center space-x-2 font-bold text-xs sm:text-sm">
              <Printer className="w-5 h-5 animate-bounce" />
              <span>🖨️ FIELD SNAPSHOT PRINT MODE — High-contrast white canvas optimized for physical field meetings & PDF export.</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-950 text-white font-extrabold text-xs rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Snapshot (Ctrl+P)</span>
              </button>

              <button
                onClick={() => setIsPrintFriendlyMode(false)}
                className="p-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold text-xs cursor-pointer"
                title="Exit Print Mode"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Workspace Container */}
        <main className={`flex-1 w-full mx-auto transition-all duration-300 py-6 pb-24 lg:pb-6 space-y-6 ${
          isPortraitMode 
            ? 'max-w-2xl px-3 sm:px-4 bg-slate-900/40 dark:bg-slate-900/60 rounded-3xl my-4 border border-indigo-500/20 shadow-2xl ring-1 ring-indigo-500/10' 
            : 'max-w-7xl px-4 sm:px-6 lg:px-8'
        }`}>

        

        {/* Portrait Mode Field Banner */}
        {isPortraitMode && (
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-indigo-200 border border-indigo-700/60 p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 font-medium">
              <span className="text-lg">📱</span>
              <div>
                <p className="font-extrabold text-white font-heading">Portrait Field Mode Active</p>
                <p className="text-[11px] text-indigo-300">Optimized vertical stack for handheld tablets & field mobile screens.</p>
              </div>
            </div>
            <button
              onClick={() => setIsPortraitMode(false)}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer shrink-0"
            >
              Exit Portrait
            </button>
          </div>
        )}
        
        {/* Printable Official Header Block (Appears prominently in print mode) */}
        {isPrintFriendlyMode && (
          <div className="bg-slate-50 border-2 border-slate-900 p-6 rounded-xl space-y-3 print:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-400 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xl">
                  HRVL
                </div>
                <div>
                  <h1 className="text-lg font-black text-slate-950 uppercase tracking-tight">
                    HIRNA REGIONAL VETERINARY DIAGNOSTIC LABORATORY (HRVL)
                  </h1>
                  <h2 className="text-xs font-bold text-slate-700 uppercase">
                    Field Epidemiology & Disease Surveillance Briefing Snapshot
                  </h2>
                </div>
              </div>

              <div className="text-right text-xs font-mono">
                <p className="font-bold">DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-slate-600">ZONE FILTER: {filters.zone}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold uppercase rounded">
                  PHYSICAL BRIEFING COPY
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-serif italic">
              Official surveillance snapshot summary prepared for regional field veterinary officer consultations across E/H (21 Woredas) & W/H (15 Woredas). Includes active outbreak hot-spots, CFR trends, and woreda zero-reporting compliance status.
            </p>
          </div>
        )}

        
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards & Zone Reporting Rates */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <KPICards
            records={filteredRecords}
            outbreaks={outbreaks}
            complianceList={complianceList}
            locale={locale}
          />
        </motion.div>

        {/* WAHO / WOAH MEL Scorecard & Data Quality Panel */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.1, ease: 'easeOut' }}
        >
          <MELScorecardPanel
            locale={locale}
            records={filteredRecords}
            outbreaks={outbreaks}
            complianceList={complianceList}
            onSelectZone={(zone) => setFilters(prev => ({ ...prev, zone }))}
          />
        </motion.div>

        
            {/* Reporting Trend Charts & Profile Simulator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
        >
          <TrendCharts
            locale={locale}
            records={filteredRecords}
            darkMode={isPrintFriendlyMode ? false : darkMode}
            onAddLogArrival={handleAddLogArrival}
            onOpenYoYModal={() => setIsYoYModalOpen(true)}
          />
        </motion.div>

        {/* 2-Column Section: Species Donut Chart + CFR Trend Line Chart */}
        <div className={`grid gap-6 ${isPortraitMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
          >
            <SpeciesDonutChart darkMode={isPrintFriendlyMode ? false : darkMode} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4, ease: 'easeOut' }}
          >
            <CFRTrendChart darkMode={isPrintFriendlyMode ? false : darkMode} />
          </motion.div>
        </div>

        
          </div>
        )}

        {activeTab === 'Map' && (
          <div className="space-y-6">
            {/* Interactive Outbreak Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
        >
          <OutbreakMap
            outbreaks={outbreaks}
            records={filteredRecords}
            darkMode={isPrintFriendlyMode ? false : darkMode}
            selectedZone={filters.zone}
          />
        </motion.div>

        
          </div>
        )}

        {activeTab === 'Tables' && (
          <div className="space-y-6">
            {/* Disease Summary & Outbreak Tables */}
        <div className={`grid gap-6 ${isPortraitMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.45, ease: 'easeOut' }}
          >
            <DiseaseSummaryTable locale={locale} summaries={diseaseSummaries} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5, ease: 'easeOut' }}
          >
            <OutbreakTable locale={locale} outbreaks={outbreaks} />
          </motion.div>
        </div>

        {/* Field Surveillance Log Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.55, ease: 'easeOut' }}
        >
          <SurveillanceTable locale={locale} records={filteredRecords} />
        </motion.div>

        {/* Woreda Compliance Progress Bars Table (36 Woredas) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.6, ease: 'easeOut' }}
        >
          <ComplianceTable locale={locale} complianceList={complianceList} records={filteredRecords} />
        </motion.div>

        
          </div>
        )}
  {/* Field Officer Sign-Off & Verification Stamp Block (Print Mode Only) */}
        {isPrintFriendlyMode && (
          <div className="mt-8 pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-8">
              <p className="font-bold text-slate-900">Briefing Lead / Regional Epidemiologist:</p>
              <div className="border-b border-slate-400 w-3/4"></div>
              <p className="text-[11px] text-slate-500">Signature & Date</p>
            </div>
            <div className="space-y-8 text-right">
              <p className="font-bold text-slate-900">HRVL Laboratory Director Stamp:</p>
              <div className="border-b border-slate-400 w-3/4 ml-auto"></div>
              <p className="text-[11px] text-slate-500">Official Seal & Verification</p>
            </div>
          </div>
        )}

      </main>

      {/* Footer Banner at the bottom of all dashboards */}
      {!isPrintFriendlyMode && (
        <FooterBanner onOpenExternalResources={() => setIsExternalResourcesOpen(true)} />
      )}
      </div>

      {/* Modals */}
      <NewArrivalModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onAddRecord={handleAddLogArrival}
      />

      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportRecords={handleImportRecords}
        onOpenYoYAnalysis={() => setIsYoYModalOpen(true)}
      />

      <YoYTrendAnalysisModal
        isOpen={isYoYModalOpen}
        onClose={() => setIsYoYModalOpen(false)}
        records={records}
        darkMode={darkMode}
      />

      <AIReportModal
        isOpen={isAIReportModalOpen}
        onClose={() => setIsAIReportModalOpen(false)}
        outbreaks={outbreaks}
        records={records}
        complianceList={complianceList}
        onOpenPrintView={(rep) => setPrintableReport(rep)}
        locale={locale}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      <GoogleDriveModal
        isOpen={isGoogleDriveOpen}
        onClose={() => setIsGoogleDriveOpen(false)}
        records={records}
        onImportRecords={handleImportRecords}
      />

      <ExternalResourcesModal
        isOpen={isExternalResourcesOpen}
        onClose={() => setIsExternalResourcesOpen(false)}
      />
    </div>
  );
}
