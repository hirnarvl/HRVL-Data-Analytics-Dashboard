import { Locale } from '../types';

export interface Translations {
  // Header / Branding
  title: string;
  badge: string;
  subtitle: string;
  importedDataRange: string;
  offlineCacheActive: string;
  cachedLocally: string;

  // Tabs
  dashboard: string;
  map: string;
  tables: string;

  // Quick Filters
  allZones: string;
  eastHararghe: string;
  westHararghe: string;

  // Action Buttons
  logArrival: string;
  profileSimulator: string;
  simulatorActive: string;
  multiExcelImport: string;
  yoyAnalysis: string;
  csvExport: string;
  aiSitrepReport: string;
  googleDrive: string;
  openAccessPortal: string;
  supportTemplate: string;
  resetCache: string;
  portraitView: string;
  portraitActive: string;
  fieldPrintSnapshot: string;
  exitPrintView: string;
  signIn: string;
  signOut: string;

  // Theme
  dayMode: string;
  nightMode: string;

  // Language selector
  language: string;
  selectLanguage: string;
}

export const translations: Record<Locale, Translations> = {
  en: {
    title: 'Hirna RVL Analytics',
    badge: 'Oromia HRVL',
    subtitle: 'Regional Veterinary Laboratory • East (21) & West (15) Hararghe',
    importedDataRange: 'Imported Data Range:',
    offlineCacheActive: 'Offline Cache Active',
    cachedLocally: 'Cached Locally',

    dashboard: 'Dashboard',
    map: 'Map',
    tables: 'Tables',

    allZones: 'All Zones (36 Woredas)',
    eastHararghe: 'E/H (21)',
    westHararghe: 'W/H (15)',

    logArrival: 'Log Arrival',
    profileSimulator: 'Simulator',
    simulatorActive: 'Simulator Active',
    multiExcelImport: 'Excel Import',
    yoyAnalysis: 'YoY Trends',
    csvExport: 'CSV',
    aiSitrepReport: 'AI Report',
    googleDrive: 'Drive',
    openAccessPortal: 'Resources',
    supportTemplate: 'Support',
    resetCache: 'Reset',
    portraitView: '📱 Portrait',
    portraitActive: '📱 Portrait Active',
    fieldPrintSnapshot: '🖨️ Field Print',
    exitPrintView: '🖨️ Exit Print',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    dayMode: 'Day',
    nightMode: 'Night',

    language: 'Language',
    selectLanguage: 'Select Language',
  },
  om: {
    title: 'Xiinxala HRVL Hirnaa',
    badge: 'HRVL Oromiyaa',
    subtitle: 'Laaboraatoorii Beekumsa Beeyladaa Naannoo • Harargee Bahaa (21) & Dhihaa (15)',
    importedDataRange: 'Hangamtaa Daataa:',
    offlineCacheActive: 'Kuusaa Oflaayinii Active',
    cachedLocally: 'Lokaaliidhaan Kuusame',

    dashboard: 'Daashboordii',
    map: 'Kartaadhaa',
    tables: 'Gabateewwan',

    allZones: 'Aanaalee Hunda (Aanaa 36)',
    eastHararghe: 'Harargee Bahaa (21)',
    westHararghe: 'Harargee Dhihaa (15)',

    logArrival: 'Gabaasa Galchu',
    profileSimulator: 'Fakkoomsaa Raagaduu',
    simulatorActive: 'Fakkoomsaan Hojiirra',
    multiExcelImport: 'Excel Fiduu',
    yoyAnalysis: 'Xiinxala Waggaa',
    csvExport: 'CSV Erguu',
    aiSitrepReport: 'Gabaasa AI SitRep',
    googleDrive: 'Google Drive',
    openAccessPortal: 'Portal Banamaa',
    supportTemplate: 'Maxxansa Deeggarsaa',
    resetCache: 'Kuusaa Qulqulleessuu',
    portraitView: '📱 Mul\'ata Dhabaa',
    portraitActive: '📱 Mul\'ata Dhabaa Active',
    fieldPrintSnapshot: '🖨️ Fakkii Maxxansaa',
    exitPrintView: '🖨️ Maxxansa irraa Ba\'i',
    signIn: 'Seenuu',
    signOut: 'Ba\'uu',
    dayMode: 'Guyyaa',
    nightMode: 'Halkan',

    language: 'Afaan',
    selectLanguage: 'Afaan Filadhu',
  },
  am: {
    title: 'የሂርና አር.ቪ.ኤል ዳታ ትንታኔ',
    badge: 'ኦሮሚያ HRVL',
    subtitle: 'የክልል እንስሳት ህክምና ላቦራቶሪ • ምስራቅ (21) እና ምዕራብ (15) ሐረርጌ',
    importedDataRange: 'የመረጃ ክልል:',
    offlineCacheActive: 'የኦፍላይን ካች ይሰራል',
    cachedLocally: 'በቦታው ተቀምጧል',

    dashboard: 'ዳሽቦርድ',
    map: 'ካርታ',
    tables: 'ሰንጠረዦች',

    allZones: 'ሁሉንም ወረዳዎች (36 ወረዳዎች)',
    eastHararghe: 'ምስራቅ ሐረርጌ (21)',
    westHararghe: 'ምዕራብ ሐረርጌ (15)',

    logArrival: 'መረጃ አስገባ',
    profileSimulator: 'የመረጃ አስመሳይ',
    simulatorActive: 'አስመሳይ እየሰራ ነው',
    multiExcelImport: 'ኤክሰል አስገባ',
    yoyAnalysis: 'የዓመት ትንተና',
    csvExport: 'CSV ላክ',
    aiSitrepReport: 'የAI ሪፖርት',
    googleDrive: 'ጉግል ድራይቭ',
    openAccessPortal: 'ክፍት የመረጃ ፖርታል',
    supportTemplate: 'የድጋፍ ቅጽ',
    resetCache: 'ካች አጽዳ',
    portraitView: '📱 የቁመት እይታ',
    portraitActive: '📱 ቁመት እይታ ላይ',
    fieldPrintSnapshot: '🖨️ የመስክ ህትመት',
    exitPrintView: '🖨️ ከህትመት ውጣ',
    signIn: 'ግቡ',
    signOut: 'ውጡ',
    dayMode: 'ቀን',
    nightMode: 'ሌሊት',

    language: 'ቋንቋ',
    selectLanguage: 'ቋንቋ ይምረጡ',
  },
};

export const LANGUAGE_OPTIONS: { id: Locale; name: string; flag: string; nativeName: string }[] = [
  { id: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { id: 'om', name: 'Afaan Oromoo', flag: '🌳', nativeName: 'Afaan Oromoo' },
  { id: 'am', name: 'Amharic', flag: '🇪🇹', nativeName: 'አማርኛ' },
];
