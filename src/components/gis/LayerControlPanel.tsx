import React, { useState } from 'react';
import { Layers, ShieldAlert, CloudSun, MapPin, Eye, EyeOff, Info, Check, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { MapLayerVisibilityState } from '../../types/riskMap';

interface LayerControlPanelProps {
  layers: MapLayerVisibilityState;
  onToggleLayer: (layerKey: keyof MapLayerVisibilityState) => void;
  onOpenScientificReferences: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  className?: string;
}

export const LayerControlPanel: React.FC<LayerControlPanelProps> = ({
  layers,
  onToggleLayer,
  onOpenScientificReferences,
  isOpen,
  onToggleOpen,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<'admin' | 'surveillance' | 'risk' | 'weather'>('risk');

  return (
    <div className={`bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl transition-all duration-300 ${className} ${
      isOpen ? 'w-80 sm:w-96 p-4' : 'w-auto p-2'
    }`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onToggleOpen}
          className="flex items-center space-x-2 text-slate-200 hover:text-white font-heading font-bold text-xs cursor-pointer select-none"
        >
          <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
            <Layers className="w-4 h-4" />
          </div>
          {isOpen && (
            <div>
              <span className="text-sm font-extrabold text-white">GIS Layers & Controls</span>
              <p className="text-[10px] text-slate-400 font-normal">Manage decision-support overlays</p>
            </div>
          )}
        </button>

        {isOpen && (
          <div className="flex items-center space-x-1">
            <button
              onClick={onOpenScientificReferences}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="View Scientific Basis & Authoritative References"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleOpen}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {/* Category Tabs */}
          <div className="grid grid-cols-4 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => setActiveCategory('risk')}
              className={`py-1.5 rounded-lg text-center transition-colors cursor-pointer ${
                activeCategory === 'risk'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Risk & Zones
            </button>
            <button
              onClick={() => setActiveCategory('surveillance')}
              className={`py-1.5 rounded-lg text-center transition-colors cursor-pointer ${
                activeCategory === 'surveillance'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Surveillance
            </button>
            <button
              onClick={() => setActiveCategory('weather')}
              className={`py-1.5 rounded-lg text-center transition-colors cursor-pointer ${
                activeCategory === 'weather'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weather
            </button>
            <button
              onClick={() => setActiveCategory('admin')}
              className={`py-1.5 rounded-lg text-center transition-colors cursor-pointer ${
                activeCategory === 'admin'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Boundaries
            </button>
          </div>

          {/* Layer Toggle Items List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-xs">
            {/* 1. Risk & Zones Category */}
            {activeCategory === 'risk' && (
              <div className="space-y-2">
                <LayerToggleItem
                  label="Disease Risk Zones (All)"
                  description="WOAH/FAO evidence-based transmission rings"
                  isActive={layers.diseaseRiskZones}
                  onToggle={() => onToggleLayer('diseaseRiskZones')}
                  color="rose"
                />
                <LayerToggleItem
                  label="Investigation Core Ring"
                  description="Inner protection & quarantine zone (1.5–5 km)"
                  isActive={layers.investigationCore}
                  onToggle={() => onToggleLayer('investigationCore')}
                  color="rose"
                  indent
                />
                <LayerToggleItem
                  label="Surveillance Perimeter"
                  description="Outer monitoring & restriction buffer (5–20 km)"
                  isActive={layers.surveillancePerimeter}
                  onToggle={() => onToggleLayer('surveillancePerimeter')}
                  color="amber"
                  indent
                />
                <LayerToggleItem
                  label="Woreda Morbidity Density"
                  description="Proportional case density gradient rings"
                  isActive={layers.densityHeatmap}
                  onToggle={() => onToggleLayer('densityHeatmap')}
                  color="indigo"
                />
                <LayerToggleItem
                  label="Mortality Heatmap Intensity"
                  description="Hot-spot weighting by recorded animal deaths"
                  isActive={layers.mortalityHeatmap}
                  onToggle={() => onToggleLayer('mortalityHeatmap')}
                  color="purple"
                />
              </div>
            )}

            {/* 2. Surveillance Category */}
            {activeCategory === 'surveillance' && (
              <div className="space-y-2">
                <LayerToggleItem
                  label="Confirmed Outbreaks"
                  description="Laboratory confirmed pathogen clusters"
                  isActive={layers.outbreaksConfirmed}
                  onToggle={() => onToggleLayer('outbreaksConfirmed')}
                  color="rose"
                />
                <LayerToggleItem
                  label="Suspected / Field Reports"
                  description="Active field surveillance signals"
                  isActive={layers.outbreaksSuspected}
                  onToggle={() => onToggleLayer('outbreaksSuspected')}
                  color="amber"
                />
                <LayerToggleItem
                  label="Field Investigation Missions"
                  description="Diagnostic sample collections & rapid tests"
                  isActive={layers.fieldInvestigations}
                  onToggle={() => onToggleLayer('fieldInvestigations')}
                  color="emerald"
                />
                <LayerToggleItem
                  label="Zero-Reporting Baseline Points"
                  description="Validated negative disease returns (Woreda compliance)"
                  isActive={layers.zeroReports}
                  onToggle={() => onToggleLayer('zeroReports')}
                  color="sky"
                />
                <LayerToggleItem
                  label="HRVL Diagnostic Hub"
                  description="Hirna Regional Diagnostic Laboratory center"
                  isActive={layers.hrvlHub}
                  onToggle={() => onToggleLayer('hrvlHub')}
                  color="rose"
                />
              </div>
            )}

            {/* 3. Weather Category */}
            {activeCategory === 'weather' && (
              <div className="space-y-2">
                <LayerToggleItem
                  label="Live Weather Context Layer"
                  description="Real-time meteorological telemetry & humidity"
                  isActive={layers.weatherOverlay}
                  onToggle={() => onToggleLayer('weatherOverlay')}
                  color="sky"
                />
                <LayerToggleItem
                  label="Wind Direction & Velocity Vectors"
                  description="Aerosol plume trajectory reference arrows"
                  isActive={layers.windVectors}
                  onToggle={() => onToggleLayer('windVectors')}
                  color="sky"
                  indent
                />
                <LayerToggleItem
                  label="Regional Temperature Gradient"
                  description="Thermal conditions influencing viral survival"
                  isActive={layers.temperatureContours}
                  onToggle={() => onToggleLayer('temperatureContours')}
                  color="amber"
                  indent
                />
                <LayerToggleItem
                  label="Precipitation & Moisture Radar"
                  description="Vector breeding & spore runoff habitat markers"
                  isActive={layers.precipitationGrid}
                  onToggle={() => onToggleLayer('precipitationGrid')}
                  color="blue"
                  indent
                />
              </div>
            )}

            {/* 4. Administrative Boundaries Category */}
            {activeCategory === 'admin' && (
              <div className="space-y-2">
                <LayerToggleItem
                  label="Ethiopia National Border"
                  description="Official national boundary polygon"
                  isActive={layers.ethiopiaBoundary}
                  onToggle={() => onToggleLayer('ethiopiaBoundary')}
                  color="emerald"
                />
                <LayerToggleItem
                  label="Oromia Regional State"
                  description="Regional jurisdiction boundary"
                  isActive={layers.oromiaBoundary}
                  onToggle={() => onToggleLayer('oromiaBoundary')}
                  color="amber"
                />
                <LayerToggleItem
                  label="East Hararghe Woredas (21)"
                  description="Eastern zonal woreda administrative boundaries"
                  isActive={layers.eastHarargheWoredas}
                  onToggle={() => onToggleLayer('eastHarargheWoredas')}
                  color="sky"
                />
                <LayerToggleItem
                  label="West Hararghe Woredas (15)"
                  description="Western zonal woreda administrative boundaries"
                  isActive={layers.westHarargheWoredas}
                  onToggle={() => onToggleLayer('westHarargheWoredas')}
                  color="fuchsia"
                />
                <LayerToggleItem
                  label="East/West Fracture Line"
                  description="Zonal separation dividing line"
                  isActive={layers.zonalFractureLine}
                  onToggle={() => onToggleLayer('zonalFractureLine')}
                  color="slate"
                />
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Spatial Engine v3.2</span>
            <button
              onClick={onOpenScientificReferences}
              className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
            >
              WOAH/FAO References
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface LayerToggleItemProps {
  label: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
  color?: 'indigo' | 'rose' | 'amber' | 'emerald' | 'sky' | 'fuchsia' | 'purple' | 'blue' | 'slate';
  indent?: boolean;
}

const LayerToggleItem: React.FC<LayerToggleItemProps> = ({
  label,
  description,
  isActive,
  onToggle,
  color = 'indigo',
  indent = false,
}) => {
  return (
    <div
      onClick={onToggle}
      className={`flex items-start justify-between p-2 rounded-xl transition-all cursor-pointer border select-none ${
        indent ? 'ml-3' : ''
      } ${
        isActive
          ? 'bg-slate-800/80 border-slate-700 text-white'
          : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:bg-slate-800/40'
      }`}
    >
      <div className="space-y-0.5 pr-2">
        <div className="flex items-center space-x-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isActive ? 'bg-indigo-400 shadow-xs' : 'bg-slate-600'
            }`}
          />
          <span className="font-bold text-[11px] leading-tight">{label}</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-snug">{description}</p>
      </div>

      <button
        type="button"
        className={`p-1 rounded-lg transition-colors shrink-0 ${
          isActive
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'bg-slate-800 text-slate-500 hover:text-slate-300'
        }`}
      >
        {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
