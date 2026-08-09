import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Activity, Flame, ShieldAlert, Layers, Table, Check } from 'lucide-react';
import { Outbreak, SurveillanceRecord } from '../types';
import { HARARGHE_WOREDAS, HIRNA_LAB_COORDS } from '../data/woredas';
import { HARARGHE_WOREDAS_GEOJSON } from '../data/geoData';

interface WoredaReportMapProps {
  records: SurveillanceRecord[];
  outbreaks: Outbreak[];
  className?: string;
  isPrintMode?: boolean;
}

export const WoredaReportMap: React.FC<WoredaReportMapProps> = ({
  records,
  outbreaks,
  className = '',
  isPrintMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'matrix'>('map');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<'All' | 'E/H' | 'W/H'>('All');

  // Compute Woreda-level aggregations
  const woredaStats = HARARGHE_WOREDAS.map(woreda => {
    const woredaLower = woreda.name.toLowerCase();
    const woredaRecords = records.filter(r => r.woreda.toLowerCase() === woredaLower);
    const totalCases = woredaRecords.reduce((acc, r) => acc + (r.cases || 0), 0);
    const totalDeaths = woredaRecords.reduce((acc, r) => acc + (r.deaths || 0), 0);
    const activeOutbreakCount = outbreaks.filter(o => o.woreda.toLowerCase() === woredaLower && o.status === 'Active').length;
    const topDisease = woredaRecords.length > 0 
      ? woredaRecords.sort((a, b) => (b.cases || 0) - (a.cases || 0))[0]?.disease 
      : 'None';

    return {
      ...woreda,
      totalCases,
      totalDeaths,
      activeOutbreakCount,
      topDisease,
      recordCount: woredaRecords.length,
    };
  });

  const filteredWoredas = woredaStats.filter(w => selectedZoneFilter === 'All' || w.zone === selectedZoneFilter);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [9.15, 41.35],
      zoom: 8,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
    });

    mapInstanceRef.current = map;

    // Base Tile Layer (CARTO Voyager / OSM style)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    // Render Woreda GeoJSON polygons
    if (HARARGHE_WOREDAS_GEOJSON) {
      L.geoJSON(HARARGHE_WOREDAS_GEOJSON as any, {
        style: (feature) => {
          const wName = feature?.properties?.name || feature?.properties?.WOREDABAME || '';
          const stats = woredaStats.find(w => w.name.toLowerCase() === wName.toLowerCase());
          const cases = stats?.totalCases || 0;
          const isEast = stats ? stats.zone === 'E/H' : (feature?.properties?.zone === 'E/H' || feature?.properties?.zone === 'East Hararghe');
          const zone = isEast ? 'E/H' : 'W/H';

          let strokeColor = isEast ? '#0284c7' : '#c026d3';
          let fillColor = isEast ? '#0284c7' : '#c026d3';
          let fillOpacity = 0.12;

          if (cases >= 50) {
            fillColor = '#8b5cf6';
            fillOpacity = 0.45;
          } else if (cases >= 25) {
            fillColor = '#dc2626';
            fillOpacity = 0.38;
          } else if (cases >= 10) {
            fillColor = '#ea580c';
            fillOpacity = 0.28;
          } else if (cases > 0) {
            fillColor = '#f59e0b';
            fillOpacity = 0.2;
          }

          return {
            color: strokeColor,
            weight: 3.0,
            fillColor,
            fillOpacity,
          };
        },
        onEachFeature: (feature, layer) => {
          const wName = feature?.properties?.name || feature?.properties?.WOREDABAME || 'Woreda';
          const stats = woredaStats.find(w => w.name.toLowerCase() === wName.toLowerCase());
          const cases = stats?.totalCases || 0;
          const deaths = stats?.totalDeaths || 0;
          const zone = stats?.zone || 'Hararghe';

          layer.bindTooltip(`
            <div style="font-family: sans-serif; padding: 4px 6px; min-width: 140px;">
              <b style="font-size: 11px; color: #0f172a;">📍 ${wName} (${zone})</b>
              <div style="font-size: 10px; color: #475569; margin-top: 3px;">
                Cases: <b style="color: #0369a1;">${cases}</b> | Fatalities: <b style="color: #b91c1c;">${deaths}</b>
              </div>
            </div>
          `, { sticky: true });
        }
      }).addTo(map);
    }

    // Add Woreda Center Disease Density Circles & Markers
    woredaStats.forEach(w => {
      if (w.totalCases > 0 || w.activeOutbreakCount > 0) {
        const radius = Math.min(Math.max(w.totalCases * 250 + 3500, 4500), 18000);
        const color = w.activeOutbreakCount > 0 ? '#dc2626' : w.totalCases >= 30 ? '#ea580c' : '#0284c7';

        // Halo circle
        L.circle([w.lat, w.lng], {
          radius,
          color,
          weight: w.activeOutbreakCount > 0 ? 2 : 1,
          fillColor: color,
          fillOpacity: 0.22,
        }).addTo(map);

        // Custom Marker Pin
        const pinIcon = L.divIcon({
          className: 'custom-report-marker',
          html: `
            <div style="
              background-color: ${color};
              color: white;
              font-size: 9px;
              font-weight: 800;
              font-family: sans-serif;
              padding: 2px 5px;
              border-radius: 9999px;
              border: 1.5px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 3px;
            ">
              <span>${w.name}</span>
              <span style="background: rgba(255,255,255,0.3); padding: 0 3px; border-radius: 4px;">${w.totalCases}</span>
            </div>
          `,
          iconSize: [60, 20],
          iconAnchor: [30, 10],
        });

        const marker = L.marker([w.lat, w.lng], { icon: pinIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 6px; width: 170px;">
            <div style="font-weight: 800; font-size: 12px; color: #0f172a;">${w.name} Woreda</div>
            <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">Zone: ${w.zone}</div>
            <div style="font-size: 11px; font-weight: 700; color: #0284c7;">Total Cases: ${w.totalCases}</div>
            <div style="font-size: 11px; font-weight: 700; color: #dc2626;">Fatalities: ${w.totalDeaths}</div>
            <div style="font-size: 10px; color: #475569; margin-top: 4px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
              Primary Vector: <b>${w.topDisease}</b>
            </div>
          </div>
        `);
      }
    });

    // Add HRVL Lab Hub Pin
    const labIcon = L.divIcon({
      className: 'hrvl-lab-pin',
      html: `
        <div style="
          background-color: #0f172a;
          color: #38bdf8;
          font-size: 10px;
          font-weight: 900;
          font-family: sans-serif;
          padding: 3px 7px;
          border-radius: 6px;
          border: 2px solid #38bdf8;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
          white-space: nowrap;
        ">
          🏥 HRVL LAB HUB
        </div>
      `,
      iconSize: [100, 24],
      iconAnchor: [50, 12],
    });

    L.marker([HIRNA_LAB_COORDS.lat, HIRNA_LAB_COORDS.lng], { icon: labIcon }).addTo(map);

    // Invalidate size after mount
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [records, outbreaks]);

  return (
    <div className={`my-6 font-sans ${className}`}>
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b-2 border-emerald-800">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900">
            Woreda-Level Spatial Disease Surveillance Map & Density Matrix
          </h3>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center space-x-2 print:hidden">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                activeTab === 'map'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                activeTab === 'matrix'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Woreda Matrix</span>
            </button>
          </div>

          <select
            value={selectedZoneFilter}
            onChange={(e) => setSelectedZoneFilter(e.target.value as any)}
            className="text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
          >
            <option value="All">All 36 Woredas</option>
            <option value="E/H">E/H Zone (21 Woredas)</option>
            <option value="W/H">W/H Zone (15 Woredas)</option>
          </select>
        </div>
      </div>

      {/* Main Map / Matrix Body */}
      {activeTab === 'map' ? (
        <div className="space-y-3">
          <div className="relative w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-50 print:border-slate-800 print:shadow-none">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Map Floating Mini Legend */}
            <div className="absolute bottom-3 left-3 z-10 bg-white/95 text-slate-900 p-2.5 rounded-lg border border-slate-300 shadow-lg text-[10px] space-y-1 max-w-[200px]">
              <span className="font-extrabold uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-0.5">
                Disease Density Legend
              </span>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                <div className="flex items-center justify-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  <span>Extreme (&ge;50)</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>High (25–49)</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span>Mod (10–24)</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Low (1–9)</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] font-sans text-slate-500 italic">
            * Interactive Woreda Map displaying epidemiological case density and active outbreak clusters across East Hararghe (21 woredas) and West Hararghe (15 woredas).
          </p>
        </div>
      ) : (
        /* Woreda Density Matrix Table */
        <div className="overflow-x-auto border border-slate-300 rounded-lg">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-2.5 border-b border-r text-center font-bold">Woreda Name</th>
                <th className="p-2.5 border-b border-r text-center font-bold">Zone</th>
                <th className="p-2.5 border-b border-r text-center font-bold">Total Cases</th>
                <th className="p-2.5 border-b border-r text-center font-bold">Fatalities</th>
                <th className="p-2.5 border-b border-r text-center font-bold">Primary Disease</th>
                <th className="p-2.5 border-b text-center font-bold">Active Outbreaks</th>
              </tr>
            </thead>
            <tbody>
              {filteredWoredas.map((w, idx) => (
                <tr key={w.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="p-2.5 border-b border-r font-bold text-slate-900">📍 {w.name}</td>
                  <td className="p-2.5 border-b border-r font-medium text-slate-600">{w.zone}</td>
                  <td className="p-2.5 border-b border-r font-extrabold text-blue-900">{w.totalCases}</td>
                  <td className="p-2.5 border-b border-r font-bold text-rose-700">{w.totalDeaths}</td>
                  <td className="p-2.5 border-b border-r text-slate-800">{w.topDisease}</td>
                  <td className="p-2.5 border-b">
                    {w.activeOutbreakCount > 0 ? (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-extrabold text-[10px] rounded border border-rose-300">
                        {w.activeOutbreakCount} Active
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
