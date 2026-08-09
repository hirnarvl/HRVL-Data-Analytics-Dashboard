import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { toPng } from 'html-to-image';
import { 
  Compass, 
  Flame, 
  Building2, 
  Layers, 
  Eye, 
  EyeOff,
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
  Filter,
  Sparkles,
  Camera,
  Loader2,
  Download
} from 'lucide-react';
import { Outbreak, SurveillanceRecord, WoredaInfo } from '../types';
import { HARARGHE_WOREDAS, HIRNA_LAB_COORDS } from '../data/woredas';
import { 
  ETHIOPIA_NATIONAL_GEOJSON, 
  OROMIA_REGION_GEOJSON, 
  HARARGHE_WOREDAS_GEOJSON 
} from '../data/geoData';

interface OutbreakMapProps {
  outbreaks: Outbreak[];
  records: SurveillanceRecord[];
  darkMode: boolean;
  selectedZone: string;
}

type BasemapType = 'satellite' | 'hybrid' | 'topo' | 'voyager' | 'dark';
type PolygonStyleMode = 'transparent' | 'risk_heatmap' | 'zone_color' | 'cluster_hotspots' | 'zone_fracture' | 'disease_density';

export const KNOWN_DISEASES = [
  { id: 'fmd', name: 'Foot-and-Mouth (FMD)', keyword: 'foot-and-mouth', color: '#ef4444', icon: '🧬' },
  { id: 'ppr', name: 'Peste des Petits (PPR)', keyword: 'peste des petits', color: '#f97316', icon: '🐐' },
  { id: 'lsd', name: 'Lumpy Skin (LSD)', keyword: 'lumpy skin', color: '#eab308', icon: '🐄' },
  { id: 'cbpp', name: 'CBPP (Bovine Pleuro)', keyword: 'contagious bovine', color: '#3b82f6', icon: '🫁' },
  { id: 'anthrax', name: 'Anthrax (Lethal)', keyword: 'anthrax', color: '#a855f7', icon: '⚠️' },
  { id: 'newcastle', name: 'Newcastle Disease', keyword: 'newcastle', color: '#ec4899', icon: '🐔' },
];

// Helper function to reliably identify East vs West Hararghe Woredas from GeoJSON properties or metadata
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
  const geoJsonGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Export Map Image State
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);

  // Basemap & Polygon Style States
  const [basemap, setBasemap] = useState<BasemapType>(darkMode ? 'dark' : 'hybrid');
  const [polygonMode, setPolygonMode] = useState<PolygonStyleMode>('zone_fracture');
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState<string>('All');
  const [showHotspotRings, setShowHotspotRings] = useState<boolean>(true);

  // Layer Visibility Toggles
  const [showRiskHeatmap, setShowRiskHeatmap] = useState<boolean>(false);
  const [showWoredaDensityHeatmap, setShowWoredaDensityHeatmap] = useState<boolean>(true);
  const [showZoneFracture, setShowZoneFracture] = useState<boolean>(true);
  const [showEthiopiaBoundary, setShowEthiopiaBoundary] = useState(true);
  const [showOromiaBoundary, setShowOromiaBoundary] = useState(true);
  const [showEastHarargheWoredas, setShowEastHarargheWoredas] = useState(true);
  const [showWestHarargheWoredas, setShowWestHarargheWoredas] = useState(true);
  const [showOutbreakMarkers, setShowOutbreakMarkers] = useState(true);
  const [showLabHub, setShowLabHub] = useState(true);

  // Selected Inspect items
  const [selectedOutbreak, setSelectedOutbreak] = useState<Outbreak | null>(outbreaks[0] || null);
  const [selectedWoreda, setSelectedWoreda] = useState<WoredaInfo | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Active' | 'Critical'>('All');

  // Interactive Legend Overlay States
  const [enabledDiseases, setEnabledDiseases] = useState<string[]>([]); // empty array means ALL enabled
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(true);
  const [selectedDensityTier, setSelectedDensityTier] = useState<string>('All'); // 'All' | 'Extreme' | 'High' | 'Moderate' | 'Low' | 'Zero'

  // Default Hararghe Region Center (Hirna Laboratory Hub ~9.05° N, 41.35° E)
  const defaultCenter: [number, number] = [9.05, 41.35];
  const defaultZoom = 8;

  // Toggle individual disease marker in interactive legend
  const handleToggleDiseaseMarker = (diseaseKeyword: string) => {
    setEnabledDiseases(prev => {
      if (prev.length === 0) {
        // If all currently enabled, disabling this one leaves all others
        return KNOWN_DISEASES.map(d => d.keyword).filter(k => k !== diseaseKeyword);
      }
      if (prev.includes(diseaseKeyword)) {
        const next = prev.filter(k => k !== diseaseKeyword);
        return next;
      } else {
        const next = [...prev, diseaseKeyword];
        return next.length === KNOWN_DISEASES.length ? [] : next;
      }
    });
  };

  const handleSelectAllDiseases = () => {
    setEnabledDiseases([]);
  };

  const isDiseaseEnabled = (diseaseKeyword: string) => {
    if (enabledDiseases.length === 0) return true;
    return enabledDiseases.includes(diseaseKeyword);
  };

  // Filtered outbreaks incorporating disease marker toggles
  const filteredOutbreaks = outbreaks.filter(ob => {
    if (selectedZone !== 'All' && ob.zone !== selectedZone) return false;
    if (selectedDiseaseFilter !== 'All' && !ob.disease.toLowerCase().includes(selectedDiseaseFilter.toLowerCase())) return false;
    if (severityFilter === 'Active' && ob.status !== 'Active') return false;
    if (severityFilter === 'Critical' && ob.cfr < 15) return false;

    // Interactive Legend Disease Marker toggles
    if (enabledDiseases.length > 0) {
      const isEnabled = enabledDiseases.some(kw => ob.disease.toLowerCase().includes(kw.toLowerCase()));
      if (!isEnabled) return false;
    }

    return true;
  });

  // Calculate live stats for each disease type for the interactive legend
  const diseaseStats = React.useMemo(() => {
    const stats: Record<string, { cases: number; outbreaks: number }> = {};
    KNOWN_DISEASES.forEach(d => {
      stats[d.keyword] = { cases: 0, outbreaks: 0 };
    });

    outbreaks.forEach(o => {
      const oName = o.disease.toLowerCase();
      KNOWN_DISEASES.forEach(d => {
        if (oName.includes(d.keyword)) {
          stats[d.keyword].cases += o.cases || 0;
          stats[d.keyword].outbreaks += 1;
        }
      });
    });

    records.forEach(r => {
      const rName = r.disease.toLowerCase();
      KNOWN_DISEASES.forEach(d => {
        if (rName.includes(d.keyword)) {
          stats[d.keyword].cases += r.cases || 0;
        }
      });
    });

    return stats;
  }, [outbreaks, records]);

  // Calculate Woreda Disease Burden Map (Woreda Name -> Total Cases)
  const woredaCaseMap = React.useMemo(() => {
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

  // Calculate Woreda Reported Mortality Hotspot Map (Woreda Name -> Total Deaths)
  const woredaMortalityMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach(r => {
      const wName = r.woreda.trim().toLowerCase();
      map[wName] = (map[wName] || 0) + (r.deaths || 0);
    });
    outbreaks.forEach(o => {
      const wName = o.woreda.trim().toLowerCase();
      map[wName] = (map[wName] || 0) + (o.deaths || 0);
    });
    return map;
  }, [records, outbreaks]);

  // Sync dark mode preference with default basemap if user hasn't manually overridden
  useEffect(() => {
    if (darkMode && (basemap === 'voyager' || basemap === 'topo')) {
      setBasemap('dark');
    } else if (!darkMode && basemap === 'dark') {
      setBasemap('hybrid');
    }
  }, [darkMode]);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
        attributionControl: false
      });

      mapInstanceRef.current = map;
      tileLayerGroupRef.current = L.layerGroup().addTo(map);
      geoJsonGroupRef.current = L.layerGroup().addTo(map);
    }
  }, []);

  // Update Basemap Tiles dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    const tileGroup = tileLayerGroupRef.current;
    if (!map || !tileGroup) return;

    tileGroup.clearLayers();

    let primaryUrl = '';
    let labelUrl = '';

    switch (basemap) {
      case 'satellite':
        primaryUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        break;
      case 'hybrid':
        primaryUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        labelUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}';
        break;
      case 'topo':
        primaryUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        break;
      case 'voyager':
        primaryUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        break;
      case 'dark':
      default:
        primaryUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        break;
    }

    const primaryLayer = L.tileLayer(primaryUrl, {
      maxZoom: 18,
      subdomains: 'abcd',
      attribution: 'HRVL GIS Surveillance System'
    });
    tileGroup.addLayer(primaryLayer);

    if (labelUrl) {
      const labelLayer = L.tileLayer(labelUrl, {
        maxZoom: 18,
        subdomains: 'abcd'
      });
      tileGroup.addLayer(labelLayer);
    }

  }, [basemap]);

  // Update GeoJSON Layers & Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const geoGroup = geoJsonGroupRef.current;
    if (!map || !geoGroup) return;

    geoGroup.clearLayers();

    // -------------------------------------------------------------
    // 1. ETHIOPIA NATIONAL BORDER (Gold Metallic Double Outline)
    // -------------------------------------------------------------
    if (showEthiopiaBoundary) {
      const ethLayer = L.geoJSON(ETHIOPIA_NATIONAL_GEOJSON as any, {
        style: {
          color: basemap === 'satellite' || basemap === 'hybrid' ? '#fbbf24' : '#d97706',
          weight: 3.5,
          dashArray: '8, 6',
          fillColor: '#f59e0b',
          fillOpacity: 0.02
        }
      });

      ethLayer.bindTooltip('🇪🇹 <b>Federal Democratic Republic of Ethiopia</b><br/>National Boundary Outline', {
        sticky: true,
        className: 'leaflet-custom-tooltip'
      });

      geoGroup.addLayer(ethLayer);
    }

    // -------------------------------------------------------------
    // 2. OROMIA REGIONAL STATE BORDER (Emerald Contour Outline)
    // -------------------------------------------------------------
    if (showOromiaBoundary) {
      const oromiaLayer = L.geoJSON(OROMIA_REGION_GEOJSON as any, {
        style: {
          color: basemap === 'satellite' || basemap === 'hybrid' ? '#34d399' : '#059669',
          weight: 2.5,
          fillColor: '#10b981',
          fillOpacity: 0.04
        }
      });

      oromiaLayer.bindTooltip('🗺️ <b>Oromia Regional State</b><br/>Regional Surveillance Zone', {
        sticky: true,
        className: 'leaflet-custom-tooltip'
      });

      geoGroup.addLayer(oromiaLayer);
    }

    // -------------------------------------------------------------
    // 3. WEST & EAST HARARGHE 36 WOREDA REALISTIC POLYGONS
    // -------------------------------------------------------------
    if (showEastHarargheWoredas || showWestHarargheWoredas) {
      const harargheLayer = L.geoJSON(HARARGHE_WOREDAS_GEOJSON as any, {
        filter: (feature) => {
          const isEast = checkZoneIsEast(feature?.properties);
          const zoneCode = isEast ? 'E/H' : 'W/H';
          if (selectedZone !== 'All' && zoneCode !== selectedZone) return false;
          if (isEast && !showEastHarargheWoredas) return false;
          if (!isEast && !showWestHarargheWoredas) return false;
          return true;
        },
        style: (feature) => {
          const props = feature?.properties || {};
          const isEast = checkZoneIsEast(props);
          const woredaName = (props.name || props.WOREDABAME || '').toLowerCase();
          const cases = woredaCaseMap[woredaName] || 0;
          const deaths = woredaMortalityMap[woredaName] || 0;

          // Distinct zonal border outline stroke colors for East vs West Hararghe Woredas:
          // East Hararghe (E/H, 21 Woredas): Royal Sky Cyan / Electric Cyan (#0284c7 in light mode, #38bdf8 in dark mode)
          // West Hararghe (W/H, 15 Woredas): Deep Vivid Magenta / Electric Fuchsia (#c026d3 in light mode, #f0abfc in dark mode)
          const zonalStrokeColor = isEast
            ? (darkMode ? '#38bdf8' : '#0284c7')
            : (darkMode ? '#f0abfc' : '#c026d3');
          
          let strokeColor = zonalStrokeColor;
          let strokeWidth = 3.2; // Prominent stroke weight to clearly outline Woreda borders
          let fillColor = 'transparent';
          let fillOpacity = 0.02;

          if (showWoredaDensityHeatmap || polygonMode === 'disease_density') {
            if (cases >= 50) {
              fillColor = '#8b5cf6'; // Extreme Case Density Purple
              fillOpacity = 0.52;
            } else if (cases >= 25) {
              fillColor = '#dc2626'; // High Case Density Crimson
              fillOpacity = 0.42;
            } else if (cases >= 10) {
              fillColor = '#ea580c'; // Moderate-High Density Orange
              fillOpacity = 0.32;
            } else if (cases > 0) {
              fillColor = '#f59e0b'; // Low-Moderate Density Amber
              fillOpacity = 0.22;
            } else {
              fillColor = '#10b981'; // Zero Recorded Cases Emerald
              fillOpacity = 0.08;
            }
          } else if (showRiskHeatmap || polygonMode === 'risk_heatmap') {
            if (deaths >= 10 || cases > 60) {
              fillColor = '#dc2626'; // Critical Mortality Crimson
              fillOpacity = 0.45;
            } else if (deaths >= 3 || cases > 20) {
              fillColor = '#ea580c'; // High Risk Orange
              fillOpacity = 0.35;
            } else if (deaths > 0 || cases > 0) {
              fillColor = '#d97706'; // Moderate Risk Amber
              fillOpacity = 0.25;
            } else {
              fillColor = '#059669'; // Low / Zero Risk Emerald
              fillOpacity = 0.10;
            }
          } else if (polygonMode === 'zone_color') {
            fillColor = isEast ? '#0284c7' : '#c026d3';
            fillOpacity = 0.25;
          } else if (polygonMode === 'zone_fracture' || polygonMode === 'transparent') {
            fillColor = 'transparent';
            fillOpacity = 0.01;
            strokeWidth = 3.2;
          } else if (polygonMode === 'cluster_hotspots') {
            fillColor = isEast ? 'rgba(2, 132, 199, 0.08)' : 'rgba(192, 38, 211, 0.08)';
            fillOpacity = 0.08;
          }

          // Highlight if selected
          const isSelected = selectedWoreda?.name.toLowerCase() === woredaName;
          if (isSelected) {
            fillColor = isEast ? '#0284c7' : '#c026d3';
            fillOpacity = 0.5;
            strokeColor = isEast ? '#00f2fe' : '#f472b6';
            strokeWidth = 4.5;
          }

          return {
            color: strokeColor,
            weight: strokeWidth,
            dashArray: undefined,
            fillColor,
            fillOpacity
          };
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties || {};
          const woredaName = props.name || props.WOREDABAME || 'Woreda';
          const cases = woredaCaseMap[woredaName.toLowerCase()] || 0;
          const deaths = woredaMortalityMap[woredaName.toLowerCase()] || 0;
          const isEast = checkZoneIsEast(props);

          const riskBadge = deaths >= 10 ? '🚨 CRITICAL MORTALITY HOTSPOT' : deaths >= 3 ? '⚠️ HIGH MORTALITY RISK' : cases > 0 ? '⚡ MODERATE SPREAD RISK' : '✅ LOW / ZERO RISK';
          const riskColor = deaths >= 10 ? '#ef4444' : deaths >= 3 ? '#f97316' : cases > 0 ? '#facc15' : '#10b981';

          layer.bindTooltip(`
            <div style="font-family: sans-serif; padding: 5px 8px; min-width: 160px;">
              <div style="font-weight: 800; font-size: 13px; color: ${isEast ? '#0284c7' : '#c026d3'};">
                📍 ${woredaName} Woreda
              </div>
              <div style="font-size: 11px; color: #94a3b8; margin-bottom: 3px;">
                Zone: <b>${isEast ? 'East Hararghe (E/H)' : 'West Hararghe (W/H)'}</b>
              </div>
              <div style="font-size: 11px; font-weight: 800; color: ${riskColor}; margin-bottom: 2px;">
                ${riskBadge}
              </div>
              <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">
                • Reported Cases: <b>${cases}</b><br/>
                • Reported Fatalities: <b style="color: ${deaths > 0 ? '#ef4444' : '#10b981'};">${deaths}</b><br/>
                • Population: <b>${(props.populationEstimate || 0).toLocaleString()}</b>
              </div>
            </div>
          `, { sticky: true });

          layer.on({
            mouseover: (e) => {
              const l = e.target;
              l.setStyle({
                fillColor: isEast ? '#38bdf8' : '#f0abfc',
                fillOpacity: 0.38,
                weight: 4.0,
                color: isEast ? '#00f2fe' : '#f472b6'
              });
            },
            mouseout: (e) => {
              harargheLayer.resetStyle(e.target);
            },
            click: () => {
              const matchedW = HARARGHE_WOREDAS.find(w => w.name.toLowerCase() === woredaName.toLowerCase());
              if (matchedW) {
                setSelectedWoreda(matchedW);
                setSelectedOutbreak(null);
                map.flyTo([matchedW.lat, matchedW.lng], 10, { duration: 1.2 });
              }
            }
          });
        }
      });

      geoGroup.addLayer(harargheLayer);
    }

    // -------------------------------------------------------------
    // 3.4 INTER-ZONAL HARARGHE DIVIDE FRACTURE LINE
    // -------------------------------------------------------------
    if (showZoneFracture) {
      const zoneFractureLineCoords: [number, number][] = [
        [9.65, 41.20],
        [9.55, 41.22],
        [9.45, 41.25],
        [9.35, 41.23],
        [9.28, 41.20],
        [9.18, 41.16],
        [9.10, 41.22],
        [9.00, 41.26],
        [8.88, 41.31],
        [8.75, 41.37],
        [8.60, 41.44],
        [8.40, 41.50],
        [8.25, 41.55]
      ];

      const fractureOuter = L.polyline(zoneFractureLineCoords, {
        color: darkMode ? '#f43f5e' : '#e11d48',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      });

      const fractureInner = L.polyline(zoneFractureLineCoords, {
        color: '#ffffff',
        weight: 2.2,
        dashArray: '7, 6',
        opacity: 1.0,
        lineCap: 'round',
        lineJoin: 'round'
      });

      fractureOuter.bindTooltip(`
        <div style="font-family: sans-serif; padding: 6px 10px; min-width: 220px; background: #0f172a; color: white; border-radius: 8px;">
          <div style="font-weight: 900; font-size: 13px; color: #f43f5e; display: flex; align-items: center; gap: 4px;">
            ⚡ E/H – W/H Zonal Fracture Divide
          </div>
          <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px; line-height: 1.3;">
            Inter-Zonal Administrative Boundary Line dividing <b>W/H</b> (15 Woredas) from <b>E/H</b> (21 Woredas).
          </div>
        </div>
      `, { sticky: true });

      geoGroup.addLayer(fractureOuter);
      geoGroup.addLayer(fractureInner);
    }

    // -------------------------------------------------------------
    // 3.5 DISEASE CASE DENSITY HEATMAP OVERLAY (RADIAL HEAT HALOS)
    // -------------------------------------------------------------
    if (showRiskHeatmap) {
      HARARGHE_WOREDAS.forEach(w => {
        const deaths = woredaMortalityMap[w.name.toLowerCase()] || 0;
        const cases = woredaCaseMap[w.name.toLowerCase()] || 0;
        if (deaths > 0 || cases > 0) {
          const isCritical = deaths >= 10 || cases >= 60;
          const isHigh = deaths >= 3 || cases >= 25;
          
          const radiusMeters = Math.min(Math.max((deaths * 1800) + (cases * 350), 7500), 25000);
          const heatColor = isCritical ? '#dc2626' : isHigh ? '#ea580c' : '#f59e0b';
          
          // Outer Soft Heat Dispersion Halo
          const outerHalo = L.circle([w.lat, w.lng], {
            radius: radiusMeters * 1.35,
            color: 'transparent',
            fillColor: heatColor,
            fillOpacity: isCritical ? 0.22 : 0.14,
            interactive: false
          });

          // Core High-Intensity Radial Heat Circle
          const heatCircle = L.circle([w.lat, w.lng], {
            radius: radiusMeters,
            color: heatColor,
            weight: 1.5,
            fillColor: heatColor,
            fillOpacity: isCritical ? 0.42 : isHigh ? 0.32 : 0.22,
            dashArray: isCritical ? '4, 4' : undefined
          });

          heatCircle.bindTooltip(`
            <div style="font-family: sans-serif; padding: 5px 8px; min-width: 170px;">
              <div style="font-weight: 800; font-size: 12px; color: ${heatColor}; margin-bottom: 2px;">
                🔥 Disease Case Density Heatmap
              </div>
              <div style="font-size: 11px; font-weight: 700; color: #f8fafc;">
                📍 ${w.name} Woreda (${w.zone})
              </div>
              <div style="font-size: 10.5px; color: #cbd5e1; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.15); pt: 4px;">
                • Cumulative Cases: <b>${cases}</b><br/>
                • Total Fatalities: <b style="color: ${deaths > 0 ? '#ef4444' : '#34d399'};">${deaths}</b><br/>
                • Risk Index: <b>${isCritical ? 'CRITICAL (Severe Outbreak)' : isHigh ? 'HIGH RISK' : 'MODERATE SPREAD'}</b>
              </div>
            </div>
          `, { sticky: true });

          geoGroup.addLayer(outerHalo);
          geoGroup.addLayer(heatCircle);
        }
      });
    }

    // -------------------------------------------------------------
    // 3.6 WOREDA DISEASE DENSITY HEATMAP LAYER OVERLAY
    // -------------------------------------------------------------
    if (showWoredaDensityHeatmap) {
      HARARGHE_WOREDAS.forEach(w => {
        const cases = woredaCaseMap[w.name.toLowerCase()] || 0;
        const deaths = woredaMortalityMap[w.name.toLowerCase()] || 0;

        const isExtreme = cases >= 50;
        const isHigh = cases >= 25 && cases < 50;
        const isModerate = cases >= 10 && cases < 25;
        const isLow = cases >= 1 && cases < 10;
        const isZero = cases === 0;

        // Apply selected interactive density tier filter if active
        if (selectedDensityTier !== 'All') {
          if (selectedDensityTier === 'Extreme' && !isExtreme) return;
          if (selectedDensityTier === 'High' && !isHigh) return;
          if (selectedDensityTier === 'Moderate' && !isModerate) return;
          if (selectedDensityTier === 'Low' && !isLow) return;
          if (selectedDensityTier === 'Zero' && !isZero) return;
        }

        if (cases > 0 || (selectedDensityTier === 'Zero' && isZero)) {
          const radiusMeters = Math.min(Math.max((cases * 340) + 4800, 6500), 28000);
          const densityColor = isExtreme ? '#8b5cf6' : isHigh ? '#dc2626' : isModerate ? '#ea580c' : isLow ? '#f59e0b' : '#10b981';

          // Outer Soft Case Density Halo
          const outerDensityHalo = L.circle([w.lat, w.lng], {
            radius: isZero ? 5000 : radiusMeters * 1.35,
            color: 'transparent',
            fillColor: densityColor,
            fillOpacity: isExtreme ? 0.25 : isHigh ? 0.20 : 0.16,
            interactive: false
          });

          // Core Woreda Disease Density Circle
          const densityCircle = L.circle([w.lat, w.lng], {
            radius: isZero ? 4000 : radiusMeters,
            color: densityColor,
            weight: 2,
            fillColor: densityColor,
            fillOpacity: isExtreme ? 0.45 : isHigh ? 0.35 : isZero ? 0.15 : 0.25,
            dashArray: isExtreme ? '4, 4' : undefined
          });

          densityCircle.bindTooltip(`
            <div style="font-family: sans-serif; padding: 5px 8px; min-width: 175px;">
              <div style="font-weight: 800; font-size: 12px; color: ${densityColor}; margin-bottom: 2px;">
                🌡️ Woreda Disease Density
              </div>
              <div style="font-size: 11px; font-weight: 700; color: #f8fafc;">
                📍 ${w.name} Woreda (${w.zone})
              </div>
              <div style="font-size: 10.5px; color: #cbd5e1; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 4px;">
                • Total Cases Recorded: <b style="color: #ffffff;">${cases}</b><br/>
                • Fatalities Reported: <b style="color: ${deaths > 0 ? '#ef4444' : '#34d399'};">${deaths}</b><br/>
                • Density Tier: <b style="color: ${densityColor};">${isExtreme ? 'EXTREME HEAVY DENSITY (&ge;50 Cases)' : isHigh ? 'HIGH DENSITY (25–49 Cases)' : isModerate ? 'MODERATE DENSITY (10–24 Cases)' : isLow ? 'MILD DENSITY (1–9 Cases)' : 'ZERO CASES (BASELINE)'}</b>
              </div>
            </div>
          `, { sticky: true });

          geoGroup.addLayer(outerDensityHalo);
          geoGroup.addLayer(densityCircle);
        }
      });
    }

    // -------------------------------------------------------------
    // 4. HIRNA REGIONAL VETERINARY LABORATORY (HRVL) HUB MARKER
    // -------------------------------------------------------------
    if (showLabHub) {
      const labIcon = L.divIcon({
        className: 'custom-leaflet-icon',
        html: `
          <div style="
            position: relative;
            width: 38px;
            height: 38px;
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            border: 3px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
            cursor: pointer;
          ">
            <span style="
              position: absolute;
              inset: -8px;
              border-radius: 50%;
              background-color: rgba(16, 185, 129, 0.35);
              animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
              <path d="M10 6h4"/>
              <path d="M10 10h4"/>
              <path d="M10 14h4"/>
            </svg>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const googleMapsQueryUrl = `https://www.google.com/maps/search/?api=1&query=Hirna+Regional+Veterinary+Laboratory+Hirna+Oromia+Ethiopia`;
      const googleMapsPinUrl = `https://www.google.com/maps?q=${HIRNA_LAB_COORDS.lat},${HIRNA_LAB_COORDS.lng}`;
      const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${HIRNA_LAB_COORDS.lat},${HIRNA_LAB_COORDS.lng}`;

      const labMarker = L.marker([HIRNA_LAB_COORDS.lat, HIRNA_LAB_COORDS.lng], { icon: labIcon });
      
      labMarker.bindTooltip(`
        <div style="font-family: sans-serif; padding: 5px 7px; min-width: 190px;">
          <b style="color: #10b981; font-size: 13px;">🏢 Hirna Regional Veterinary Laboratory (HRVL)</b><br/>
          <span style="font-size: 11px; color: #cbd5e1;">Central Epidemiology & Diagnostics Hub</span><br/>
          <div style="margin-top: 4px; font-size: 10px; color: #34d399; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 3px;">
            👉 Click marker for Google Maps link & reviews
          </div>
        </div>
      `, { sticky: true });

      labMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 6px 4px; min-width: 250px; color: #0f172a;">
          <div style="display: flex; align-items: center; gap: 8.5px; margin-bottom: 8px;">
            <div style="width: 42px; height: 42px; background: #0f172a; padding: 3px; border-radius: 10px; border: 1.5px solid #059669; display: flex; align-items: center; justify-content: center; shrink: 0; box-shadow: 0 2px 6px rgba(5,150,105,0.25);">
              <img src="/hrvl-emblem.png" alt="HRVL Emblem" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
            <div>
              <h4 style="margin: 0; font-size: 13.5px; font-weight: 800; color: #0f172a; line-height: 1.25;">Hirna Regional Veterinary Laboratory</h4>
              <span style="font-size: 11px; font-weight: 700; color: #059669;">HRVL Official Hub</span>
            </div>
          </div>
          
          <div style="font-size: 11px; color: #334155; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; margin-bottom: 10px;">
            <p style="margin: 0 0 4px 0;">📍 <b>Address:</b> Hirna Town, W/H, Oromia, Ethiopia</p>
            <p style="margin: 0 0 4px 0;">🌐 <b>GPS Coordinates:</b> ${HIRNA_LAB_COORDS.lat}° N, ${HIRNA_LAB_COORDS.lng}° E</p>
            <p style="margin: 0;">🔬 <b>Scope:</b> Regional Reference Lab for Livestock Surveillance & Diagnostics</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            <a 
              href="${googleMapsQueryUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="display: flex; align-items: center; justify-content: center; gap: 6px; background: #059669; color: #ffffff; text-decoration: none; padding: 8px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; text-align: center; box-shadow: 0 2px 4px rgba(5,150,105,0.25);"
            >
              📍 View Address on Google Maps ↗
            </a>

            <div style="display: flex; gap: 6px;">
              <a 
                href="${googleMapsPinUrl}" 
                target="_blank" 
                rel="noopener noreferrer"
                style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; background: #2563eb; color: #ffffff; text-decoration: none; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-align: center;"
              >
                🗺️ GPS Pin
              </a>
              <a 
                href="${googleMapsDirectionsUrl}" 
                target="_blank" 
                rel="noopener noreferrer"
                style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; background: #7c3aed; color: #ffffff; text-decoration: none; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-align: center;"
              >
                🚗 Directions
              </a>
            </div>

            <a 
              href="${googleMapsQueryUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="display: flex; align-items: center; justify-content: center; gap: 5px; background: #f1f5f9; color: #0284c7; border: 1px solid #cbd5e1; text-decoration: none; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-align: center; margin-top: 2px;"
            >
              ⭐ Read & Write Google Maps Reviews ↗
            </a>
          </div>
        </div>
      `, { maxWidth: 280 });

      geoGroup.addLayer(labMarker);
    }

    // -------------------------------------------------------------
    // 5. DYNAMIC CLUSTER HOTSPOT TRANSMISSION RINGS (CONCENTRIC HEAT BUFFER)
    // -------------------------------------------------------------
    if (showHotspotRings || polygonMode === 'cluster_hotspots') {
      filteredOutbreaks.forEach((ob) => {
        // Calculate cluster radius based on cases and CFR severity
        const baseRadiusKm = Math.min(Math.max(ob.cases * 120, 8000), 28000); // meters
        const isHighSeverity = ob.cfr > 10 || ob.cases > 100;
        const ringColor = isHighSeverity ? '#ef4444' : '#f97316';

        // Outer Buffer Zone (Surveillance Monitoring Ring)
        const outerCircle = L.circle([ob.lat, ob.lng], {
          radius: baseRadiusKm * 1.5,
          color: ringColor,
          weight: 1.5,
          dashArray: '6, 6',
          fillColor: ringColor,
          fillOpacity: 0.08
        });

        // Inner Core Ring (High Transmission Ring)
        const innerCircle = L.circle([ob.lat, ob.lng], {
          radius: baseRadiusKm * 0.7,
          color: ringColor,
          weight: 2.5,
          fillColor: ringColor,
          fillOpacity: 0.22
        });

        const clusterTooltip = `
          <div style="font-family: sans-serif; padding: 6px 8px; min-width: 170px;">
            <div style="font-weight: 800; font-size: 13px; color: ${ringColor}; display: flex; align-items: center; gap: 4px;">
              <span>🔥 Dynamic Hotspot Cluster Analysis</span>
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #f8fafc; margin-top: 2px;">
              ${ob.disease} (${ob.woreda})
            </div>
            <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">
              • Active Transmission Buffer: <b>${(baseRadiusKm / 1000).toFixed(1)} km</b><br/>
              • Cluster Cases: <b>${ob.cases} animals</b><br/>
              • Lethality (CFR): <b>${ob.cfr}%</b><br/>
              • Risk Category: <b style="color: ${ringColor};">${isHighSeverity ? 'CRITICAL HOTSPOT' : 'HIGH SPREAD'}</b>
            </div>
          </div>
        `;

        outerCircle.bindTooltip(clusterTooltip, { sticky: true });
        innerCircle.bindTooltip(clusterTooltip, { sticky: true });

        geoGroup.addLayer(outerCircle);
        geoGroup.addLayer(innerCircle);
      });
    }

    // -------------------------------------------------------------
    // 6. PULSING OUTBREAK RADAR MARKERS
    // -------------------------------------------------------------
    if (showOutbreakMarkers) {
      filteredOutbreaks.forEach((ob) => {
        const isCritical = ob.cfr > 15;
        const colorHex = isCritical ? '#ef4444' : ob.status === 'Contained' ? '#10b981' : '#f97316';
        const isSelected = selectedOutbreak?.id === ob.id;

        const icon = L.divIcon({
          className: 'custom-leaflet-outbreak-icon',
          html: `
            <div style="
              position: relative;
              width: ${isSelected ? '36px' : '28px'};
              height: ${isSelected ? '36px' : '28px'};
              background-color: ${colorHex};
              border: ${isSelected ? '3.5px solid #ffffff' : '2.5px solid #0f172a'};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              box-shadow: 0 4px 14px rgba(0,0,0,0.6);
              transition: all 0.2s ease;
              cursor: pointer;
            ">
              <span style="
                position: absolute;
                inset: -8px;
                border-radius: 50%;
                background-color: ${colorHex};
                opacity: 0.4;
                animation: ping 1.9s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5Z"/>
              </svg>
            </div>
          `,
          iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
          iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14]
        });

        const marker = L.marker([ob.lat, ob.lng], { icon });

        marker.on('click', () => {
          setSelectedOutbreak(ob);
          setSelectedWoreda(null);
          map.flyTo([ob.lat, ob.lng], 10, { duration: 1.0 });
        });

        marker.bindTooltip(`
          <div style="font-family: sans-serif; padding: 4px 6px;">
            <b style="color: ${colorHex}; font-size: 13px;">${ob.disease} Outbreak</b><br/>
            <span>📍 ${ob.woreda} (${ob.zone})</span><br/>
            <b>Cases: ${ob.cases} | Fatalities: ${ob.deaths} | CFR: ${ob.cfr}%</b>
          </div>
        `, { sticky: true });

        geoGroup.addLayer(marker);
      });
    }

  }, [
    basemap,
    polygonMode,
    showRiskHeatmap,
    showWoredaDensityHeatmap,
    showZoneFracture,
    showEthiopiaBoundary,
    showOromiaBoundary,
    showEastHarargheWoredas,
    showWestHarargheWoredas,
    showOutbreakMarkers,
    showLabHub,
    filteredOutbreaks,
    selectedZone,
    selectedOutbreak,
    selectedWoreda,
    woredaCaseMap,
    woredaMortalityMap,
    enabledDiseases,
    selectedDensityTier
  ]);

  // Quick Fly-to Woreda
  const handleWoredaSelect = (wName: string) => {
    const w = HARARGHE_WOREDAS.find(item => item.name.toLowerCase() === wName.toLowerCase());
    if (w) {
      setSelectedWoreda(w);
      setSelectedOutbreak(null);
      mapInstanceRef.current?.flyTo([w.lat, w.lng], 10, { duration: 1.2 });
    }
  };

  // Map Controls (Zoom / Reset)
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => mapInstanceRef.current?.flyTo(defaultCenter, defaultZoom, { duration: 1.0 });

  // Export Map View with Active Overlays and Legend as PNG Image
  const handleExportMapImage = async () => {
    if (!mapWrapperRef.current) return;
    setIsExportingImage(true);
    try {
      const dataUrl = await toPng(mapWrapperRef.current, {
        cacheBust: true,
        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
        quality: 0.95,
      });
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `Hararghe_GIS_Outbreak_Map_${dateStr}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export GIS map image:', err);
      alert('Failed to generate map image download. Please try again.');
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 transition-colors">
      
      {/* Top Map Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full xl:w-auto">
          <div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Geospatial Disease Surveillance GIS Map
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Photorealistic satellite imagery, elevation terrain contouring, and organic polygon boundaries across East & West Hararghe Woredas.
            </p>
          </div>

          <button
            onClick={handleExportMapImage}
            disabled={isExportingImage}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50 text-xs shrink-0 self-start sm:self-center"
            title="Export and download current map view with active overlays & legends as high-res PNG image"
          >
            {isExportingImage ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Image...</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" />
                <span>📸 Export as Image</span>
              </>
            )}
          </button>
        </div>

        {/* Layer Visibility & Basemap Mode Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Basemap Selection Group */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setBasemap('hybrid')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                basemap === 'hybrid' || basemap === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="ESRI High-Resolution Satellite & Labels"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>🛰️ Satellite</span>
            </button>

            <button
              onClick={() => setBasemap('topo')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                basemap === 'topo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Topographic Relief Terrain Map"
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>⛰️ Terrain</span>
            </button>

            <button
              onClick={() => setBasemap('voyager')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                basemap === 'voyager'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Clean Crisp GIS Vector Map"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>🗺️ Vector</span>
            </button>

            <button
              onClick={() => setBasemap('dark')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                basemap === 'dark'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="High-Tech Dark GIS Mode"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>🌙 Dark GIS</span>
            </button>
          </div>

          {/* Polygon Style Mode & Hotspot Analysis */}
          <div className="flex items-center space-x-1.5">
            <select
              aria-label="Polygon Layer Styling Mode"
              value={polygonMode}
              onChange={(e) => setPolygonMode(e.target.value as any)}
              className="text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="disease_density">🌡️ Woreda Disease Density Heatmap Fill</option>
              <option value="zone_fracture">⚡ Zone Fracture Outlines (Transparent Fill)</option>
              <option value="cluster_hotspots">🔥 Dynamic Cluster Hotspots Mode</option>
              <option value="risk_heatmap">Outbreak Risk Heatmap Fill</option>
              <option value="zone_color">Zone Solid Color Tint (East/West)</option>
              <option value="transparent">Minimal Boundary Lines (Transparent)</option>
            </select>

            {/* Disease Filter Dropdown */}
            <select
              aria-label="Filter Hotspots by Disease"
              value={selectedDiseaseFilter}
              onChange={(e) => setSelectedDiseaseFilter(e.target.value)}
              className="text-xs font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="All">🧬 All Diseases (Cluster Analysis)</option>
              <option value="Foot-and-Mouth">FMD (Foot-and-Mouth)</option>
              <option value="Peste des Petits">PPR (Small Ruminants)</option>
              <option value="Lumpy Skin">LSD (Lumpy Skin)</option>
              <option value="Contagious Bovine">CBPP (Bovine Pleuro)</option>
              <option value="Anthrax">Anthrax (Critical Lethality)</option>
              <option value="Newcastle">Newcastle (Poultry)</option>
            </select>
          </div>

          {/* Quick Woreda Search & Zoom Dropdown */}
          <div className="relative">
            <select
              aria-label="Fly-to Woreda"
              onChange={(e) => handleWoredaSelect(e.target.value)}
              value={selectedWoreda?.name || ''}
              className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="">🎯 Fly to Woreda...</option>
              {HARARGHE_WOREDAS.map(w => (
                <option key={w.id} value={w.name}>
                  {w.name} ({w.zone})
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Layer Toggles Toolbar */}
      <div className="flex flex-wrap items-center gap-2 my-2 py-1 text-xs">
        <button
          onClick={() => setShowWoredaDensityHeatmap(!showWoredaDensityHeatmap)}
          className={`px-3 py-1 rounded-md border font-extrabold flex items-center space-x-1.5 cursor-pointer transition-all ${
            showWoredaDensityHeatmap
              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-950/40 ring-2 ring-purple-400/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
          }`}
          title="Toggle Woreda Disease Density Heatmap Layer (Based on Total Cases per Woreda)"
        >
          <Activity className={`w-3.5 h-3.5 ${showWoredaDensityHeatmap ? 'text-purple-200 animate-pulse' : 'text-slate-400'}`} />
          <span>🌡️ Woreda Disease Density</span>
          {showWoredaDensityHeatmap && <Check className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <button
          onClick={() => setShowZoneFracture(!showZoneFracture)}
          className={`px-3 py-1 rounded-md border font-extrabold flex items-center space-x-1.5 cursor-pointer transition-all ${
            showZoneFracture
              ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white border-blue-400 shadow-md shadow-blue-950/40 ring-2 ring-blue-400/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
          }`}
          title="Toggle E/H & W/H Zonal Fracture Line & Distinct Outlines"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-pulse"></span>
          <span>⚡ Zone Fracture Line</span>
          {showZoneFracture && <Check className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <button
          onClick={() => setShowRiskHeatmap(!showRiskHeatmap)}
          className={`px-3 py-1 rounded-md border font-extrabold flex items-center space-x-1.5 cursor-pointer transition-all ${
            showRiskHeatmap
              ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950/40 ring-2 ring-rose-400/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
          }`}
          title="Toggle Reported Mortality Risk Heatmap Layer"
        >
          <Flame className={`w-3.5 h-3.5 ${showRiskHeatmap ? 'text-amber-300 animate-pulse' : 'text-slate-400'}`} />
          <span>🔥 Risk Heatmap Layer</span>
          {showRiskHeatmap && <Check className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <button
          onClick={() => setShowEthiopiaBoundary(!showEthiopiaBoundary)}
          className={`px-2.5 py-1 rounded-md border font-medium flex items-center space-x-1.5 cursor-pointer ${
            showEthiopiaBoundary
              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>🇪🇹 Ethiopia Border</span>
          {showEthiopiaBoundary && <Check className="w-3 h-3 ml-0.5" />}
        </button>

        <button
          onClick={() => setShowOromiaBoundary(!showOromiaBoundary)}
          className={`px-2.5 py-1 rounded-md border font-medium flex items-center space-x-1.5 cursor-pointer ${
            showOromiaBoundary
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>🗺️ Oromia Region</span>
          {showOromiaBoundary && <Check className="w-3 h-3 ml-0.5" />}
        </button>

        <button
          onClick={() => setShowEastHarargheWoredas(!showEastHarargheWoredas)}
          className={`px-2.5 py-1 rounded-md border font-medium flex items-center space-x-1.5 cursor-pointer ${
            showEastHarargheWoredas
              ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>📍 E/H Woredas (21)</span>
          {showEastHarargheWoredas && <Check className="w-3 h-3 ml-0.5" />}
        </button>

        <button
          onClick={() => setShowWestHarargheWoredas(!showWestHarargheWoredas)}
          className={`px-2.5 py-1 rounded-md border font-medium flex items-center space-x-1.5 cursor-pointer ${
            showWestHarargheWoredas
              ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <span>📍 W/H Woredas (15)</span>
          {showWestHarargheWoredas && <Check className="w-3 h-3 ml-0.5" />}
        </button>

        <button
          onClick={() => setShowHotspotRings(!showHotspotRings)}
          className={`px-2.5 py-1 rounded-md border font-bold flex items-center space-x-1.5 cursor-pointer ${
            showHotspotRings
              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span>🔥 Hotspot Buffer Rings</span>
          {showHotspotRings && <Check className="w-3 h-3 ml-0.5" />}
        </button>

        <button
          onClick={() => setShowOutbreakMarkers(!showOutbreakMarkers)}
          className={`px-2.5 py-1 rounded-md border font-medium flex items-center space-x-1.5 cursor-pointer ${
            showOutbreakMarkers
              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>🔥 Outbreak Radar Bubbles</span>
          {showOutbreakMarkers && <Check className="w-3 h-3 ml-0.5" />}
        </button>

        <button
          onClick={() => {
            const nextState = !showLabHub;
            setShowLabHub(nextState);
            if (nextState && mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([HIRNA_LAB_COORDS.lat, HIRNA_LAB_COORDS.lng], 12, { duration: 1.2 });
            }
          }}
          className={`px-2.5 py-1 rounded-md border font-medium flex items-center space-x-1.5 cursor-pointer transition-all ${
            showLabHub
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
          }`}
          title="Toggle & Fly to Hirna Regional Veterinary Laboratory Hub"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>🏢 HRVL Hirna Lab Hub</span>
          {showLabHub && <Check className="w-3 h-3 ml-0.5" />}
        </button>
      </div>

      {/* Main Map Area & Field Telemetry Inspector Grid */}
      <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Leaflet GIS Map Canvas */}
        <div ref={mapWrapperRef} className="lg:col-span-2 relative min-h-[480px] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-inner flex flex-col justify-between">
          
          {/* Leaflet Map DOM Element */}
          <div ref={mapContainerRef} className="w-full h-full min-h-[480px] z-0" />

          {/* Floating Interactive GIS Legend Overlay & Disease Marker Toggle Panel */}
          <div className="absolute top-3 left-3 z-10 max-w-[270px] sm:max-w-xs bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 p-2.5 sm:p-3 rounded-2xl border border-purple-300 dark:border-purple-500/40 shadow-2xl backdrop-blur-md text-xs transition-all space-y-2">
            
            {/* Legend Panel Header */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
                <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] sm:text-[11px]">
                  GIS Legend & Marker Controls
                </span>
              </div>

              <div className="flex items-center space-x-1">
                {(enabledDiseases.length > 0 || selectedDensityTier !== 'All') && (
                  <button
                    onClick={() => {
                      handleSelectAllDiseases();
                      setSelectedDensityTier('All');
                    }}
                    className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 text-purple-800 dark:text-purple-300 rounded text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"
                    title="Reset Legend Filters"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 cursor-pointer"
                  title={isLegendExpanded ? "Minimize Legend" : "Expand Legend"}
                >
                  {isLegendExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Legend Expanded Body */}
            {isLegendExpanded && (
              <div className="space-y-2.5 pt-0.5">
                
                {/* 1. Disease Density Heatmap Color Coding Explanation */}
                {showWoredaDensityHeatmap && (
                  <div className="space-y-1.5 bg-purple-50/60 dark:bg-purple-950/30 p-2 rounded-xl border border-purple-200 dark:border-purple-900/40">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 dark:text-purple-300 text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Activity className="w-3 h-3 text-purple-500 shrink-0" />
                        <span>Woreda Disease Density Heatmap</span>
                      </span>
                      <span className="text-[9px] text-purple-700 dark:text-purple-400 font-mono font-semibold">
                        {selectedDensityTier === 'All' ? 'Click tier to filter' : `Filter: ${selectedDensityTier}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[9.5px]">
                      <button
                        onClick={() => setSelectedDensityTier(selectedDensityTier === 'Extreme' ? 'All' : 'Extreme')}
                        className={`flex items-center justify-between p-1 rounded border transition-all text-left cursor-pointer ${
                          selectedDensityTier === 'Extreme'
                            ? 'bg-purple-600 text-white border-purple-500 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-900/60 text-slate-800 dark:text-slate-200 hover:border-purple-400'
                        }`}
                        title="Filter Woredas with Extreme Density (&ge;50 cases)"
                      >
                        <div className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 border border-white shrink-0"></span>
                          <span>Extreme</span>
                        </div>
                        <span className="font-mono text-[9px] font-bold">&ge;50</span>
                      </button>

                      <button
                        onClick={() => setSelectedDensityTier(selectedDensityTier === 'High' ? 'All' : 'High')}
                        className={`flex items-center justify-between p-1 rounded border transition-all text-left cursor-pointer ${
                          selectedDensityTier === 'High'
                            ? 'bg-red-600 text-white border-red-500 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-900/60 text-slate-800 dark:text-slate-200 hover:border-red-400'
                        }`}
                        title="Filter Woredas with High Density (25–49 cases)"
                      >
                        <div className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white shrink-0"></span>
                          <span>High</span>
                        </div>
                        <span className="font-mono text-[9px] font-bold">25–49</span>
                      </button>

                      <button
                        onClick={() => setSelectedDensityTier(selectedDensityTier === 'Moderate' ? 'All' : 'Moderate')}
                        className={`flex items-center justify-between p-1 rounded border transition-all text-left cursor-pointer ${
                          selectedDensityTier === 'Moderate'
                            ? 'bg-orange-500 text-white border-orange-400 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-orange-200 dark:border-orange-900/60 text-slate-800 dark:text-slate-200 hover:border-orange-400'
                        }`}
                        title="Filter Woredas with Moderate Density (10–24 cases)"
                      >
                        <div className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-white shrink-0"></span>
                          <span>Moderate</span>
                        </div>
                        <span className="font-mono text-[9px] font-bold">10–24</span>
                      </button>

                      <button
                        onClick={() => setSelectedDensityTier(selectedDensityTier === 'Low' ? 'All' : 'Low')}
                        className={`flex items-center justify-between p-1 rounded border transition-all text-left cursor-pointer ${
                          selectedDensityTier === 'Low'
                            ? 'bg-amber-400 text-slate-900 border-amber-300 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60 text-slate-800 dark:text-slate-200 hover:border-amber-400'
                        }`}
                        title="Filter Woredas with Low Density (1–9 cases)"
                      >
                        <div className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white shrink-0"></span>
                          <span>Low</span>
                        </div>
                        <span className="font-mono text-[9px] font-bold">1–9</span>
                      </button>

                      <button
                        onClick={() => setSelectedDensityTier(selectedDensityTier === 'Zero' ? 'All' : 'Zero')}
                        className={`col-span-2 flex items-center justify-between p-1 rounded border transition-all text-left cursor-pointer ${
                          selectedDensityTier === 'Zero'
                            ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                        }`}
                        title="Filter Woredas with Zero Cases Recorded"
                      >
                        <div className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shrink-0"></span>
                          <span>Zero Cases Recorded (Baseline)</span>
                        </div>
                        <span className="font-mono text-[9px] font-bold">0</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Interactive Disease Marker Toggles */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>Disease Markers (Click to Toggle)</span>
                    </span>
                    <button
                      onClick={handleSelectAllDiseases}
                      className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {enabledDiseases.length === 0 ? 'All Visible' : 'Show All'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {KNOWN_DISEASES.map(d => {
                      const isEnabled = isDiseaseEnabled(d.keyword);
                      const stats = diseaseStats[d.keyword] || { cases: 0, outbreaks: 0 };

                      return (
                        <button
                          key={d.id}
                          onClick={() => handleToggleDiseaseMarker(d.keyword)}
                          className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                            isEnabled
                              ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-2xs hover:border-blue-400'
                              : 'bg-slate-100/60 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-50 grayscale'
                          }`}
                          title={`Toggle ${d.name} Markers on Map (${stats.cases} cases)`}
                        >
                          <div className="flex items-center space-x-1 min-w-0">
                            <span className="text-xs shrink-0">{d.icon}</span>
                            <div className="truncate">
                              <div className="font-bold text-[9.5px] text-slate-900 dark:text-slate-100 truncate">
                                {d.name.split(' ')[0]}
                              </div>
                              <div className="text-[8px] text-slate-500 dark:text-slate-400 font-mono">
                                {stats.cases} cs | {stats.outbreaks} ob
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 ml-1">
                            {isEnabled ? (
                              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: d.color }}></span>
                            ) : (
                              <EyeOff className="w-2.5 h-2.5 text-slate-400" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Zonal Border Outlines Legend */}
                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 space-y-1 text-[10px]">
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[9.5px] uppercase tracking-wider mb-0.5">
                    Woreda Zonal Outlines
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="w-3.5 h-2 rounded-xs bg-sky-500/20 border-2 border-sky-500 shrink-0"></span>
                      <span>East Hararghe (21 Woredas)</span>
                    </span>
                    <span className="font-mono text-[9px] text-sky-600 dark:text-sky-400 font-bold">Cyan</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="w-3.5 h-2 rounded-xs bg-purple-500/20 border-2 border-fuchsia-500 shrink-0"></span>
                      <span>West Hararghe (15 Woredas)</span>
                    </span>
                    <span className="font-mono text-[9px] text-fuchsia-600 dark:text-fuchsia-400 font-bold">Purple</span>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Floating Zoom & Reset Navigation Toolbar */}
          <div className="absolute top-3 right-3 z-10 flex flex-col space-y-1.5 bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-white p-1 rounded-lg border border-slate-300 dark:border-slate-700 shadow-xl backdrop-blur-md">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              title="Reset View to Hararghe Region"
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-emerald-600 dark:text-emerald-400 cursor-pointer border-t border-slate-200 dark:border-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Map Footer Real-Time Telemetry Bar */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between text-[11px] bg-white/95 dark:bg-slate-950/90 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 backdrop-blur-md shadow-xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <span>🇪🇹</span> Ethiopia National
              </span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <span>🗺️</span> Oromia Region
              </span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                <span>📍</span> 36 Woredas
              </span>
            </div>

            <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-600 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>HRVL Hub: N {HIRNA_LAB_COORDS.lat}° E {HIRNA_LAB_COORDS.lng}°</span>
            </div>
          </div>

        </div>

        {/* Telemetry Inspector Panel (Right Side) */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
          
          {selectedOutbreak && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span>{selectedOutbreak.status} Outbreak</span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {selectedOutbreak.outbreakCode}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedOutbreak.disease}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{selectedOutbreak.woreda} Woreda, {selectedOutbreak.zone}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-extrabold">Total Cases</span>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{selectedOutbreak.cases}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-extrabold">Fatalities</span>
                  <p className="text-xl font-black text-rose-600 dark:text-rose-400">{selectedOutbreak.deaths}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-extrabold">Morbidity</span>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">{selectedOutbreak.morbidityRate}%</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-extrabold">CFR Rate</span>
                  <p className="text-xl font-black text-red-600 dark:text-red-400">{selectedOutbreak.cfr}%</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Species Affected:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedOutbreak.speciesAffected.join(', ')}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Quarantine Status:</span>
                  <span className={`font-bold ${selectedOutbreak.quarantineApplied ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {selectedOutbreak.quarantineApplied ? 'Enforced' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Ring Vaccination:</span>
                  <span className={`font-bold ${selectedOutbreak.vaccinationActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                    {selectedOutbreak.vaccinationActive ? 'Active' : 'Not Started'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300 mt-2">
                <div className="flex items-center space-x-1 font-bold mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>HRVL Field Response Status:</span>
                </div>
                Diagnostic samples collected. Epidemiological containment protocol active.
              </div>
            </div>
          )}

          {selectedWoreda && !selectedOutbreak && (
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                Woreda Polygon Telemetry
              </span>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedWoreda.name} Woreda
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Zone: {selectedWoreda.zone} • Est Pop: {selectedWoreda.populationEstimate.toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">GPS Coordinates:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedWoreda.lat}, {selectedWoreda.lng}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Cases Logged:</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {woredaCaseMap[selectedWoreda.name.toLowerCase()] || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Reporting Compliance:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Compliant (100%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Surveillance Telemetry:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {records.filter(r => r.woreda.toLowerCase() === selectedWoreda.name.toLowerCase()).length} Reports Logged
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  mapInstanceRef.current?.flyTo([selectedWoreda.lat, selectedWoreda.lng], 11, { duration: 1.0 });
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Zoom In to {selectedWoreda.name} Woreda Boundary</span>
              </button>
            </div>
          )}

          {!selectedOutbreak && !selectedWoreda && (
            <div className="h-full flex flex-col justify-between p-1 space-y-4">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl p-0.5 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.6)] transform hover:-translate-y-1 transition-all duration-300">
                    <img 
                      src="/hrvl-emblem.png" 
                      alt="HRVL Emblem" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('1B-I4DeFvksl-bfA9KXPemqmEx7efTI8C')) {
                          target.src = 'https://lh3.googleusercontent.com/d/1B-I4DeFvksl-bfA9KXPemqmEx7efTI8C';
                        }
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Hirna Regional Veterinary Lab (HRVL)
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      Central Epidemiology & Diagnostic Hub
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><b>Location:</b> Hirna Town, W/H, Oromia, Ethiopia</span>
                  </div>
                  <div className="flex items-start gap-1.5 font-mono text-[11px]">
                    <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span><b>GPS Coords:</b> {HIRNA_LAB_COORDS.lat}° N, {HIRNA_LAB_COORDS.lng}° E</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Hirna+Regional+Veterinary+Laboratory+Hirna+Oromia+Ethiopia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open HRVL Location on Google Maps ↗</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://www.google.com/maps?q=${HIRNA_LAB_COORDS.lat},${HIRNA_LAB_COORDS.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold rounded-lg text-[11px] transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <span>Google Map Pin</span>
                    </a>

                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Hirna+Regional+Veterinary+Laboratory+Hirna+Oromia+Ethiopia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold rounded-lg text-[11px] transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3 text-amber-500" />
                      <span>Reviews</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center p-3 text-slate-400 bg-slate-100/50 dark:bg-slate-900/40 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                <Info className="w-5 h-5 mx-auto mb-1 opacity-50 text-emerald-500" />
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Click any Woreda polygon boundary or outbreak marker on the map to view detailed GIS field telemetry.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
