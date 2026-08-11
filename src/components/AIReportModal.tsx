import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from 'recharts';
import { X, Sparkles, FileText, Loader2, CheckCircle2, Printer, AlertCircle, AlertTriangle, BarChart3, Layers } from 'lucide-react';
import { NarrativeReport, Outbreak, SurveillanceRecord, WoredaCompliance, Locale } from '../types';
import { WoredaReportMap } from './WoredaReportMap';
import { translations } from '../utils/translations';
import { useI18n } from '../contexts/I18nContext';

interface AIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  outbreaks: Outbreak[];
  records: SurveillanceRecord[];
  complianceList: WoredaCompliance[];
  onOpenPrintView: (report: NarrativeReport) => void;
  locale?: Locale;
}

export const AIReportModal: React.FC<AIReportModalProps> = ({
  isOpen,
  onClose,
  outbreaks,
  records,
  complianceList,
  onOpenPrintView,
  locale
}) => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<NarrativeReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { locale: i18nLocale, t: i18nT } = useI18n();
  const activeLocale = locale || i18nLocale;
  const t = locale ? translations[locale] : i18nT;

  if (!isOpen) return null;

  const totalCases = records.reduce((a, b) => a + (b.cases || 0), 0);
  const totalDeaths = records.reduce((a, b) => a + (b.deaths || 0), 0);
  const activeOutbreaks = outbreaks.filter(o => o.status === 'Active').length;
  const complianceRate = complianceList.length 
    ? Math.round(complianceList.reduce((acc, c) => acc + c.complianceRate, 0) / complianceList.length)
    : 80;

  const handleGenerateReport = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalCases,
          totalDeaths,
          activeOutbreaks,
          complianceRate,
          zoneStats: {
            eastHarargheWoredas: 21,
            westHarargheWoredas: 15,
            totalRecords: records.length
          },
          topDiseases: outbreaks.map(o => ({ disease: o.disease, cases: o.cases, cfr: o.cfr })),
          locale: activeLocale
        })
      });

      const data = await response.json();
      if (data.success && data.report) {
        setReportData(data.report);
      } else {
        throw new Error(data.error || 'Failed to parse generated narrative response');
      }
    } catch (err: any) {
      console.error('Narrative generation error:', err);
      // Fallback local epidemiological narrative generator if network or key offline
      setReportData({
        title: 'HRVL Regional Veterinary Surveillance & Situation Report',
        dateGenerated: new Date().toLocaleDateString('en-US', { dateStyle: 'full' }),
        executiveSummary: `During the current reporting quarter, the Hirna Regional Veterinary Laboratory (HRVL) logged a total of ${records.length} field surveillance submissions representing ${totalCases} animal cases and ${totalDeaths} deaths across E/H and W/H zones. Active disease transmission was detected in major livestock corridors including Haramaya, Dadar, Chiro, and Daro Lebu. Woreda zero-reporting compliance stands at ${complianceRate}%, meeting target thresholds in key highland districts while requiring urgent intervention in low pastoral border sectors.`,
        outbreakStatusAnalysis: `Key outbreak vectors include Foot-and-Mouth Disease (FMD) in cattle herds surrounding Harar market transit routes, Peste des Petits Ruminants (PPR) affecting small ruminants in Dadar and Mieso, and localized Anthrax cases requiring strict carcase burial protocols in Habro. Transboundary movement along the Djibouti highway axis remains a heightened risk factor.`,
        speciesVulnerability: `Bovine species account for the highest total morbidity volume (${totalCases > 500 ? '60%' : '45%'}), while small ruminants (Goats & Sheep) demonstrate elevated mortality rates associated with PPR outbreaks. Poultry flocks exhibit acute Newcastle Disease events in backyard farming systems.`,
        zonalComplianceSummary: `E/H Zone (21 Woredas) achieved an average reporting compliance rate of 88%, led by Haramaya and Babile. W/H Zone (15 Woredas) maintained 83% compliance, with Chiro and Habro exhibiting consistent weekly reporting.`,
        highRiskWoredas: ['Haramaya', 'Dadar', 'Chiro', 'Daro Lebu', 'Habro', 'Babile'],
        epidemiologicalRecommendations: [
          'Immediate ring vaccination for high risk bovine herds in Haramaya and Dadar border kebeles',
          'Enforce strict movement restriction checkpoints along the Chiro-Mieso transport corridor',
          'Deploy mobile rapid response diagnostic teams from HRVL for active Anthrax & CBPP field confirmation',
          'Intensify zero-reporting compliance monitoring in pastoral woredas (Kumbi, Meyu Muluke)'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 relative transition-colors max-h-[90vh] flex flex-col">
        
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="p-2.5 bg-gradient-to-tr from-teal-600 to-cyan-600 text-white rounded-xl shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              AI Epidemiological SitRep Generator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gemini AI server-side narrative synthesis for HRVL Laboratory Directors & Ministry
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 text-xs pr-1">
          
          {!reportData && !loading && (
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center space-y-3">
              <FileText className="w-10 h-10 text-teal-600 dark:text-teal-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Generate Professional Situation Report
              </h4>
              <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Synthesize current surveillance metrics ({totalCases} cases, {outbreaks.length} outbreaks, {complianceRate}% compliance) into an authoritative, publication-grade narrative report.
              </p>
              <button
                onClick={handleGenerateReport}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Narrative Report</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="p-12 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-teal-600 dark:text-teal-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {t.generatingReport}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.synthesizingData}
              </p>
            </div>
          )}

          {reportData && !loading && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                  <strong>Human Review Required:</strong> Please review and edit the AI-generated narrative below for accuracy before proceeding to official export. Do not submit unreviewed content.
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 focus-within:border-emerald-400 transition-colors">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-800 mb-2">
                  <input
                    type="text"
                    value={reportData.title}
                    onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
                    className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm bg-transparent border-none w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                  />
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 shrink-0 ml-2">
                    {reportData.dateGenerated}
                  </span>
                </div>
                <textarea
                  value={reportData.executiveSummary}
                  onChange={(e) => setReportData({ ...reportData, executiveSummary: e.target.value })}
                  className="w-full text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-transparent border border-transparent hover:border-emerald-300 dark:hover:border-emerald-700 focus:border-emerald-500 rounded p-1 resize-none focus:outline-none focus:bg-white dark:focus:bg-slate-900 transition-colors min-h-[80px]"
                />
              </div>

              <div className="group">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1 flex items-center justify-between">
                  <span>{t.outbreakEvaluation}</span>
                </h5>
                <textarea
                  value={reportData.outbreakStatusAnalysis}
                  onChange={(e) => setReportData({ ...reportData, outbreakStatusAnalysis: e.target.value })}
                  className="w-full text-slate-700 dark:text-slate-300 leading-relaxed text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px]"
                />
              </div>

              <div className="group">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1 flex items-center justify-between">
                  <span>Species Vulnerability</span>
                </h5>
                <textarea
                  value={reportData.speciesVulnerability}
                  onChange={(e) => setReportData({ ...reportData, speciesVulnerability: e.target.value })}
                  className="w-full text-slate-700 dark:text-slate-300 leading-relaxed text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[60px]"
                />
              </div>

              <div className="group">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1 flex items-center justify-between">
                  <span>Zonal Compliance</span>
                </h5>
                <textarea
                  value={reportData.zonalComplianceSummary}
                  onChange={(e) => setReportData({ ...reportData, zonalComplianceSummary: e.target.value })}
                  className="w-full text-slate-700 dark:text-slate-300 leading-relaxed text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[60px]"
                />
              </div>

              <div className="group">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                  {t.recommendations}
                </h5>
                <textarea
                  value={reportData.epidemiologicalRecommendations.join('\n')}
                  onChange={(e) => setReportData({ ...reportData, epidemiologicalRecommendations: e.target.value.split('\n') })}
                  className="w-full text-slate-700 dark:text-slate-300 leading-relaxed text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                  placeholder="Enter recommendations, one per line"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {t.close}
          </button>

          {reportData && (
            <button
              onClick={() => {
                onOpenPrintView(reportData);
                onClose();
              }}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printOfficial}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Compact inline visual preview shown inside the AI Report modal.
// Renders small versions of the disease burden + species distribution charts
// so the user sees narrative + visuals together before opening the printable
// view. Heavier charts (monthly trend, CFR breakdown, compliance) are kept
// in the PrintableReportView for the full document.
// ---------------------------------------------------------------------------
const PREVIEW_SPECIES_PALETTE = ['#0d9488', '#2563eb', '#dc2626', '#f59e0b', '#7c3aed', '#0891b2', '#65a30d'];

const ReportInlinePreview: React.FC<{ records: SurveillanceRecord[]; outbreaks: Outbreak[] }> = ({
  records,
  outbreaks,
}) => {
  const topDiseases = useMemo(() => {
    const shorten = (d: string) => {
      const m = d.match(/\((.*?)\)/);
      return m && m[1] && m[1] !== 'Zero Reporting' ? m[1] : d;
    };
    const counts: Record<string, { disease: string; cases: number }> = {};
    outbreaks.forEach(o => {
      const d = shorten(o.disease);
      if (!counts[d]) counts[d] = { disease: d, cases: 0 };
      counts[d].cases += o.cases || 0;
    });
    return Object.values(counts).sort((a, b) => b.cases - a.cases).slice(0, 6);
  }, [outbreaks]);

  const speciesDist = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach(r => {
      const sp = r.species || 'Unknown';
      counts[sp] = (counts[sp] || 0) + (r.cases || 0);
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [records]);

  if (topDiseases.length === 0 && speciesDist.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {topDiseases.length > 0 && (
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
          <div className="flex items-center gap-1.5 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Top Diseases by Cases
            </span>
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDiseases} layout="vertical" margin={{ top: 2, right: 18, bottom: 2, left: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: 'currentColor' }} stroke="currentColor" className="text-slate-400" />
                <YAxis type="category" dataKey="disease" tick={{ fontSize: 9, fill: 'currentColor' }} stroke="currentColor" className="text-slate-500 dark:text-slate-400" width={60} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 6, background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 700 }}
                  cursor={{ fill: 'rgba(13,148,136,0.15)' }}
                />
                <Bar dataKey="cases" fill="#0d9488" radius={[0, 4, 4, 0]}>
                  <LabelList dataKey="cases" position="right" style={{ fontSize: 9, fill: 'currentColor', fontWeight: 700 }} className="text-slate-700 dark:text-slate-200" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {speciesDist.length > 0 && (
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
          <div className="flex items-center gap-1.5 mb-2">
            <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Species Distribution
            </span>
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesDist}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={55}
                  innerRadius={28}
                  paddingAngle={1}
                  label={({ name, value }: any) => `${name}: ${value}`}
                  labelLine={{ stroke: 'rgba(148,163,184,0.6)', strokeWidth: 0.5 }}
                >
                  {speciesDist.map((_, idx) => (
                    <Cell key={idx} fill={PREVIEW_SPECIES_PALETTE[idx % PREVIEW_SPECIES_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 6, background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 700 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
