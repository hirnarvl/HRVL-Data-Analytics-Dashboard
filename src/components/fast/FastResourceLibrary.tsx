import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  ExternalLink,
  Download,
  Building2,
  Tag,
  CheckCircle2,
  Sparkles,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { FastResource, FastResourceCategory, FastResourceType, FastOrganization } from '../../types/fast';
import { fastResourcesData } from '../../data/fastKnowledgeData';

export const FastResourceLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | FastResourceCategory>('All');
  const [selectedOrg, setSelectedOrg] = useState<'All' | FastOrganization>('All');
  const [selectedType, setSelectedType] = useState<'All' | FastResourceType>('All');

  const categories: Array<'All' | FastResourceCategory> = [
    'All',
    'Disease Information',
    'Field Investigation',
    'Laboratory',
    'Surveillance',
    'Epidemiology',
    'Prevention & Control',
    'Emergency Response',
    'One Health',
    'Training'
  ];

  const organizations: Array<'All' | FastOrganization> = [
    'All',
    'EuFMD',
    'FAO',
    'WOAH',
    'WHO',
    'Africa CDC',
    'Animal Health Institute (AHI)',
    'Ethiopian MoA / Regional Lab'
  ];

  const types: Array<'All' | FastResourceType> = [
    'All',
    'Manual',
    'Guideline',
    'Job Aid',
    'Fact Sheet',
    'Form',
    'Training'
  ];

  const filteredResources = useMemo(() => {
    return fastResourcesData.filter(res => {
      const matchSearch =
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === 'All' || res.category === selectedCategory;
      const matchOrg = selectedOrg === 'All' || res.organization === selectedOrg;
      const matchType = selectedType === 'All' || res.resourceType === selectedType;

      return matchSearch && matchCategory && matchOrg && matchType;
    });
  }, [searchTerm, selectedCategory, selectedOrg, selectedType]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-linear-to-r from-teal-900 via-emerald-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Authoritative Knowledge Hub
              </span>
              <span className="text-xs text-slate-300">
                Verified Global & National Veterinary Repositories
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-white">
              FAST Technical Resource & SOP Library
            </h2>
            <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Standard Operating Procedures, outbreak investigation manuals, laboratory diagnostic test catalogs, and clinical job aids curated from EuFMD, FAO, WOAH, WHO, and the Ethiopian Animal Health Institute (AHI).
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-100 flex items-center gap-2 shrink-0">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>{fastResourcesData.length} Curated Resources</span>
          </div>
        </div>
      </div>

      {/* Filter Box */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="fast-resource-search"
            type="text"
            placeholder="Search resources by title, disease, keywords, SOP topic, or authoring body..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Organizations Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 mr-1 shrink-0 flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            Source:
          </span>
          {organizations.map(org => {
            const isSelected = selectedOrg === org;
            return (
              <button
                key={org}
                onClick={() => setSelectedOrg(org)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {org}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map(res => (
          <div
            key={res.id}
            id={`resource-${res.id}`}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Header tags */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40">
                    {res.category}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {res.resourceType}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  {res.verificationStatus}
                </div>
              </div>

              {/* Title & Organization */}
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {res.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  {res.organization} {res.version ? `(Ver. ${res.version})` : ''} • {res.publicationDate}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {res.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {res.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-[10px] rounded-md bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer action */}
            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                {res.language} {res.fileSize ? `• ${res.fileSize}` : ''}
              </span>

              <a
                href={res.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Access Document</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
