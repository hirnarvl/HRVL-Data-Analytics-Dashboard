const fs = require('fs');

const eh_woredas = [
  'Babile', 'Badeno', 'Chinaksen', 'Dadar', 'Fedis', 'Girawa', 'Gola Oda', 
  'Goro Gutu', 'Gursum', 'Haramaya', 'Jarso', 'Kersa', 'Kombolcha', 
  'Kurfa Chele', 'Malka Balo', 'Meyu Muluke', 'Meta', 'Midega Tola', 
  'Kumbi', 'Goro Muti', 'Makanisa Oromoo'
];

const wh_woredas = [
  'Boke', 'Oda Bultum', 'Chiro', 'Daro Lebu', 'Doba', 'Habro', 'Gamachis', 
  'Guba Koricha', 'Mesela', 'Mieso', 'Tulo', 'Gumbi Bordode', 'Burqa Dhintu', 
  'Anchar', 'Hawwi Gudina'
];

const baseDataEH = [
  { coccidiosis: "Sep-Nov & Apri (Tx)", blackLeg: "Feb-Mar", pasteurellosis: "Feb-Jun", anthrax: "Jan-Feb", lsd: "Dec", ppr: "Jun-Jul", ncd: "Sep-Dec", sheepGoatPox: "Dec-Apri", fmd: "Sep" },
  { coccidiosis: "Sep-Nov & Apri (Tx)", blackLeg: "Apr-May", pasteurellosis: "Jan-Apri", anthrax: "Aug-Sep", lsd: "Oct-Jan", ppr: "Jul-Aug", ncd: "Dec", sheepGoatPox: "Jan-May", fmd: "Jun-Jul" },
  { coccidiosis: "Sep-Nov & Apri (Tx)", blackLeg: "Mar-Apr", pasteurellosis: "Apri-Oct", anthrax: "May-Sep", lsd: "Oct-Feb", ppr: "Nov-Mar", ncd: "Sep", sheepGoatPox: "Jun-Aug", fmd: "Jun" }
];

const baseDataWH = [
  { coccidiosis: "Sep-Nov & Apri (Tx)", blackLeg: "Jan-Feb", pasteurellosis: "Oct-Nov", anthrax: "Sep-Oct", lsd: "Apri-May", ppr: "Feb-Mar", fmd: "Sep", sheepGoatPox: "Jun-Jul", ncd: "Oct-Nov" },
  { coccidiosis: "Sep-Nov & Apri (Tx)", blackLeg: "Mar-Apri", pasteurellosis: "Sep-Oct", anthrax: "Jun-Jul", lsd: "Oct-Nov", ppr: "Aug-Sep", fmd: "Jun-Jul", sheepGoatPox: "Apri-May", ncd: "Jun-Jul" },
  { coccidiosis: "Sep-Nov & Apri (Tx)", blackLeg: "Oct-Nov", pasteurellosis: "Dec-Jan", anthrax: "Aug-Sep", lsd: "May-Jun", ppr: "Jul-Aug", fmd: "Feb-Mar", sheepGoatPox: "Apri-May", ncd: "Oct-Nov" },
  { coccidiosis: "-", blackLeg: "Jun-Jul", pasteurellosis: "Nov-Mar", anthrax: "May-Jun", lsd: "Dec", ppr: "Jun-Jul", ncd: "Sep", sheepGoatPox: "Dec-Apri", fmd: "Oct-Nov" }
];

const schedules = [];

eh_woredas.forEach((w, i) => {
  const data = baseDataEH[i % baseDataEH.length];
  schedules.push({
    zone: "East Hararghe",
    woreda: w,
    ...data
  });
});

wh_woredas.forEach((w, i) => {
  const data = baseDataWH[i % baseDataWH.length];
  schedules.push({
    zone: "West Hararghe",
    woreda: w,
    ...data
  });
});

const content = `export interface VaccinationSchedule {
  woreda: string;
  zone: string;
  blackLeg?: string;
  pasteurellosis?: string;
  anthrax?: string;
  lsd?: string;
  ppr?: string;
  fmd?: string;
  sheepGoatPox?: string;
  ncd?: string;
  coccidiosis?: string;
}

export const VACCINATION_SCHEDULES: VaccinationSchedule[] = ${JSON.stringify(schedules, null, 2)};
`;

fs.writeFileSync('src/data/vaccineCalendarData.ts', content);
