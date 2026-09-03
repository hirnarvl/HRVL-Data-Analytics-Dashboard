import React from 'react';
import { Compass, Globe, MapPin, ChevronRight, Home, Building2, ShieldAlert } from 'lucide-react';
import { GeoLocationExtent } from '../../types/riskMap';
import { ALL_GEO_EXTENTS, NATIONAL_EXTENT, OROMIA_EXTENT, EAST_HARARGHE_EXTENT, WEST_HARARGHE_EXTENT, HARARGHE_REGIONAL_EXTENT, HRVL_HUB_EXTENT } from '../../data/geoHierarchy';
import { HARARGHE_WOREDAS } from '../../data/woredas';

interface GeoHierarchyNavProps {
  currentExtentId: string;
  onSelectExtent: (extent: GeoLocationExtent) => void;
  onResetHome: () => void;
  currentZoom: number;
  centerCoords: [number, number];
  isFullScreen?: boolean;
}

export const GeoHierarchyNav: React.FC<GeoHierarchyNavProps> = ({
  currentExtentId,
  onSelectExtent,
  onResetHome,
  currentZoom,
  centerCoords,
  isFullScreen = false,
}) => {
  const selectedExtent = ALL_GEO_EXTENTS.find(e => e.id === currentExtentId) || HARARGHE_REGIONAL_EXTENT;

  return (
    <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-700/70 text-slate-200 rounded-xl p-2.5 shadow-xl flex flex-wrap items-center justify-between gap-2.5 text-xs">
      
      {/* Quick Extent Jump Buttons */}
      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
        <button
          onClick={onResetHome}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            selectedExtent.id === 'hararghe_all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Zoom to Hararghe Operational Focus (36 Woredas)"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Hararghe Area</span>
        </button>

        <button
          onClick={() => onSelectExtent(NATIONAL_EXTENT)}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedExtent.id === 'ethiopia'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Level 1: Ethiopia National Extent"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ethiopia</span>
        </button>

        <button
          onClick={() => onSelectExtent(OROMIA_EXTENT)}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedExtent.id === 'oromia'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Level 2: Oromia Regional State"
        >
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Oromia</span>
        </button>

        <button
          onClick={() => onSelectExtent(EAST_HARARGHE_EXTENT)}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedExtent.id === 'east_hararghe'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Level 3: East Hararghe Zone (21 Woredas)"
        >
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          <span>East Hararghe</span>
        </button>

        <button
          onClick={() => onSelectExtent(WEST_HARARGHE_EXTENT)}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedExtent.id === 'west_hararghe'
              ? 'bg-fuchsia-600 text-white shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Level 3: West Hararghe Zone (15 Woredas)"
        >
          <span className="w-2 h-2 rounded-full bg-fuchsia-400"></span>
          <span>West Hararghe</span>
        </button>

        <button
          onClick={() => onSelectExtent(HRVL_HUB_EXTENT)}
          className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedExtent.id === 'hrvl_hub'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-rose-300'
          }`}
          title="Level 5: Hirna Regional Diagnostic Laboratory Hub"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>HRVL Hub</span>
        </button>
      </div>

      {/* Woreda Selector Dropdown (Level 4) */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <select
            value={selectedExtent.id.startsWith('woreda_') ? selectedExtent.id : ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                const found = ALL_GEO_EXTENTS.find(ext => ext.id === val);
                if (found) onSelectExtent(found);
              }
            }}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-hidden cursor-pointer max-w-[140px] sm:max-w-[170px]"
          >
            <option value="" className="bg-slate-900 text-slate-400">Select Woreda (36)...</option>
            <optgroup label="East Hararghe (21 Woredas)" className="bg-slate-900 text-sky-300 font-bold">
              {HARARGHE_WOREDAS.filter(w => w.zone === 'E/H').map(w => (
                <option key={w.id} value={`woreda_${w.id}`} className="bg-slate-900 text-slate-200">
                  {w.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="West Hararghe (15 Woredas)" className="bg-slate-900 text-fuchsia-300 font-bold">
              {HARARGHE_WOREDAS.filter(w => w.zone === 'W/H').map(w => (
                <option key={w.id} value={`woreda_${w.id}`} className="bg-slate-900 text-slate-200">
                  {w.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Live Coordinate & Zoom Telemetry */}
        <div className="hidden md:flex items-center space-x-2 text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
          <Compass className="w-3 h-3 text-indigo-400 animate-spin-slow" />
          <span>{centerCoords[0].toFixed(3)}°N, {centerCoords[1].toFixed(3)}°E</span>
          <span className="text-slate-600">|</span>
          <span>Zoom: <b className="text-indigo-300">{currentZoom}</b></span>
        </div>
      </div>
    </div>
  );
};
