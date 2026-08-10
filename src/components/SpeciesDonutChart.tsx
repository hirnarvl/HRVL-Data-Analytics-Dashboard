import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Layers } from 'lucide-react';
import { GiCow, GiGoat, GiSheep, GiChicken, GiHorseHead, GiCamel, GiPig } from 'react-icons/gi';
import { SPECIES_DISTRIBUTION } from '../data/sampleData';
import { Locale } from '../types';
import { translations } from '../utils/translations';
import { useI18n } from '../contexts/I18nContext';

interface SpeciesDonutChartProps {
  darkMode: boolean;
  locale?: Locale;
}

// Custom Infographic Animal Vector Icons for 7 Livestock Species
const SpeciesIcons: Record<string, React.FC<{ className?: string }>> = {
  Cattle: ({ className }) => React.createElement(GiCow, { className }),
  Goats: ({ className }) => React.createElement(GiGoat, { className }),
  Sheep: ({ className }) => React.createElement(GiSheep, { className }),
  Poultry: ({ className }) => React.createElement(GiChicken, { className }),
  Equines: ({ className }) => React.createElement(GiHorseHead, { className }),
  Camels: ({ className }) => React.createElement(GiCamel, { className }),
  'Swine / Others': ({ className }) => React.createElement(GiPig, { className })
};

export const SpeciesDonutChart: React.FC<SpeciesDonutChartProps> = ({ darkMode, locale }) => {
  const { locale: i18nLocale, t: i18nT } = useI18n();
  const t = locale ? translations[locale] : i18nT;
  const totalCases = SPECIES_DISTRIBUTION.reduce((acc, curr) => acc + curr.cases, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 transition-colors flex flex-col justify-between">
      
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.speciesDistributionTitle}</h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {t.speciesTotal} {totalCases.toLocaleString()}
        </span>
      </div>

      <div className="h-60 w-full mt-2 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={SPECIES_DISTRIBUTION}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="cases"
            >
              {SPECIES_DISTRIBUTION.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={darkMode ? '#0f172a' : '#ffffff'} strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                borderColor: darkMode ? '#334155' : '#cbd5e1',
                borderRadius: '0.5rem',
                color: darkMode ? '#ffffff' : '#0f172a',
                fontSize: '12px',
                fontWeight: '600'
              }}
              formatter={(value: any, name: any) => [`${value} cases (${((value / totalCases) * 100).toFixed(1)}%)`, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Donut Label */}
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xl font-black text-slate-900 dark:text-white">{totalCases.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">{t.speciesTotalCases}</span>
        </div>
      </div>

      {/* Compact Infographic Legend List with direct key-value alignment (No wide empty gaps) */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        {SPECIES_DISTRIBUTION.map(s => {
          const IconComp = SpeciesIcons[s.name] || SpeciesIcons['Cattle'];
          const pct = ((s.cases / totalCases) * 100).toFixed(1);
          return (
            <div 
              key={s.name} 
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <div 
                className="p-1 rounded-md flex items-center justify-center shrink-0" 
                style={{ backgroundColor: `${s.color}18`, color: s.color }}
                title={s.name}
              >
                <IconComp className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center space-x-1 min-w-0">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {s.name}:
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white shrink-0">
                  {s.cases.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium shrink-0">
                  ({pct}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

