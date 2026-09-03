import React from 'react';
import { ShieldAlert, X, Layers, Compass, Wind, Droplets, Thermometer, CheckCircle2, AlertTriangle, BookOpen, MapPin } from 'lucide-react';
import { Outbreak } from '../../types';
import { LiveWeatherData } from '../../types/riskMap';
import { getDiseaseRiskProfile } from '../../data/diseaseRiskProfiles';

interface RiskZoneDetailModalProps {
  outbreak: Outbreak | null;
  weather: LiveWeatherData | null;
  onClose: () => void;
  onOpenScientificReferences: (diseaseCode: string) => void;
}

export const RiskZoneDetailModal: React.FC<RiskZoneDetailModalProps> = ({
  outbreak,
  weather,
  onClose,
  onOpenScientificReferences,
}) => {
  if (!outbreak) return null;

  const profile = getDiseaseRiskProfile(outbreak.disease);
  const innerKm = profile.innerHighRiskRadiusMeters / 1000;
  const outerKm = profile.outerSurveillanceRadiusMeters / 1000;

  // Environmental modifier calculation
  const isHumid = (weather?.relativeHumidity || 50) >= 60;
  const isHighWind = (weather?.windSpeed || 10) >= 18;
  const isWarm = (weather?.temperature || 22) >= 26;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 text-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-600/30 text-rose-400 rounded-xl border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-white tracking-tight">{outbreak.disease}</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  outbreak.status === 'Active' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {outbreak.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{outbreak.woreda} ({outbreak.zone}) • Outbreak Code: {outbreak.outbreakCode}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Outbreak Snapshot Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Recorded Cases</span>
              <p className="text-base font-black text-sky-400 mt-0.5">{outbreak.cases}</p>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Deaths</span>
              <p className="text-base font-black text-rose-400 mt-0.5">{outbreak.deaths}</p>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Case Fatality</span>
              <p className="text-base font-black text-amber-400 mt-0.5">{outbreak.cfr}%</p>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Susceptible Stock</span>
              <p className="text-base font-black text-emerald-400 mt-0.5">{outbreak.susceptible || 'N/A'}</p>
            </div>
          </div>

          {/* Spatial Zoning Parameters & Scientific Rationale */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5 uppercase">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Evidence-Based Spatial Zoning Specifications</span>
              </h4>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                {profile.evidenceLevel}
              </span>
            </div>

            <div className="space-y-2">
              {/* Inner Ring */}
              <div className="bg-rose-950/20 border border-rose-800/40 p-3 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300">Inner Protection Ring: {innerKm} km</span>
                  <span className="text-[10px] text-slate-400">High-Transmission Core</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {profile.innerZoneLabel}. Mandatory quarantine, strict livestock movement halt, and ring vaccination of susceptible herds.
                </p>
              </div>

              {/* Outer Ring */}
              <div className="bg-amber-950/20 border border-amber-800/40 p-3 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">Outer Surveillance Perimeter: {outerKm} km</span>
                  <span className="text-[10px] text-slate-400">Buffer Monitoring Ring</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {profile.outerZoneLabel}. Active syndromic screening, livestock market surveillance, and movement permits.
                </p>
              </div>
            </div>
          </div>

          {/* Real-time Environmental Context Assessment */}
          {weather && (
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sky-300 flex items-center space-x-1.5 uppercase text-[11px]">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <span>Real-time Environmental Modifier Assessment</span>
                </h4>
                <span className="text-[10px] text-slate-400">
                  {weather.temperature}°C • {weather.relativeHumidity}% RH • {weather.windSpeed} km/h Wind
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-start space-x-2 bg-slate-900/60 p-2 rounded-lg">
                  <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-200">
                      Downwind Dispersion Vector: {weather.windDirection}° ({weather.windSpeed} km/h)
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      {profile.windRelevance === 'Critical' || profile.windRelevance === 'Moderate'
                        ? `Downwind pastures towards the west/southwest should be prioritized for syndromic screening.`
                        : `Wind-borne transmission is not a significant vector for ${profile.name}; primary risk is herd contact.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 bg-slate-900/60 p-2 rounded-lg">
                  <Droplets className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-200">
                      Atmospheric Moisture: {weather.relativeHumidity}% Relative Humidity
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      {isHumid 
                        ? 'Elevated moisture levels favor prolonged viral droplet stability on shared pastures.'
                        : 'Moderate humidity levels reduce airborne aerosol viability over long distances.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transparency & Limitations */}
          <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl space-y-1 text-[11px] text-slate-400">
            <p className="font-bold text-slate-300">Scientific Basis & Model Version:</p>
            <p className="text-[10px] leading-relaxed">
              Based on WOAH Terrestrial Code and FAO Veterinary Epidemiology zoning guidelines. Buffers are decision-support aids for field officers and do not replace laboratory diagnostics and local ground verification.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenScientificReferences(profile.code);
            }}
            className="flex items-center space-x-1.5 text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>View Full WOAH/FAO Citations</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
