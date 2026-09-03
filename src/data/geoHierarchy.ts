import { GeoLocationExtent } from '../types/riskMap';
import { HARARGHE_WOREDAS, HIRNA_LAB_COORDS } from './woredas';

export const NATIONAL_EXTENT: GeoLocationExtent = {
  id: 'ethiopia',
  name: 'Ethiopia (National)',
  level: 'ethiopia',
  center: [9.145, 40.4896],
  zoom: 6,
  bounds: [
    [3.4, 33.0],
    [14.9, 47.9]
  ]
};

export const OROMIA_EXTENT: GeoLocationExtent = {
  id: 'oromia',
  name: 'Oromia Regional State',
  level: 'oromia',
  parent: 'ethiopia',
  center: [8.55, 39.27],
  zoom: 7,
  bounds: [
    [4.0, 34.1],
    [10.8, 43.0]
  ]
};

export const EAST_HARARGHE_EXTENT: GeoLocationExtent = {
  id: 'east_hararghe',
  name: 'East Hararghe Zone (21 Woredas)',
  level: 'east_hararghe',
  parent: 'oromia',
  center: [9.15, 41.95],
  zoom: 9,
  bounds: [
    [8.15, 41.2],
    [9.75, 42.75]
  ]
};

export const WEST_HARARGHE_EXTENT: GeoLocationExtent = {
  id: 'west_hararghe',
  name: 'West Hararghe Zone (15 Woredas)',
  level: 'west_hararghe',
  parent: 'oromia',
  center: [8.95, 40.65],
  zoom: 9,
  bounds: [
    [8.25, 39.85],
    [9.45, 41.35]
  ]
};

export const HARARGHE_REGIONAL_EXTENT: GeoLocationExtent = {
  id: 'hararghe_all',
  name: 'Hararghe Operational Area (E/H & W/H — 36 Woredas)',
  level: 'oromia',
  parent: 'oromia',
  center: [9.15, 41.35],
  zoom: 8,
  bounds: [
    [8.2, 39.9],
    [9.75, 42.75]
  ]
};

export const HRVL_HUB_EXTENT: GeoLocationExtent = {
  id: 'hrvl_hub',
  name: 'Hirna Regional Veterinary Laboratory (HRVL Hub)',
  level: 'outbreak',
  parent: 'west_hararghe',
  center: [HIRNA_LAB_COORDS.lat, HIRNA_LAB_COORDS.lng],
  zoom: 14,
};

// Generate Woreda Extents from HARARGHE_WOREDAS list
export const WOREDA_EXTENTS: GeoLocationExtent[] = HARARGHE_WOREDAS.map(w => ({
  id: `woreda_${w.id}`,
  name: `${w.name} (${w.zone})`,
  level: 'woreda',
  parent: w.zone === 'E/H' ? 'east_hararghe' : 'west_hararghe',
  center: [w.lat, w.lng],
  zoom: 11,
  bounds: [
    [w.lat - 0.15, w.lng - 0.15],
    [w.lat + 0.15, w.lng + 0.15]
  ]
}));

export const ALL_GEO_EXTENTS: GeoLocationExtent[] = [
  NATIONAL_EXTENT,
  OROMIA_EXTENT,
  HARARGHE_REGIONAL_EXTENT,
  EAST_HARARGHE_EXTENT,
  WEST_HARARGHE_EXTENT,
  HRVL_HUB_EXTENT,
  ...WOREDA_EXTENTS
];

export function getExtentById(id: string): GeoLocationExtent | undefined {
  return ALL_GEO_EXTENTS.find(ext => ext.id === id);
}
