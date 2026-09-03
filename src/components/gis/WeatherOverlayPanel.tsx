import React, { useState } from 'react';
import { CloudSun, Wind, Droplets, Thermometer, Compass, Calendar, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { LiveWeatherData } from '../../types/riskMap';
import { getWindCompassDirection } from '../../utils/weatherService';

interface WeatherOverlayPanelProps {
  weather: LiveWeatherData | null;
  isLoading: boolean;
  onRefresh: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  className?: string;
}

export const WeatherOverlayPanel: React.FC<WeatherOverlayPanelProps> = ({
  weather,
  isLoading,
  onRefresh,
  isOpen,
  onToggleOpen,
  className = '',
}) => {
  const [showForecast, setShowForecast] = useState(false);

  if (!weather && !isLoading) return null;

  const windCompass = weather ? getWindCompassDirection(weather.windDirection) : 'E';

  return (
    <div className={`bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl transition-all duration-300 text-slate-200 ${className} ${
      isOpen ? 'w-80 sm:w-88 p-4' : 'w-auto p-2'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onToggleOpen}
          className="flex items-center space-x-2 text-slate-200 hover:text-white font-heading font-bold text-xs cursor-pointer select-none"
        >
          <div className="p-1.5 rounded-lg bg-sky-600/30 text-sky-400 border border-sky-500/30">
            <CloudSun className="w-4 h-4" />
          </div>
          {isOpen && (
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-extrabold text-white">Live Meteorological Context</span>
                {weather?.isStaleOrOffline && (
                  <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[9px] font-bold rounded">
                    Climatology
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-normal truncate max-w-[190px]">
                {weather?.locationName || 'Hararghe Regional Zone'}
              </p>
            </div>
          )}
        </button>

        {isOpen && (
          <div className="flex items-center space-x-1">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ${
                isLoading ? 'animate-spin text-sky-400' : ''
              }`}
              title="Refresh Meteorological Telemetry"
            >
              <RefreshCw className="w-3.5 h-3.5" />
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

      {isOpen && weather && (
        <div className="mt-3 space-y-3 text-xs">
          {/* Main Weather Card */}
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-white">{Math.round(weather.temperature)}°C</span>
                <div className="text-[11px] text-slate-400 leading-tight">
                  <p className="font-semibold text-slate-200">{weather.weatherCondition}</p>
                  <p className="text-[10px]">Feels {Math.round(weather.apparentTemperature || weather.temperature)}°C</p>
                </div>
              </div>

              {/* Wind Compass Indicator */}
              <div className="flex items-center space-x-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700/60">
                <div 
                  className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 transition-transform duration-500"
                  style={{ transform: `rotate(${weather.windDirection}deg)` }}
                  title={`Wind heading ${weather.windDirection}° (${windCompass})`}
                >
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div className="text-right text-[10px]">
                  <p className="font-bold text-sky-300 leading-none">{weather.windSpeed} km/h</p>
                  <p className="text-slate-400 text-[9px]">{windCompass} ({weather.windDirection}°)</p>
                </div>
              </div>
            </div>

            {/* Environmental Parameters Grid */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80 text-center">
              <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/50">
                <div className="flex items-center justify-center space-x-1 text-sky-400 text-[10px]">
                  <Droplets className="w-3 h-3" />
                  <span>Humidity</span>
                </div>
                <p className="font-bold text-slate-200 text-xs mt-0.5">{weather.relativeHumidity}%</p>
              </div>

              <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/50">
                <div className="flex items-center justify-center space-x-1 text-blue-400 text-[10px]">
                  <CloudSun className="w-3 h-3" />
                  <span>Precip</span>
                </div>
                <p className="font-bold text-slate-200 text-xs mt-0.5">{weather.precipitation} mm</p>
              </div>

              <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/50">
                <div className="flex items-center justify-center space-x-1 text-amber-400 text-[10px]">
                  <Thermometer className="w-3 h-3" />
                  <span>Pressure</span>
                </div>
                <p className="font-bold text-slate-200 text-xs mt-0.5">{weather.surfacePressure || 820} hPa</p>
              </div>
            </div>
          </div>

          {/* Epidemiological Environmental Context Note */}
          <div className="bg-indigo-950/40 border border-indigo-800/50 p-2.5 rounded-xl space-y-1 text-[11px]">
            <div className="flex items-center space-x-1.5 text-indigo-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Veterinary Context Modifier</span>
            </div>
            <p className="text-slate-300 text-[10px] leading-relaxed">
              {weather.relativeHumidity >= 60 
                ? 'High atmospheric moisture (>60% RH) extends viral aerosol viability for Foot-and-Mouth Disease (FMD) downwind.'
                : 'Dry conditions reduce aerosol survival but favor dust spore dispersal (Anthrax/Blackleg).'}
            </p>
          </div>

          {/* 3-Day Forecast Toggle */}
          {weather.dailyForecast && (
            <div>
              <button
                onClick={() => setShowForecast(prev => !prev)}
                className="w-full flex items-center justify-between p-2 bg-slate-950/60 hover:bg-slate-800/60 rounded-xl border border-slate-800 text-[11px] font-bold text-slate-300 cursor-pointer"
              >
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>3-Day Outlook</span>
                </div>
                {showForecast ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showForecast && (
                <div className="mt-1.5 space-y-1 p-2 bg-slate-950/90 rounded-xl border border-slate-800 text-[10px]">
                  {weather.dailyForecast.time.slice(0, 3).map((day, idx) => (
                    <div key={day} className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0">
                      <span className="font-semibold text-slate-300">
                        {new Date(day).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                      </span>
                      <span className="text-slate-400">
                        {Math.round(weather.dailyForecast?.temperatureMin[idx] || 15)}° / <b className="text-white">{Math.round(weather.dailyForecast?.temperatureMax[idx] || 25)}°C</b>
                      </span>
                      <span className="text-sky-300">
                        Rain: {weather.dailyForecast?.precipitationSum[idx] || 0}mm
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Source Attribution */}
          <div className="text-[9px] text-slate-500 flex items-center justify-between pt-1">
            <span>Source: {weather.source}</span>
            <span>{new Date(weather.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      )}
    </div>
  );
};
