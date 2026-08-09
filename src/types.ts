export type ZoneName = 'E/H' | 'W/H';

export type Locale = 'en' | 'om' | 'am';

export type LivestockSpecies = 
  | 'Cattle' 
  | 'Sheep' 
  | 'Goats' 
  | 'Camels' 
  | 'Equines' 
  | 'Poultry' 
  | 'Swine / Others';

export type DiseaseName = 
  | 'Foot-and-Mouth Disease (FMD)'
  | 'Lumpy Skin Disease (LSD)'
  | 'Peste des Petits Ruminants (PPR)'
  | 'Contagious Bovine Pleuropneumonia (CBPP)'
  | 'African Horse Sickness (AHS)'
  | 'Anthrax'
  | 'Rabies'
  | 'Blackleg'
  | 'Newcastle Disease (ND)';

export type OutbreakStatus = 'Active' | 'Contained' | 'Under Investigation' | 'Resolved';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface WoredaInfo {
  id: string;
  name: string;
  zone: ZoneName;
  lat: number;
  lng: number;
  populationEstimate: number;
}

export interface SurveillanceRecord {
  id: string;
  date: string; // YYYY-MM-DD or ISO timestamp
  timestamp: number;
  woreda: string;
  zone: ZoneName;
  lat: number;
  lng: number;
  disease: DiseaseName | string;
  species: LivestockSpecies | string;
  cases: number;
  deaths: number;
  risk: RiskLevel;
  comment?: string;
  phone?: string;
  reporter?: string;
  isZeroReport?: boolean;
  sourceFile?: string;
  sourceYear?: number;
}

export interface Outbreak {
  id: string;
  outbreakCode: string;
  disease: string;
  zone: ZoneName;
  woreda: string;
  startDate: string;
  status: OutbreakStatus;
  cases: number;
  deaths: number;
  susceptible: number;
  morbidityRate: number; // percentage
  mortalityRate: number; // percentage
  cfr: number; // Case Fatality Rate percentage
  lat: number;
  lng: number;
  speciesAffected: string[];
  quarantineApplied: boolean;
  vaccinationActive: boolean;
}

export interface WoredaCompliance {
  woreda: string;
  zone: ZoneName;
  expectedReports: number;
  actualReports: number;
  complianceRate: number; // 0 - 100%
  lastReportDate: string;
  status: 'Compliant' | 'Needs Attention' | 'Non-Compliant';
}

export interface DiseaseSummary {
  disease: string;
  totalOutbreaks: number;
  totalCases: number;
  totalDeaths: number;
  morbidityPercent: number;
  cfrPercent: number;
  activeWoredasCount: number;
  primarySpecies: string;
  riskLevel: RiskLevel;
}

export interface FilterState {
  zone: 'All' | ZoneName;
  woreda: 'All' | string;
  disease: 'All' | string;
  species: 'All' | string;
  dateFrom: string;
  dateTo: string;
  searchTerm: string;
}

export interface NarrativeReport {
  title: string;
  dateGenerated: string;
  executiveSummary: string;
  outbreakStatusAnalysis: string;
  speciesVulnerability: string;
  zonalComplianceSummary: string;
  epidemiologicalRecommendations: string[];
  highRiskWoredas: string[];
}
