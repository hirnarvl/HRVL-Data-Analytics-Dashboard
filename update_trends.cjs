const fs = require('fs');

let content = fs.readFileSync('src/utils/translations.ts', 'utf8');

const additionalKeys = `
  // Trends
  chartEpidemiologicalCurves: string;
  chartHistoricalOverlay: string;
  chartYoYComparison: string;
  chartTimeline: string;
  chartDaily: string;
  chartWeekly: string;
  chartMonthly: string;
  chartLegendCases: string;
  chartLegendCases2025: string;
  chartLegendCases2024: string;
  chartLegendDeaths: string;
  chartLegendZero: string;
`;

const enTrans = `
    chartEpidemiologicalCurves: 'Epidemiological Curves (WAHO)',
    chartHistoricalOverlay: 'Historical Overlay:',
    chartYoYComparison: 'YoY Comparison',
    chartTimeline: 'Timeline:',
    chartDaily: 'Daily',
    chartWeekly: 'Weekly',
    chartMonthly: 'Monthly',
    chartLegendCases: 'Cases (Current)',
    chartLegendCases2025: 'Cases 2025',
    chartLegendCases2024: 'Cases 2024',
    chartLegendDeaths: 'Deaths',
    chartLegendZero: 'Zero Reports',
`;

const omTrans = `
    chartEpidemiologicalCurves: 'Daandiiwwan Dhibee (WAHO)',
    chartHistoricalOverlay: 'Daataa Seenaa:',
    chartYoYComparison: 'Xiinxala Waggaa',
    chartTimeline: 'Yeroo:',
    chartDaily: 'Guyyaa',
    chartWeekly: 'Torban',
    chartMonthly: 'Ji\\'a',
    chartLegendCases: 'Dhukkuba (Amma)',
    chartLegendCases2025: 'Dhukkuba 2025',
    chartLegendCases2024: 'Dhukkuba 2024',
    chartLegendDeaths: 'Du\\'a',
    chartLegendZero: 'Gabaasa Zeeroo',
`;

const amTrans = `
    chartEpidemiologicalCurves: 'የበሽታ መስመሮች (WAHO)',
    chartHistoricalOverlay: 'ታሪካዊ መረጃ:',
    chartYoYComparison: 'የዓመት ንጽጽር',
    chartTimeline: 'የጊዜ ሰሌዳ:',
    chartDaily: 'ቀን',
    chartWeekly: 'ሳምንት',
    chartMonthly: 'ወር',
    chartLegendCases: 'ጉዳዮች (አሁን)',
    chartLegendCases2025: 'ጉዳዮች 2025',
    chartLegendCases2024: 'ጉዳዮች 2024',
    chartLegendDeaths: 'ሞት',
    chartLegendZero: 'የዜሮ ሪፖርቶች',
`;

content = content.replace('printOfficial: string;', 'printOfficial: string;' + additionalKeys);
content = content.replace("printOfficial: 'Print Official Field Report',", "printOfficial: 'Print Official Field Report'," + enTrans);
content = content.replace("printOfficial: 'Gabaasa Dirree Ifa Ta\\'e Maxxansi',", "printOfficial: 'Gabaasa Dirree Ifa Ta\\'e Maxxansi'," + omTrans);
content = content.replace("printOfficial: 'ይፋዊ የመስክ ሪፖርት አትም',", "printOfficial: 'ይፋዊ የመስክ ሪፖርት አትም'," + amTrans);

fs.writeFileSync('src/utils/translations.ts', content);
