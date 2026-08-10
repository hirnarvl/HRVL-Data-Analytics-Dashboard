const fs = require('fs');

let tContent = fs.readFileSync('src/utils/translations.ts', 'utf8');

const additionalKeys = `
  // CFR
  cfrCaseFatality: string;
  cfrWAHOBenchmark: string;
  cfrYoYComparative: string;
  cfrAllDiseases: string;
  cfrSelectFocus: string;
  cfrTargetKeep: string;
  cfrTargetThreshold: string;
`;

const enTrans = `
    cfrCaseFatality: 'Case Fatality Rate (CFR) Trajectory',
    cfrWAHOBenchmark: 'WAHO Benchmarked Timeline',
    cfrYoYComparative: 'YoY Comparative',
    cfrAllDiseases: 'All Diseases (2026)',
    cfrSelectFocus: 'Select Focus Disease:',
    cfrTargetKeep: 'Target: Keep non-Anthrax CFR < 10%',
    cfrTargetThreshold: 'Target Threshold (10%)',
`;

const omTrans = `
    cfrCaseFatality: 'Daandii Reetii Du\\'a Dhimmaa (CFR)',
    cfrWAHOBenchmark: 'Yeroo Safaroo WAHO',
    cfrYoYComparative: 'Xiinxala Waggaa',
    cfrAllDiseases: 'Dhibeewwan Hunda (2026)',
    cfrSelectFocus: 'Dhibee Xiyyeeffannoo Filadhu:',
    cfrTargetKeep: 'Galma: CFR Anthrax-alaa < 10% eeguu',
    cfrTargetThreshold: 'Daangaa Galmaa (10%)',
`;

const amTrans = `
    cfrCaseFatality: 'የሞት መጠን (CFR) አቅጣጫ',
    cfrWAHOBenchmark: 'የWAHO የጊዜ ሰሌዳ',
    cfrYoYComparative: 'የዓመት ንጽጽር',
    cfrAllDiseases: 'ሁሉም በሽታዎች (2026)',
    cfrSelectFocus: 'የትኩረት በሽታ ይምረጡ:',
    cfrTargetKeep: 'ዒላማ፡ ከአንትራክስ ውጭ CFR < 10% ማቆየት',
    cfrTargetThreshold: 'የዒላማ ገደብ (10%)',
`;

tContent = tContent.replace('printOfficial: string;', 'printOfficial: string;' + additionalKeys);
tContent = tContent.replace("printOfficial: 'Print Official Field Report',", "printOfficial: 'Print Official Field Report'," + enTrans);
tContent = tContent.replace("printOfficial: 'Gabaasa Dirree Ifa Ta\\'e Maxxansi',", "printOfficial: 'Gabaasa Dirree Ifa Ta\\'e Maxxansi'," + omTrans);
tContent = tContent.replace("printOfficial: 'ይፋዊ የመስክ ሪፖርት አትም',", "printOfficial: 'ይፋዊ የመስክ ሪፖርት አትም'," + amTrans);
fs.writeFileSync('src/utils/translations.ts', tContent);


let content = fs.readFileSync('src/components/CFRTrendChart.tsx', 'utf8');

if (!content.includes('import { translations }')) {
  content = content.replace("import { TrendingDown, Activity, AlertCircle, Clock } from 'lucide-react';", "import { TrendingDown, Activity, AlertCircle, Clock } from 'lucide-react';\nimport { Locale } from '../types';\nimport { translations } from '../utils/translations';");
  content = content.replace("interface CFRTrendChartProps {\n  darkMode: boolean;\n}", "interface CFRTrendChartProps {\n  darkMode: boolean;\n  locale?: Locale;\n}");
  content = content.replace("export const CFRTrendChart: React.FC<CFRTrendChartProps> = ({ darkMode }) => {", "export const CFRTrendChart: React.FC<CFRTrendChartProps> = ({ darkMode, locale = 'en' }) => {\n  const t = translations[locale];");
}

content = content.replace(/>\s*Case Fatality Rate \(CFR\) Trajectory\s*</g, ">{t.cfrCaseFatality}<");
content = content.replace(/>\s*WAHO Benchmarked Timeline\s*</g, ">{t.cfrWAHOBenchmark}<");
content = content.replace(/>\s*YoY Comparative\s*</g, ">{t.cfrYoYComparative}<");
content = content.replace(/>\s*All Diseases \(2026\)\s*</g, ">{t.cfrAllDiseases}<");
content = content.replace(/>\s*Select Focus Disease:\s*</g, ">{t.cfrSelectFocus}<");
content = content.replace(/>\s*Target: Keep non-Anthrax CFR &lt; 10%\s*</g, ">{t.cfrTargetKeep}<");
content = content.replace(/label="Target Threshold \(10%\)"/g, 'label={t.cfrTargetThreshold}');

fs.writeFileSync('src/components/CFRTrendChart.tsx', content);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /<CFRTrendChart\s*darkMode={darkMode}/g,
  '<CFRTrendChart\n            locale={locale}\n            darkMode={darkMode}'
);
fs.writeFileSync('src/App.tsx', appContent);
