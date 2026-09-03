export type GeoHierarchyLevel = 'ethiopia' | 'oromia' | 'east_hararghe' | 'west_hararghe' | 'woreda' | 'outbreak';

export interface GeoLocationExtent {
  id: string;
  name: string;
  level: GeoHierarchyLevel;
  parent?: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  bounds?: [[number, number], [number, number]]; // [[south, west], [north, east]]
}

export interface ScientificReference {
  id: string;
  organizationOrAuthor: string;
  title: string;
  year: number | string;
  sourceType: 'WOAH' | 'FAO' | 'WHO' | 'National MoA' | 'Peer-Reviewed Journal' | 'Technical Guidance';
  doiOrIdentifier?: string;
  url?: string;
  parameterSupported: string;
  notes: string;
}

export interface EnvironmentalModifierRule {
  factor: 'wind_speed' | 'relative_humidity' | 'temperature' | 'rainfall' | 'livestock_movement' | 'animal_density';
  label: string;
  thresholdOrCondition: string;
  epidemiologicalMechanism: string;
  riskImpact: 'High Increase' | 'Moderate Increase' | 'Low Impact' | 'Negative / Inhibiting' | 'Neutral';
  scientificConfidence: 'High (Documented)' | 'Moderate (Empirical)' | 'Context-Dependent (Requires Validation)';
}

export interface DiseaseRiskProfile {
  id: string;
  code: string;
  name: string;
  aliases: string[];
  category: 'FAST / Transboundary' | 'Zoonotic / One Health' | 'Endemic / Production';
  transmissionMechanisms: string[];
  primaryHosts: string[];
  relevantVectors?: string[];
  
  // Investigation & Buffer parameters (in meters)
  innerHighRiskRadiusMeters: number; // e.g. 3,000m protection / high-transmission core
  innerZoneLabel: string;
  outerSurveillanceRadiusMeters: number; // e.g. 10,000m surveillance / monitoring ring
  outerZoneLabel: string;
  extendedPlanningRadiusMeters?: number; // e.g. 25,000m regional buffer (user-configurable)
  extendedZoneLabel?: string;
  
  // Scientific basis & environmental rules
  environmentalModifiers: EnvironmentalModifierRule[];
  windRelevance: 'Critical' | 'Moderate' | 'Low' | 'Negligible';
  livestockMovementRelevance: 'Critical' | 'High' | 'Moderate' | 'Low' | 'Negligible';
  seasonalityRelevance: string;
  
  evidenceLevel: 'WOAH / FAO Standard Guideline' | 'Empirical Field Evidence' | 'Expert Consensus' | 'Provisional Configuration';
  lastReviewedDate: string;
  limitations: string;
  references: ScientificReference[];
}

export interface LiveWeatherData {
  latitude: number;
  longitude: number;
  locationName?: string;
  timestamp: string;
  temperature: number; // Celsius
  apparentTemperature?: number;
  relativeHumidity: number; // percentage
  precipitation: number; // mm
  precipitationProbability?: number; // %
  windSpeed: number; // km/h
  windDirection: number; // degrees 0-360
  windGusts?: number; // km/h
  surfacePressure?: number; // hPa
  weatherCode: number;
  weatherCondition: string;
  isDay: boolean;
  hourlyForecast?: {
    time: string[];
    temperature: number[];
    precipitationProbability: number[];
    windSpeed: number[];
    windDirection: number[];
  };
  dailyForecast?: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
    precipitationSum: number[];
    windSpeedMax: number[];
  };
  source: string;
  isStaleOrOffline?: boolean;
}

export interface CalculatedRiskAssessment {
  outbreakId: string;
  diseaseName: string;
  woredaName: string;
  zone: string;
  baselineCases: number;
  cfr: number;
  innerRadiusKm: number;
  outerRadiusKm: number;
  
  // Modifier contributions
  environmentalScore: number; // 0 to 100
  environmentalVariablesUsed: {
    variable: string;
    observedValue: string;
    mechanism: string;
    weight: string;
  }[];
  
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  modelVer: string;
  timestamp: string;
  disclaimer: string;
}

export interface MapLayerVisibilityState {
  // Administrative
  ethiopiaBoundary: boolean;
  oromiaBoundary: boolean;
  eastHarargheWoredas: boolean;
  westHarargheWoredas: boolean;
  zonalFractureLine: boolean;
  
  // Surveillance
  outbreaksConfirmed: boolean;
  outbreaksSuspected: boolean;
  fieldInvestigations: boolean;
  zeroReports: boolean;
  hrvlHub: boolean;
  
  // Risk & Buffers
  diseaseRiskZones: boolean;
  investigationCore: boolean;
  surveillancePerimeter: boolean;
  densityHeatmap: boolean;
  mortalityHeatmap: boolean;
  
  // Weather
  weatherOverlay: boolean;
  windVectors: boolean;
  temperatureContours: boolean;
  precipitationGrid: boolean;
}
