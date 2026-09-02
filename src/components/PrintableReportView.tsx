import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LabelList,
  Legend
} from 'recharts';
import { Activity, Printer, Download, ShieldCheck, MapPin, ArrowLeft, TrendingUp, Layers, AlertTriangle, BarChart3 } from 'lucide-react';
import { NarrativeReport, Outbreak, SurveillanceRecord, WoredaCompliance } from '../types';
import { WoredaReportMap } from './WoredaReportMap';
import { useI18n } from '../contexts/I18nContext';


const shortenDisease = (disease: string) => {
  if (!disease) return '';
  const match = disease.match(/\((.*?)\)/);
  if (match && match[1]) {
    if (match[1] === 'Zero Reporting') return 'None';
    return match[1];
  }
  return disease;
};


interface PrintableReportViewProps {
  report: NarrativeReport;
  outbreaks: Outbreak[];
  records: SurveillanceRecord[];
  complianceList?: WoredaCompliance[];
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Chart palette — chosen to print well on white paper.
// Force color-adjust:exact so browsers preserve these hues when printing.
// ---------------------------------------------------------------------------
const CHART_COLORS = {
  cases: '#0d9488',      // teal-600
  deaths: '#be123c',     // rose-700
  cfr: '#dc2626',        // red-600
  compliance: '#16a34a', // green-600
  grid: '#e2e8f0',       // slate-200
  axis: '#475569',       // slate-600
};

const SPECIES_PALETTE = [
  '#0d9488', '#2563eb', '#dc2626', '#f59e0b',
  '#7c3aed', '#0891b2', '#65a30d',
];

// ---------------------------------------------------------------------------
// Derived datasets — all computed with useMemo from records + outbreaks.
// ---------------------------------------------------------------------------
function useReportChartData(records: SurveillanceRecord[], outbreaks: Outbreak[], complianceList?: WoredaCompliance[]) {
  const monthlyTrend = useMemo(() => {
    const buckets: Record<string, { month: string; cases: number; deaths: number; ts: number }> = {};
    records.forEach(r => {
      const d = new Date(r.timestamp || r.date);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!buckets[key]) buckets[key] = { month: label, cases: 0, deaths: 0, ts: d.getTime() };
      buckets[key].cases += r.cases || 0;
      buckets[key].deaths += r.deaths || 0;
    });
    return Object.values(buckets).sort((a, b) => a.ts - b.ts).slice(-12);
  }, [records]);

  const speciesDistribution = useMemo(() => {
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

  const topDiseases = useMemo(() => {
    const counts: Record<string, { disease: string; cases: number; deaths: number }> = {};
    outbreaks.forEach(o => {
      const d = shortenDisease(o.disease);
      if (!counts[d]) counts[d] = { disease: d, cases: 0, deaths: 0 };
      counts[d].cases += o.cases || 0;
      counts[d].deaths += o.deaths || 0;
    });
    return Object.values(counts).sort((a, b) => b.cases - a.cases).slice(0, 8);
  }, [outbreaks]);

  const cfrByDisease = useMemo(() => {
    return outbreaks
      .map(o => ({
        disease: shortenDisease(o.disease),
        cfr: o.cfr || 0,
        cases: o.cases || 0,
      }))
      .sort((a, b) => b.cfr - a.cfr)
      .slice(0, 8);
  }, [outbreaks]);

  const zoneCompliance = useMemo(() => {
    if (!complianceList || complianceList.length === 0) return [];
    const byZone: Record<string, { zone: string; compliance: number; count: number }> = {};
    complianceList.forEach(c => {
      const z = c.zone || 'Unknown';
      if (!byZone[z]) byZone[z] = { zone: z, compliance: 0, count: 0 };
      byZone[z].compliance += c.complianceRate || 0;
      byZone[z].count += 1;
    });
    return Object.values(byZone).map(b => ({
      zone: b.zone,
      compliance: b.count ? Math.round(b.compliance / b.count) : 0,
    }));
  }, [complianceList]);

  return { monthlyTrend, speciesDistribution, topDiseases, cfrByDisease, zoneCompliance };
}


export const PrintableReportView: React.FC<PrintableReportViewProps> = ({
  report,
  outbreaks,
  records,
  complianceList,
  onBack
}) => {
  const { t } = useI18n();
  const handlePrint = () => {
    window.print();
  };

  const activeOutbreaks = outbreaks.filter(o => o.status === 'Active');
  const totalCases = records.reduce((a, b) => a + (b.cases || 0), 0);
  const totalDeaths = records.reduce((a, b) => a + (b.deaths || 0), 0);

  const { monthlyTrend, speciesDistribution, topDiseases, cfrByDisease, zoneCompliance } =
    useReportChartData(records, outbreaks, complianceList);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-8">
      
      {/* Printable Control Bar (Hidden when printing) */}
      <div className="print:hidden max-w-4xl mx-auto mb-6 flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Official Printable Report Document Body */}
      <div className="report-document max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-12 shadow-xl border border-slate-300 rounded-none font-serif leading-relaxed text-sm print:shadow-none print:border-none print:p-0 print:max-w-none">
        
        
        {/* Report Official Banner */}
        <div className="w-full h-32 md:h-40 overflow-hidden mb-6 print:rounded-none print:border-none print:shadow-none flex items-center justify-center">
          <img 
            src="https://lh3.googleusercontent.com/d/1LzxKTsj6b4TO1aIyI-tAddDsR5QMYYom" 
            alt="HRVL Banner" 
            referrerPolicy="no-referrer"
            className="h-24 md:h-32 object-contain  filter drop-shadow-md"
          />
        </div>

        {/* Document Header Seal */}
        <div className="flex items-center justify-between border-b-2 border-emerald-800 pb-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 flex items-center justify-center shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/d/1LzxKTsj6b4TO1aIyI-tAddDsR5QMYYom" 
                alt="HRVL Emblem" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain " 
              />
            </div>
            <div>
              <h1 className="text-xl font-black text-emerald-950 tracking-tight uppercase">
                HIRNA REGIONAL VETERINARY LABORATORY
              </h1>
              <h2 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mt-0.5">
                Oromia Agricultural Bureau • Disease Surveillance & Epidemiology Division
              </h2>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                Operational Area: E/H (21 Woredas) & W/H (15 Woredas)
              </p>
            </div>
          </div>

          <div className="text-right font-sans text-xs">
            <span className="font-bold text-slate-900 block">REPORT REF: HRVL-EPI-2026</span>
            <span className="text-slate-600 font-mono block mt-1">{report.dateGenerated}</span>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider rounded border border-emerald-300">
              OFFICIAL SITUATION REPORT
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight border-l-4 border-emerald-700 pl-3 py-1">
            {report.title}
          </h2>
          <p className="text-xs font-sans text-slate-600 mt-1 pl-4">
            Surveillance Telemetry & Outbreak Situation Analysis across 36 Target Woredas
          </p>
        </div>

        {/* Executive Metrics Bar */}
        <div className="font-sans grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-300 mb-8 text-center text-xs">
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold block">Total Cases</span>
            <span className="text-xl font-black text-slate-900">{totalCases.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold block">Total Fatalities</span>
            <span className="text-xl font-black text-rose-700">{totalDeaths.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold block">Active Outbreaks</span>
            <span className="text-xl font-black text-amber-700">{activeOutbreaks.length}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold block">Target Woredas</span>
            <span className="text-xl font-black text-emerald-800">36 Woredas</span>
          </div>
        </div>

        {/* ====================================================================
            SECTION 1 — Executive Summary (narrative) + Monthly trend chart
            ==================================================================== */}
        <div className="mb-8 report-section">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-300 pb-1 mb-3 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            1. Executive Summary & Surveillance Telemetry
          </h3>
          <p className="text-slate-800 text-justify whitespace-pre-line leading-relaxed">
            {report.executiveSummary}
          </p>

          {/* Monthly cases trend chart */}
          {monthlyTrend.length > 0 && (
            <div className="font-sans mt-5 p-4 border border-slate-300 rounded-lg bg-white report-chart">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                  Monthly Cases & Fatalities Trend
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Last {monthlyTrend.length} months</span>
              </div>
              <div className="w-full" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: CHART_COLORS.axis }} stroke={CHART_COLORS.axis} />
                    <YAxis tick={{ fontSize: 10, fill: CHART_COLORS.axis }} stroke={CHART_COLORS.axis} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ fontSize: 11, fontFamily: 'sans-serif', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      labelStyle={{ fontWeight: 700, color: '#0f172a' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="cases" name="Cases" stroke={CHART_COLORS.cases} strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="deaths" name="Deaths" stroke={CHART_COLORS.deaths} strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* ====================================================================
            SECTION 2 — Outbreak Dynamics (narrative + table + charts + map)
            ==================================================================== */}
        <div className="mb-8 report-section">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-300 pb-1 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            2. Active Field Outbreak Evaluation
          </h3>
          <p className="text-slate-800 text-justify mb-4">
            {report.outbreakStatusAnalysis}
          </p>

          {/* Outbreak Summary Table */}
          <div className="font-sans overflow-x-auto my-3">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="p-2 border text-center font-bold">Code</th>
                  <th className="p-2 border text-center font-bold">Disease</th>
                  <th className="p-2 border text-center font-bold">Woreda / Zone</th>
                  <th className="p-2 border text-center font-bold">Cases</th>
                  <th className="p-2 border text-center font-bold">Deaths</th>
                  <th className="p-2 border text-center font-bold">CFR %</th>
                  <th className="p-2 border text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {outbreaks.map((ob, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2 border font-mono">{ob.outbreakCode}</td>
                    <td className="p-2 border font-bold">{shortenDisease(ob.disease)}</td>
                    <td className="p-2 border">{ob.woreda} ({ob.zone})</td>
                    <td className="p-2 border font-bold">{ob.cases}</td>
                    <td className="p-2 border text-rose-700 font-bold">{ob.deaths}</td>
                    <td className="p-2 border font-bold">{ob.cfr}%</td>
                    <td className="p-2 border font-semibold">{ob.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top diseases by cases + CFR by disease — side by side */}
          {topDiseases.length > 0 && (
            <div className="font-sans grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 border border-slate-300 rounded-lg bg-white report-chart">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                  <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
                  Top Diseases by Case Burden
                </h4>
                <div className="w-full" style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topDiseases} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: CHART_COLORS.axis }} stroke={CHART_COLORS.axis} allowDecimals={false} />
                      <YAxis type="category" dataKey="disease" tick={{ fontSize: 10, fill: CHART_COLORS.axis }} stroke={CHART_COLORS.axis} width={70} />
                      <Tooltip
                        contentStyle={{ fontSize: 11, fontFamily: 'sans-serif', borderRadius: 6, border: '1px solid #cbd5e1' }}
                        labelStyle={{ fontWeight: 700, color: '#0f172a' }}
                      />
                      <Bar dataKey="cases" name="Cases" fill={CHART_COLORS.cases} radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="cases" position="right" style={{ fontSize: 10, fill: '#0f172a', fontWeight: 700 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 border border-slate-300 rounded-lg bg-white report-chart">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Case Fatality Rate (CFR) by Disease
                </h4>
                <div className="w-full" style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cfrByDisease} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: CHART_COLORS.axis }} stroke={CHART_COLORS.axis} unit="%" allowDecimals={false} />
                      <YAxis type="category" dataKey="disease" tick={{ fontSize: 10, fill: CHART_COLORS.axis }} stroke={CHART_COLORS.axis} width={70} />
                      <Tooltip
                        contentStyle={{ fontSize: 11, fontFamily: 'sans-serif', borderRadius: 6, border: '1px solid #cbd5e1' }}
                        labelStyle={{ fontWeight: 700, color: '#0f172a' }}
                        formatter={(v: any) => [`${v}%`, 'CFR']}
                      />
                      <Bar dataKey="cfr" name="CFR %" fill={CHART_COLORS.cfr} radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="cfr" position="right" formatter={(v: any) => `${v}%`} style={{ fontSize: 10, fill: '#0f172a', fontWeight: 700 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Woreda-level Map Overlay */}
          <WoredaReportMap records={records} outbreaks={outbreaks} isPrintMode={true} />
        </div>

        {/* ====================================================================
            SECTION 3 — Species Vulnerability + Compliance (narrative + visuals)
            ==================================================================== */}
        <div className="mb-8 report-section">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-300 pb-1 mb-3 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            3. Species Vulnerability & Zonal Compliance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
            <div className="p-4 bg-slate-50 border border-slate-300 rounded">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                Species Vulnerability Profile
              </h4>
              <p className="text-slate-700 text-xs leading-normal">
                {report.speciesVulnerability}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-300 rounded">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                High Risk Priority Woredas
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {report.highRiskWoredas.map((w, idx) => (
                  <span key={idx} className="px-2 py-1 bg-red-100 text-red-900 text-xs font-bold rounded border border-red-300">
                    📍 {w}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Zonal Compliance narrative + bar chart */}
          <p className="text-slate-800 text-justify mt-4 mb-3">
            {report.zonalComplianceSummary}
          </p>

          {zoneCompliance.length > 0 && (
            <div className="font-sans p-4 border border-slate-300 rounded-lg bg-white report-chart">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                Average Woreda Compliance Rate by Zone
              </h4>
              <div className="w-full" style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zoneCompliance} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                    <XAxis dataKey="zone" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} stroke={CHART_COLORS.axis} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: CHART_COLORS.axis }} stroke={CHART_COLORS.axis} unit="%" />
                    <Tooltip
                      contentStyle={{ fontSize: 11, fontFamily: 'sans-serif', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      labelStyle={{ fontWeight: 700, color: '#0f172a' }}
                      formatter={(v: any) => [`${v}%`, 'Compliance']}
                    />
                    <Bar dataKey="compliance" name="Compliance %" fill={CHART_COLORS.compliance} radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="compliance" position="top" formatter={(v: any) => `${v}%`} style={{ fontSize: 11, fill: '#0f172a', fontWeight: 700 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Species distribution donut chart */}
          {speciesDistribution.length > 0 && (
            <div className="font-sans p-4 border border-slate-300 rounded-lg bg-white report-chart mt-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Species Distribution of Total Cases
              </h4>
              <div className="w-full" style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={speciesDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={42}
                      paddingAngle={1}
                      label={({ name, value }: any) => `${name}: ${value}`}
                      labelLine={{ stroke: '#94a3b8', strokeWidth: 0.5 }}
                    >
                      {speciesDistribution.map((_, idx) => (
                        <Cell key={idx} fill={SPECIES_PALETTE[idx % SPECIES_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ fontSize: 11, fontFamily: 'sans-serif', borderRadius: 6, border: '1px solid #cbd5e1' }}
                      labelStyle={{ fontWeight: 700, color: '#0f172a' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* ====================================================================
            SECTION 4 — Actionable Recommendations
            ==================================================================== */}
        <div className="mb-10 report-section">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-300 pb-1 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            4. Actionable Epidemiological Recommendations
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-800">
            {report.epidemiologicalRecommendations.map((rec, idx) => (
              <li key={idx} className="font-medium">
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Signatures & Seal */}
        <div className="font-sans pt-8 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs">
          <div>
            <span className="font-bold text-slate-900 block">Report Compiled By:</span>
            <p className="mt-6 text-slate-700 font-bold">Epidemiology unit of HRVL</p>
            <p className="text-slate-500 text-[11px]">Hirna Regional Veterinary Laboratory</p>
          </div>

          <div className="text-right">
            <span className="font-bold text-slate-900 block">Approved & Signed:</span>
            <p className="mt-6 text-slate-700 font-bold">Director General</p>
            <p className="text-slate-500 text-[11px]">Hirna Regional Veterinary Laboratory, Oromia</p>
          </div>
        </div>

      </div>
    </div>
  );
};
