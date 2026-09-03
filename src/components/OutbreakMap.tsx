import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { toPng } from 'html-to-image';
import { 
  Compass, 
  Layers, 
  ShieldAlert, 
  MapPin, 
  Info,
  Check,
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Globe, 
  Mountain, 
  Moon, 
  Sun, 
  Search, 
  Crosshair, 
  Activity, 
  AlertTriangle, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  CloudSun,
  Maximize2,
  Minimize2,
  BookOpen,
  Eye,
  EyeOff,
  Radio,
  FileSpreadsheet,
  Wind,
  Droplets,
  Thermometer,
  ShieldCheck,
  X
} from 'lucide-react';
import { Outbreak, SurveillanceRecord, WoredaInfo } from '../types';
import { GeoLocationExtent, LiveWeatherData, MapLayerVisibilityState } from '../types/riskMap';
import { HARARGHE_WOREDAS, HIRNA_LAB_COORDS } from '../data/woredas';
import { 
  ETHIOPIA_NATIONAL_GEOJSON, 
  OROMIA_REGION_GEOJSON, 
  HARARGHE_WOREDAS_GEOJSON 
} from '../data/geoData';
import { ALL_GEO_EXTENTS, HARARGHE_REGIONAL_EXTENT, getExtentById } from '../data/geoHierarchy';
import { DISEASE_RISK_PROFILES, getDiseaseRiskProfile } from '../data/diseaseRiskProfiles';
import { fetchLiveWeather } from '../utils/weatherService';
import { loadFieldInvestigations } from '../utils/fieldToolkitStorage';
import { FieldInvestigation } from '../types/fieldToolkit';
import { GeoHierarchyNav } from './gis/GeoHierarchyNav';
import { LayerControlPanel } from './gis/LayerControlPanel';
import { WeatherOverlayPanel } from './gis/WeatherOverlayPanel';
import { RiskZoneDetailModal } from './gis/RiskZoneDetailModal';
import { ScientificReferencesModal } from './gis/ScientificReferencesModal';

interface OutbreakMapProps {
  outbreaks: Outbreak[];
  records: SurveillanceRecord[];
  darkMode: boolean;
  selectedZone: string;
}

type BasemapType = 'satellite' | 'hybrid' | 'topo' | 'voyager' | 'dark';

export const KNOWN_DISEASES = [
  { id: 'fmd', name: 'Foot-and-Mouth (FMD)', keyword: 'foot-and-mouth', color: '#ef4444', icon: '🧬' },
  { id: 'ppr', name: 'Peste des Petits (PPR)', keyword: 'peste des petits', color: '#f97316', icon: '🐐' },
  { id: 'lsd', name: 'Lumpy Skin (LSD)', keyword: 'lumpy skin', color: '#eab308', icon: '🐄' },
  { id: 'cbpp', name: 'CBPP (Bovine Pleuro)', keyword: 'contagious bovine', color: '#3b82f6', icon: '🫁' },
  { id: 'anthrax', name: 'Anthrax (Lethal)', keyword: 'anthrax', color: '#a855f7', icon: '⚠️' },
  { id: 'newcastle', name: 'Newcastle Disease', keyword: 'newcastle', color: '#ec4899', icon: '🐔' },
];

const checkZoneIsEast = (props: any): boolean => {
  if (!props) return true;
  const rawZone = props.zone || '';
  if (rawZone === 'E/H' || rawZone === 'East Hararghe') return true;
  if (rawZone === 'W/H' || rawZone === 'West Hararghe') return false;
  if (props.id && typeof props.id === 'string' && props.id.toLowerCase().startsWith('eh')) return true;
  if (props.id && typeof props.id === 'string' && props.id.toLowerCase().startsWith('wh')) return false;
  const woredaName = props.name || props.WOREDABAME || '';
  const matched = HARARGHE_WOREDAS.find(w => w.name.toLowerCase() === woredaName.toLowerCase());
  return matched ? matched.zone === 'E/H' : true;
};

export const OutbreakMap: React.FC<OutbreakMapProps> = ({
  outbreaks,
  records,
  darkMode,
  selectedZone
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const adminLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const riskLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const surveillanceLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const weatherLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layout & Fullscreen
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);

  // Navigation & Extent
  const [currentExtentId, setCurrentExtentId] = useState<string>('hararghe_all');
  const [currentZoom, setCurrentZoom] = useState<number>(8);
  const [centerCoords, setCenterCoords] = useState<[number, number]>([9.15, 41.35]);

  // Basemap
  const [basemap, setBasemap] = useState<BasemapType>(darkMode ? 'dark' : 'hybrid');

  // Layer Visibility State
  const [layerVisibility, setLayerVisibility] = useState<MapLayerVisibilityState>({
    ethiopiaBoundary: true,
    oromiaBoundary: true,
    eastHarargheWoredas: true,
    westHarargheWoredas: true,
    zonalFractureLine: true,
    outbreaksConfirmed: true,
    outbreaksSuspected: true,
    fieldInvestigations: true,
    zeroReports: true,
    hrvlHub: true,
    diseaseRiskZones: true,
    investigationCore: true,
    surveillancePerimeter: true,
    densityHeatmap: false,
    mortalityHeatmap: false,
    weatherOverlay: true,
    windVectors: true,
    temperatureContours: false,
    precipitationGrid: false,
  });

  // Floating Panels Visibility
  const [isLayerControlOpen, setIsLayerControlOpen] = useState<boolean>(false);
  const [isWeatherPanelOpen, setIsWeatherPanelOpen] = useState<boolean>(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // Modals
  const [isScientificReferencesOpen, setIsScientificReferencesOpen] = useState<boolean>(false);
  const [selectedDiseaseForReferences, setSelectedDiseaseForReferences] = useState<string>('fmd');
  const [inspectedRiskOutbreak, setInspectedRiskOutbreak] = useState<Outbreak | null>(null);

  // Selected Inspect Item
  const [selectedOutbreak, setSelectedOutbreak] = useState<Outbreak | null>(outbreaks[0] || null);
  const [selectedWoreda, setSelectedWoreda] = useState<WoredaInfo | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState<string>('All');
  const [enabledDiseases, setEnabledDiseases] = useState<string[]>([]);

  // Weather Telemetry State
  const [liveWeather, setLiveWeather] = useState<LiveWeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);

  // Field Investigations
  const [fieldInvestigations, setFieldInvestigations] = useState<FieldInvestigation[]>([]);

  useEffect(() => {
    try {
      setFieldInvestigations(loadFieldInvestigations());
    } catch {
      // fallback
    }
  }, []);

  // Fetch Weather for current focus
  const loadWeatherForCurrentFocus = async (lat: number = 9.2178, lng: number = 41.1012, name: string = 'Hirna Lab Hub') => {
    setIsWeatherLoading(true);
    try {
      const data = await fetchLiveWeather(lat, lng, name);
      setLiveWeather(data);
    } catch (e) {
      console.warn('Weather fetch error:', e);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherForCurrentFocus(HIRNA_LAB_COORDS.lat, HIRNA_LAB_COORDS.lng, 'HRVL Diagnostic Hub');
  }, []);

  // Sync dark mode preference with default basemap if user hasn't overridden
  useEffect(() => {
    if (darkMode && (basemap === 'voyager' || basemap === 'topo')) {
      setBasemap('dark');
    } else if (!darkMode && basemap === 'dark') {
      setBasemap('hybrid');
    }
  }, [darkMode]);

  // Filtered outbreaks
  const filteredOutbreaks = useMemo(() => {
    return outbreaks.filter(ob => {
      if (selectedZone !== 'All' && ob.zone !== selectedZone) return false;
      if (selectedDiseaseFilter !== 'All' && !ob.disease.toLowerCase().includes(selectedDiseaseFilter.toLowerCase())) return false;
      if (enabledDiseases.length > 0) {
        const isEnabled = enabledDiseases.some(kw => ob.disease.toLowerCase().includes(kw.toLowerCase()));
        if (!isEnabled) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ob.disease.toLowerCase().includes(q) ||
          ob.woreda.toLowerCase().includes(q) ||
          ob.outbreakCode.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [outbreaks, selectedZone, selectedDiseaseFilter, enabledDiseases, searchQuery]);

  // Woreda Aggregations
  const woredaCaseMap = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach(r => {
      const wName = r.woreda.trim().toLowerCase();
      map[wName] = (map[wName] || 0) + (r.cases || 0);
    });
    outbreaks.forEach(o => {
      const wName = o.woreda.trim().toLowerCase();
      map[wName] = (map[wName] || 0) + (o.cases || 0);
    });
    return map;
  }, [records, outbreaks]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [9.15, 41.35],
        zoom: 8,
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true,
      });

      mapInstanceRef.current = map;

      // Create Layer Groups
      tileLayerGroupRef.current = L.layerGroup().addTo(map);
      adminLayerGroupRef.current = L.layerGroup().addTo(map);
      riskLayerGroupRef.current = L.layerGroup().addTo(map);
      surveillanceLayerGroupRef.current = L.layerGroup().addTo(map);
      weatherLayerGroupRef.current = L.layerGroup().addTo(map);

      // Listen to map move/zoom
      map.on('moveend zoomend', () => {
        const center = map.getCenter();
        setCenterCoords([center.lat, center.lng]);
        setCurrentZoom(map.getZoom());
      });
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap Tiles
  useEffect(() => {
    const map = mapInstanceRef.current;
    const tileGroup = tileLayerGroupRef.current;
    if (!map || !tileGroup) return;

    tileGroup.clearLayers();

    let url = '';
    let maxZoom = 19;
    let subdomains: string | string[] = 'abc';

    switch (basemap) {
      case 'satellite':
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        maxZoom = 19;
        break;
      case 'hybrid':
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        maxZoom = 19;
        break;
      case 'topo':
        url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        maxZoom = 17;
        break;
      case 'dark':
        url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        subdomains = 'abcd';
        maxZoom = 19;
        break;
      case 'voyager':
      default:
        url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        subdomains = 'abcd';
        maxZoom = 19;
        break;
    }

    const baseTile = L.tileLayer(url, { maxZoom, subdomains });
    tileGroup.addLayer(baseTile);

    // If hybrid, add Carto borders/labels overlay
    if (basemap === 'hybrid') {
      const labels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      });
      tileGroup.addLayer(labels);
    }
  }, [basemap]);

  // Render Administrative Boundaries Layer Group
  useEffect(() => {
    const adminGroup = adminLayerGroupRef.current;
    if (!adminGroup) return;

    adminGroup.clearLayers();

    // 1. Ethiopia National Boundary
    if (layerVisibility.ethiopiaBoundary && ETHIOPIA_NATIONAL_GEOJSON) {
      const ethiopiaLayer = L.geoJSON(ETHIOPIA_NATIONAL_GEOJSON as any, {
        style: {
          color: '#10b981',
          weight: 2.2,
          opacity: 0.8,
          fillColor: '#10b981',
          fillOpacity: 0.02,
          dashArray: '4, 4',
        },
        onEachFeature: (feature, layer) => {
          layer.bindTooltip('<b>🇪🇹 Ethiopia National Border</b>', { sticky: true });
        }
      });
      adminGroup.addLayer(ethiopiaLayer);
    }

    // 2. Oromia Regional Boundary
    if (layerVisibility.oromiaBoundary && OROMIA_REGION_GEOJSON) {
      const oromiaLayer = L.geoJSON(OROMIA_REGION_GEOJSON as any, {
        style: {
          color: '#f59e0b',
          weight: 2.5,
          opacity: 0.85,
          fillColor: '#f59e0b',
          fillOpacity: 0.03,
          dashArray: '6, 3',
        },
        onEachFeature: (feature, layer) => {
          layer.bindTooltip('<b>Oromia Regional State</b>', { sticky: true });
        }
      });
      adminGroup.addLayer(oromiaLayer);
    }

    // 3. Hararghe Woredas (East & West)
    if (HARARGHE_WOREDAS_GEOJSON) {
      const woredasLayer = L.geoJSON(HARARGHE_WOREDAS_GEOJSON as any, {
        filter: (feature) => {
          const isEast = checkZoneIsEast(feature?.properties);
          if (isEast && !layerVisibility.eastHarargheWoredas) return false;
          if (!isEast && !layerVisibility.westHarargheWoredas) return false;
          return true;
        },
        style: (feature) => {
          const isEast = checkZoneIsEast(feature?.properties);
          const wName = feature?.properties?.name || feature?.properties?.WOREDABAME || '';
          const cases = woredaCaseMap[wName.toLowerCase()] || 0;

          let strokeColor = isEast ? '#38bdf8' : '#e879f9';
          let fillColor = isEast ? '#0284c7' : '#c026d3';
          let fillOpacity = 0.12;

          if (layerVisibility.densityHeatmap && cases > 0) {
            if (cases >= 50) {
              fillColor = '#ef4444';
              fillOpacity = 0.45;
            } else if (cases >= 20) {
              fillColor = '#f97316';
              fillOpacity = 0.35;
            } else {
              fillColor = '#eab308';
              fillOpacity = 0.25;
            }
          }

          return {
            color: strokeColor,
            weight: 2.0,
            opacity: 0.9,
            fillColor,
            fillOpacity,
          };
        },
        onEachFeature: (feature, layer) => {
          const wName = feature?.properties?.name || feature?.properties?.WOREDABAME || 'Woreda';
          const isEast = checkZoneIsEast(feature?.properties);
          const zone = isEast ? 'E/H' : 'W/H';
          const cases = woredaCaseMap[wName.toLowerCase()] || 0;

          layer.bindTooltip(`
            <div style="font-family: sans-serif; padding: 4px 6px;">
              <b style="font-size: 11px; color: #0f172a;">📍 ${wName} (${zone})</b>
              <div style="font-size: 10px; color: #475569; margin-top: 2px;">
                Recorded Cases: <b style="color: #0369a1;">${cases}</b>
              </div>
            </div>
          `, { sticky: true });

          layer.on({
            click: () => {
              const matched = HARARGHE_WOREDAS.find(w => w.name.toLowerCase() === wName.toLowerCase());
              if (matched) {
                setSelectedWoreda(matched);
                setSelectedOutbreak(null);
                loadWeatherForCurrentFocus(matched.lat, matched.lng, `${matched.name} Woreda`);
              }
            }
          });
        }
      });
      adminGroup.addLayer(woredasLayer);
    }
  }, [
    layerVisibility.ethiopiaBoundary,
    layerVisibility.oromiaBoundary,
    layerVisibility.eastHarargheWoredas,
    layerVisibility.westHarargheWoredas,
    layerVisibility.densityHeatmap,
    woredaCaseMap
  ]);

  // Render Disease Risk Zones & Buffer Rings (Evidence-Based Engine)
  useEffect(() => {
    const riskGroup = riskLayerGroupRef.current;
    if (!riskGroup) return;

    riskGroup.clearLayers();

    if (!layerVisibility.diseaseRiskZones) return;

    filteredOutbreaks.forEach(ob => {
      if (ob.status !== 'Active' && ob.status !== 'Under Investigation') return;

      const profile = getDiseaseRiskProfile(ob.disease);
      const innerMeters = profile.innerHighRiskRadiusMeters;
      const outerMeters = profile.outerSurveillanceRadiusMeters;

      // 1. Inner High-Risk / Protection Zone (Core ring)
      if (layerVisibility.investigationCore) {
        const innerCircle = L.circle([ob.lat, ob.lng], {
          radius: innerMeters,
          color: '#ef4444',
          weight: 2,
          fillColor: '#ef4444',
          fillOpacity: 0.22,
          dashArray: '2, 4',
        });

        innerCircle.bindTooltip(`
          <div style="font-family: sans-serif; padding: 4px 6px; min-width: 170px;">
            <b style="color: #b91c1c; font-size: 11px;">⚠️ ${profile.name} Core Zone</b>
            <div style="font-size: 10px; color: #334155; margin-top: 2px;">
              <b>Inner Radius:</b> ${(innerMeters / 1000).toFixed(1)} km<br/>
              <b>Rationale:</b> ${profile.innerZoneLabel}
            </div>
          </div>
        `, { sticky: true });

        innerCircle.on('click', () => {
          setInspectedRiskOutbreak(ob);
        });

        riskGroup.addLayer(innerCircle);
      }

      // 2. Outer Surveillance Perimeter (Buffer monitoring ring)
      if (layerVisibility.surveillancePerimeter) {
        const outerCircle = L.circle([ob.lat, ob.lng], {
          radius: outerMeters,
          color: '#f59e0b',
          weight: 1.5,
          fillColor: '#f59e0b',
          fillOpacity: 0.08,
          dashArray: '5, 5',
        });

        outerCircle.bindTooltip(`
          <div style="font-family: sans-serif; padding: 4px 6px; min-width: 170px;">
            <b style="color: #d97706; font-size: 11px;">🛡️ ${profile.name} Surveillance Ring</b>
            <div style="font-size: 10px; color: #334155; margin-top: 2px;">
              <b>Outer Radius:</b> ${(outerMeters / 1000).toFixed(1)} km<br/>
              <b>Standard:</b> ${profile.evidenceLevel}
            </div>
          </div>
        `, { sticky: true });

        outerCircle.on('click', () => {
          setInspectedRiskOutbreak(ob);
        });

        riskGroup.addLayer(outerCircle);
      }
    });
  }, [
    filteredOutbreaks,
    layerVisibility.diseaseRiskZones,
    layerVisibility.investigationCore,
    layerVisibility.surveillancePerimeter
  ]);

  // Render Surveillance Markers (Outbreaks, Field Investigations, Zero Reports, HRVL Hub)
  useEffect(() => {
    const survGroup = surveillanceLayerGroupRef.current;
    if (!survGroup) return;

    survGroup.clearLayers();

    // 1. HRVL Diagnostic Hub Marker
    if (layerVisibility.hrvlHub) {
      const hubIcon = L.divIcon({
        className: 'custom-hub-icon',
        html: `
          <div style="
            width: 38px; height: 38px;
            background: linear-gradient(135deg, #4f46e5, #4338ca);
            border: 2.5px solid #ffffff;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            animation: pulse-ring 2.5s infinite;
          ">
            <span style="font-size: 16px;">🏥</span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const hubMarker = L.marker([HIRNA_LAB_COORDS.lat, HIRNA_LAB_COORDS.lng], { icon: hubIcon });
      hubMarker.bindTooltip(`
        <div style="font-family: sans-serif; padding: 4px 6px;">
          <b style="color: #4338ca; font-size: 11px;">🏥 Hirna Regional Veterinary Laboratory (HRVL)</b>
          <div style="font-size: 10px; color: #475569; margin-top: 2px;">
            Central Surveillance & Diagnostic Hub • W/H
          </div>
        </div>
      `, { sticky: true });

      hubMarker.on('click', () => {
        setSelectedOutbreak(null);
        setSelectedWoreda(null);
        loadWeatherForCurrentFocus(HIRNA_LAB_COORDS.lat, HIRNA_LAB_COORDS.lng, 'HRVL Hub (Hirna)');
      });

      survGroup.addLayer(hubMarker);
    }

    // 2. Outbreak Markers (Confirmed & Suspected)
    if (layerVisibility.outbreaksConfirmed || layerVisibility.outbreaksSuspected) {
      filteredOutbreaks.forEach(ob => {
        const isConfirmed = ob.status === 'Active' || ob.status === 'Resolved';
        if (isConfirmed && !layerVisibility.outbreaksConfirmed) return;
        if (!isConfirmed && !layerVisibility.outbreaksSuspected) return;

        const profile = getDiseaseRiskProfile(ob.disease);
        const color = isConfirmed ? '#ef4444' : '#f59e0b';

        const markerIcon = L.divIcon({
          className: 'custom-outbreak-pin',
          html: `
            <div style="
              width: 30px; height: 30px;
              background-color: ${color};
              border: 2px solid #ffffff;
              border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 3px 8px rgba(0,0,0,0.35);
              cursor: pointer;
            ">
              <span style="font-size: 12px; color: white; font-weight: bold;">
                ${ob.cases > 20 ? '🔥' : '⚠️'}
              </span>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([ob.lat, ob.lng], { icon: markerIcon });
        marker.bindTooltip(`
          <div style="font-family: sans-serif; padding: 4px 6px; min-width: 140px;">
            <b style="color: ${color}; font-size: 11px;">${ob.disease}</b>
            <div style="font-size: 10px; color: #334155; margin-top: 2px;">
              <b>Location:</b> ${ob.woreda} (${ob.zone})<br/>
              <b>Cases:</b> ${ob.cases} | <b>Deaths:</b> ${ob.deaths}<br/>
              <b>Status:</b> ${ob.status}
            </div>
          </div>
        `, { sticky: true });

        marker.on('click', () => {
          setSelectedOutbreak(ob);
          setSelectedWoreda(null);
          loadWeatherForCurrentFocus(ob.lat, ob.lng, `${ob.woreda} Outbreak Zone`);
        });

        survGroup.addLayer(marker);
      });
    }

    // 3. Field Investigations
    if (layerVisibility.fieldInvestigations && fieldInvestigations.length > 0) {
      fieldInvestigations.forEach(inv => {
        const invIcon = L.divIcon({
          className: 'custom-field-investigation-pin',
          html: `
            <div style="
              width: 26px; height: 26px;
              background-color: #10b981;
              border: 2px solid #ffffff;
              border-radius: 6px;
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">
              <span style="font-size: 12px;">🔬</span>
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const invMarker = L.marker([inv.lat || 9.2, inv.lng || 41.1], { icon: invIcon });
        invMarker.bindTooltip(`
          <div style="font-family: sans-serif; padding: 4px 6px;">
            <b style="color: #059669; font-size: 11px;">🔬 Field Mission: ${inv.investigationCode || inv.id}</b>
            <div style="font-size: 10px; color: #475569; margin-top: 2px;">
              <b>Woreda:</b> ${inv.woreda} (${inv.zone})<br/>
              <b>Diagnosis:</b> ${inv.disease || inv.title}
            </div>
          </div>
        `, { sticky: true });

        survGroup.addLayer(invMarker);
      });
    }

    // 4. Zero Reports Baseline Points
    if (layerVisibility.zeroReports) {
      const zeroRecords = records.filter(r => r.isZeroReport);
      zeroRecords.slice(0, 40).forEach(zr => {
        const dot = L.circleMarker([zr.lat, zr.lng], {
          radius: 4,
          color: '#0284c7',
          weight: 1.5,
          fillColor: '#38bdf8',
          fillOpacity: 0.6,
        });

        dot.bindTooltip(`
          <div style="font-family: sans-serif; padding: 3px 5px;">
            <b style="color: #0369a1; font-size: 10px;">✅ Zero-Report Return</b>
            <div style="font-size: 9px; color: #475569;">${zr.woreda} (${zr.zone})</div>
          </div>
        `, { sticky: true });

        survGroup.addLayer(dot);
      });
    }
  }, [
    filteredOutbreaks,
    fieldInvestigations,
    records,
    layerVisibility.hrvlHub,
    layerVisibility.outbreaksConfirmed,
    layerVisibility.outbreaksSuspected,
    layerVisibility.fieldInvestigations,
    layerVisibility.zeroReports
  ]);

  // Render Weather Wind Vectors Layer
  useEffect(() => {
    const weatherGroup = weatherLayerGroupRef.current;
    if (!weatherGroup) return;

    weatherGroup.clearLayers();

    if (!layerVisibility.windVectors || !liveWeather) return;

    // Draw downwind plume vector arrows from active outbreak clusters
    filteredOutbreaks.slice(0, 10).forEach(ob => {
      const windAngleRad = (liveWeather.windDirection * Math.PI) / 180;
      const lengthKm = Math.min(Math.max(liveWeather.windSpeed * 0.4, 4), 14); // Length scales with wind speed
      
      // Calculate destination coordinates
      const latOffset = (lengthKm / 111) * Math.cos(windAngleRad);
      const lngOffset = (lengthKm / (111 * Math.cos((ob.lat * Math.PI) / 180))) * Math.sin(windAngleRad);
      
      const destLat = ob.lat + latOffset;
      const destLng = ob.lng + lngOffset;

      const polyline = L.polyline([[ob.lat, ob.lng], [destLat, destLng]], {
        color: '#38bdf8',
        weight: 2.5,
        opacity: 0.8,
        dashArray: '3, 4',
      });

      polyline.bindTooltip(`
        <div style="font-family: sans-serif; padding: 4px 6px;">
          <b style="color: #0284c7; font-size: 10px;">💨 Downwind Transport Vector</b>
          <div style="font-size: 9px; color: #475569;">
            Heading: ${liveWeather.windDirection}° • Speed: ${liveWeather.windSpeed} km/h
          </div>
        </div>
      `, { sticky: true });

      weatherGroup.addLayer(polyline);
    });
  }, [filteredOutbreaks, liveWeather, layerVisibility.windVectors]);

  // Handle Geographic Extent Navigation Jump
  const handleSelectExtent = (extent: GeoLocationExtent) => {
    setCurrentExtentId(extent.id);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (extent.bounds) {
      map.fitBounds(extent.bounds, { padding: [30, 30], maxZoom: extent.zoom });
    } else {
      map.flyTo(extent.center, extent.zoom, { duration: 1.2 });
    }

    loadWeatherForCurrentFocus(extent.center[0], extent.center[1], extent.name);
  };

  const handleResetHome = () => {
    handleSelectExtent(HARARGHE_REGIONAL_EXTENT);
  };

  // Toggle Layer Helper
  const handleToggleLayer = (layerKey: keyof MapLayerVisibilityState) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  // Export Map Image Snapshot
  const handleExportMapImage = async () => {
    if (!mapWrapperRef.current) return;
    setIsExportingImage(true);
    try {
      const dataUrl = await toPng(mapWrapperRef.current, {
        quality: 0.95,
        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `HRVL_Epi_GIS_Map_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Map image export failed:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Geographic Hierarchy Breadcrumb / Selector Bar */}
      <GeoHierarchyNav
        currentExtentId={currentExtentId}
        onSelectExtent={handleSelectExtent}
        onResetHome={handleResetHome}
        currentZoom={currentZoom}
        centerCoords={centerCoords}
        isFullScreen={isFullScreen}
      />

      {/* Main Map Container Wrapper */}
      <div
        ref={mapWrapperRef}
        className={`relative overflow-hidden rounded-2xl border border-slate-700/80 shadow-2xl transition-all duration-300 ${
          isFullScreen 
            ? 'fixed inset-0 z-50 rounded-none border-0 h-screen w-screen bg-slate-950' 
            : 'h-[680px] sm:h-[740px] w-full bg-slate-900'
        }`}
      >
        {/* Leaflet Mount Target */}
        <div ref={mapContainerRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />

        {/* Top Floating Control Bar */}
        <div className="absolute top-3 left-3 z-30 flex items-center space-x-2">
          {/* Layer Control Toggle Button */}
          <button
            onClick={() => setIsLayerControlOpen(prev => !prev)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer backdrop-blur-md border ${
              isLayerControlOpen
                ? 'bg-indigo-600 text-white border-indigo-400'
                : 'bg-slate-900/90 text-slate-200 hover:bg-slate-800 border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Layers</span>
          </button>

          {/* Weather Panel Toggle Button */}
          <button
            onClick={() => setIsWeatherPanelOpen(prev => !prev)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer backdrop-blur-md border ${
              isWeatherPanelOpen
                ? 'bg-sky-600 text-white border-sky-400'
                : 'bg-slate-900/90 text-slate-200 hover:bg-slate-800 border-slate-700'
            }`}
          >
            <CloudSun className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Weather Context</span>
            {liveWeather && (
              <span className="text-[11px] font-mono text-sky-300 ml-1">
                {Math.round(liveWeather.temperature)}°C
              </span>
            )}
          </button>

          {/* Search Woreda or Disease Bar */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search woreda or outbreak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 w-48 shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Top-Right Floating Controls (Basemap, Zoom, Fullscreen, Export) */}
        <div className="absolute top-3 right-3 z-30 flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-1 rounded-xl shadow-xl">
          
          {/* Basemap Select */}
          <select
            value={basemap}
            onChange={(e) => setBasemap(e.target.value as BasemapType)}
            className="bg-transparent text-slate-200 text-xs font-semibold px-2 py-1 focus:outline-hidden cursor-pointer"
          >
            <option value="hybrid" className="bg-slate-900">Hybrid Imagery</option>
            <option value="satellite" className="bg-slate-900">Satellite</option>
            <option value="dark" className="bg-slate-900">Dark Matter</option>
            <option value="voyager" className="bg-slate-900">Carto Light</option>
            <option value="topo" className="bg-slate-900">Topographic</option>
          </select>

          <div className="h-4 w-px bg-slate-700" />

          {/* Zoom In */}
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Home Extent */}
          <button
            onClick={handleResetHome}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Reset to Hararghe Operational View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Full-Screen Toggle */}
          <button
            onClick={() => setIsFullScreen(prev => !prev)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Map"}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Snapshot PNG Export */}
          <button
            onClick={handleExportMapImage}
            disabled={isExportingImage}
            className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Download Map Snapshot (PNG)"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Layer Control Panel (Collapsible) */}
        {isLayerControlOpen && (
          <div className="absolute top-14 left-3 z-30 animate-fade-in">
            <LayerControlPanel
              layers={layerVisibility}
              onToggleLayer={handleToggleLayer}
              onOpenScientificReferences={() => {
                setSelectedDiseaseForReferences('fmd');
                setIsScientificReferencesOpen(true);
              }}
              isOpen={isLayerControlOpen}
              onToggleOpen={() => setIsLayerControlOpen(false)}
            />
          </div>
        )}

        {/* Floating Weather Overlay Panel (Collapsible) */}
        {isWeatherPanelOpen && (
          <div className="absolute top-14 left-3 sm:left-auto sm:right-3 z-30 animate-fade-in">
            <WeatherOverlayPanel
              weather={liveWeather}
              isLoading={isWeatherLoading}
              onRefresh={() => {
                if (centerCoords) loadWeatherForCurrentFocus(centerCoords[0], centerCoords[1], 'Current Viewport');
              }}
              isOpen={isWeatherPanelOpen}
              onToggleOpen={() => setIsWeatherPanelOpen(false)}
            />
          </div>
        )}

        {/* Bottom-Left Interactive Disease Legend */}
        <div className="absolute bottom-4 left-3 z-20 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-2xl text-xs text-slate-200 max-w-[260px] sm:max-w-xs transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <div className="flex items-center space-x-1.5 font-extrabold text-white">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Surveillance Legend</span>
            </div>
            <button
              onClick={() => setIsLegendExpanded(prev => !prev)}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
            >
              {isLegendExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isLegendExpanded && (
            <div className="space-y-2">
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
                  <span>Confirmed Outbreak</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 border border-white"></div>
                  <span>Suspected / Field Signal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-md bg-emerald-500 border border-white"></div>
                  <span>Field Investigation Mission</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 border border-white"></div>
                  <span>HRVL Diagnostic Hub</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                <button
                  onClick={() => setIsScientificReferencesOpen(true)}
                  className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                >
                  WOAH/FAO Citations ↗
                </button>
                <span className="text-slate-400 font-mono">36 Woredas</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom-Right Selected Item Inspector Panel */}
        {(selectedOutbreak || selectedWoreda) && isInspectorOpen && (
          <div className="absolute bottom-4 right-3 z-20 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-xs text-slate-200 w-80 sm:w-88 transition-all animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center space-x-1.5 font-extrabold text-white">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>GIS Inspector</span>
              </div>
              <button
                onClick={() => {
                  setSelectedOutbreak(null);
                  setSelectedWoreda(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedOutbreak && (
              <div className="space-y-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {selectedOutbreak.disease}
                  </span>
                  <h4 className="text-sm font-black text-white mt-1">
                    {selectedOutbreak.woreda} ({selectedOutbreak.zone})
                  </h4>
                  <p className="text-[11px] text-slate-400">Outbreak Code: {selectedOutbreak.outbreakCode}</p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[9px] uppercase font-bold">Cases</span>
                    <p className="text-sm font-black text-sky-400">{selectedOutbreak.cases}</p>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[9px] uppercase font-bold">Deaths</span>
                    <p className="text-sm font-black text-rose-400">{selectedOutbreak.deaths}</p>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[9px] uppercase font-bold">CFR</span>
                    <p className="text-sm font-black text-amber-400">{selectedOutbreak.cfr}%</p>
                  </div>
                </div>

                <button
                  onClick={() => setInspectedRiskOutbreak(selectedOutbreak)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Inspect Evidence-Based Risk Zone</span>
                </button>
              </div>
            )}

            {selectedWoreda && !selectedOutbreak && (
              <div className="space-y-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Woreda Territory
                  </span>
                  <h4 className="text-sm font-black text-white mt-1">
                    {selectedWoreda.name} Woreda
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Zone: {selectedWoreda.zone} • Population: {selectedWoreda.populationEstimate.toLocaleString()}
                  </p>
                </div>

                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Cases:</span>
                    <span className="font-bold text-sky-400">{woredaCaseMap[selectedWoreda.name.toLowerCase()] || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GPS Center:</span>
                    <span className="font-mono text-slate-300">{selectedWoreda.lat}, {selectedWoreda.lng}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    mapInstanceRef.current?.flyTo([selectedWoreda.lat, selectedWoreda.lng], 11, { duration: 1.0 });
                  }}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Zoom In to {selectedWoreda.name}</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Risk Zone Detail Modal */}
      {inspectedRiskOutbreak && (
        <RiskZoneDetailModal
          outbreak={inspectedRiskOutbreak}
          weather={liveWeather}
          onClose={() => setInspectedRiskOutbreak(null)}
          onOpenScientificReferences={(diseaseCode) => {
            setSelectedDiseaseForReferences(diseaseCode);
            setIsScientificReferencesOpen(true);
          }}
        />
      )}

      {/* Scientific References Modal */}
      <ScientificReferencesModal
        isOpen={isScientificReferencesOpen}
        onClose={() => setIsScientificReferencesOpen(false)}
        selectedDiseaseCode={selectedDiseaseForReferences}
      />

    </div>
  );
};
