import { FeatureCollection } from 'geojson';
import ethiopiaBoundaryData from './ethiopia_boundary.json';
import oromiaBoundaryData from './oromia_boundary.json';
import harargheWoredasFractureData from './hararghe_woredas_fracture.json';

// ==========================================
// 1. ETHIOPIA NATIONAL BOUNDARY GEOJSON (Official Shapefile Dataset)
// ==========================================
export const ETHIOPIA_NATIONAL_GEOJSON: FeatureCollection = ethiopiaBoundaryData as unknown as FeatureCollection;

// ==========================================
// 2. OROMIA REGIONAL STATE GEOJSON (Official Shapefile Dataset)
// ==========================================
export const OROMIA_REGION_GEOJSON: FeatureCollection = oromiaBoundaryData as unknown as FeatureCollection;

// ==========================================
// 3. HARARGHE WOREDA BOUNDARIES GEOJSON (Official Shapefile Dataset)
// ==========================================
export const HARARGHE_WOREDAS_GEOJSON: FeatureCollection = harargheWoredasFractureData as unknown as FeatureCollection;

