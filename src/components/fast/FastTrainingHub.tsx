import React from 'react';
import {
  GraduationCap,
  Clock,
  Users,
  Award,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import { fastTrainingCoursesData } from '../../data/fastKnowledgeData';

export const FastTrainingHub: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Capacity Building & Workforce Development
              </span>
              <span className="text-xs text-slate-300">
                In-Service Applied Epi & Simulation Training
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-white">
              FAST Training Hub & Field Epi Curricula
            </h2>
            <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Curated e-learning courses, Frontline In-Service Applied Veterinary Epidemiology (FETPV), and Community One Health simulation exercises designed by EuFMD, FAO, and EPHI.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-100 flex items-center gap-2 shrink-0">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Accredited Continuing Professional Education</span>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {fastTrainingCoursesData.map(course => (
          <div
            key={course.id}
            id={`course-${course.id}`}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                  course.level === 'Advanced' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40' :
                  course.level === 'Intermediate' ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40' :
                  'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                }`}>
                  {course.level} Level
                </span>
                {course.certificateAvailable && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/40">
                    <Award className="w-3 h-3" />
                    Certificate
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {course.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {course.provider}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {course.targetAudience}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {course.description}
              </p>

              {/* Modules list */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Core Curriculum Modules:
                </span>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {course.modules.map((mod, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug">{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              {course.linkUrl ? (
                <a
                  href={course.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Launch Training Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs flex items-center justify-center gap-2"
                >
                  In-Person Workshop Series
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
