const fs = require('fs');

let content = fs.readFileSync('src/components/TrendCharts.tsx', 'utf8');

// Add translation imports
if (!content.includes('import { translations }')) {
  content = content.replace("import { SurveillanceRecord } from '../types';", "import { SurveillanceRecord, Locale } from '../types';\nimport { translations } from '../utils/translations';");
  content = content.replace("interface TrendChartsProps {", "interface TrendChartsProps {\n  locale?: Locale;");
  content = content.replace("onOpenYoYModal?: () => void;\n}", "onOpenYoYModal?: () => void;\n}");
  content = content.replace("onOpenYoYModal\n}) => {", "onOpenYoYModal,\n  locale = 'en'\n}) => {\n  const t = translations[locale];");
}

content = content.replace(/>\s*Epidemiological Curves \(WAHO\)\s*</g, ">{t.chartEpidemiologicalCurves}<");
content = content.replace(/>\s*Historical Overlay:\s*</g, ">{t.chartHistoricalOverlay}<");
content = content.replace(/>\s*YoY Comparison\s*</g, ">{t.chartYoYComparison}<");
content = content.replace(/>\s*Timeline:\s*</g, ">{t.chartTimeline}<");
content = content.replace(/>\s*Daily\s*</g, ">{t.chartDaily}<");
content = content.replace(/>\s*Weekly\s*</g, ">{t.chartWeekly}<");
content = content.replace(/>\s*Monthly\s*</g, ">{t.chartMonthly}<");
content = content.replace(/name="Cases \(Current\)"/g, 'name={t.chartLegendCases}');
content = content.replace(/name="Cases 2025"/g, 'name={t.chartLegendCases2025}');
content = content.replace(/name="Cases 2024"/g, 'name={t.chartLegendCases2024}');
content = content.replace(/name="Deaths"/g, 'name={t.chartLegendDeaths}');
content = content.replace(/name="Zero Reports"/g, 'name={t.chartLegendZero}');

fs.writeFileSync('src/components/TrendCharts.tsx', content);
