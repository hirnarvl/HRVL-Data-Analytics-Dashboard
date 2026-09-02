import React, { useState } from 'react';
import {
  Sparkles,
  FlaskConical,
  BookOpen,
  ClipboardCheck,
  TestTube2,
  HeartHandshake,
  GraduationCap,
  Activity,
  MapPin,
  Layers,
  ArrowRight
} from 'lucide-react';
import { FastDiseaseExplorer } from './FastDiseaseExplorer';
import { FastDiseaseProfileModal } from './FastDiseaseProfileModal';
import { FastResourceLibrary } from './FastResourceLibrary';
import { FastFieldInvestigation } from './FastFieldInvestigation';
import { FastLaboratoryIntelligence } from './FastLaboratoryIntelligence';
import { FastOneHealth } from './FastOneHealth';
import { FastTrainingHub } from './FastTrainingHub';
import { FieldToolkitContainer } from '../fieldToolkit/FieldToolkitContainer';
import { FastDiseaseKnowledge } from '../../types/fast';
import { SurveillanceRecord } from '../../types';

export type FastSubTab = 
  | 'diseases'
  | 'resources'
  | 'field-tools'
  | 'laboratory'
  | 'one-health'
  | 'training';

interface FastModuleContainerProps {
  records: SurveillanceRecord[];
  initialSubTab?: FastSubTab;
  onNavigateToMap?: (diseaseName?: string) => void;
  onNavigateToDashboard?: () => void;
}

export const FastModuleContainer: React.FC<FastModuleContainerProps> = ({
  records,
  initialSubTab = 'diseases',
  onNavigateToMap,
  onNavigateToDashboard,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<FastSubTab>(initialSubTab);
  const [selectedDiseaseForModal, setSelectedDiseaseForModal] = useState<FastDiseaseKnowledge | null>(null);

  const subTabs = [
    { id: 'diseases', label: 'FAST Diseases', icon: FlaskConical, desc: 'Pathogen knowledge & Hararghe live data' },
    { id: 'resources', label: 'Resource Library', icon: BookOpen, desc: 'Authoritative SOPs, manuals & guidelines' },
    { id: 'field-tools', label: 'Field Investigation', icon: ClipboardCheck, desc: 'Checklists, biosecurity & sampling' },
    { id: 'laboratory', label: 'Laboratory Diagnostics', icon: TestTube2, desc: 'Test matrices, biosafety & AHI Sebeta' },
    { id: 'one-health', label: 'One Health', icon: HeartHandshake, desc: 'Zoonoses, AMR & cross-sectoral alerts' },
    { id: 'training', label: 'Training Hub', icon: GraduationCap, desc: 'E-learning, FETPV & simulations' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Sub-Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
          {subTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`fast-tab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id as FastSubTab)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl text-center transition-all ${
                  isActive
                    ? 'bg-linear-to-b from-emerald-600 to-teal-700 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span className="text-xs font-black tracking-tight">{tab.label}</span>
                <span className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'}`}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeSubTab === 'diseases' && (
          <FastDiseaseExplorer
            records={records}
            onSelectDisease={disease => setSelectedDiseaseForModal(disease)}
            onNavigateToMap={onNavigateToMap}
          />
        )}

        {activeSubTab === 'resources' && <FastResourceLibrary />}

        {activeSubTab === 'field-tools' && (
          <div className="space-y-8">
            <FieldToolkitContainer
              onOpenFastResource={(key) => {
                setActiveSubTab('diseases');
              }}
              onViewOnMap={(inv) => {
                if (onNavigateToMap) {
                  onNavigateToMap(inv.disease);
                }
              }}
            />
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                FAST Standard Operating Procedures & Investigation Guidelines
              </h3>
              <FastFieldInvestigation />
            </div>
          </div>
        )}

        {activeSubTab === 'laboratory' && <FastLaboratoryIntelligence />}

        {activeSubTab === 'one-health' && <FastOneHealth />}

        {activeSubTab === 'training' && <FastTrainingHub />}
      </div>

      {/* Detailed Disease Profile Modal */}
      <FastDiseaseProfileModal
        disease={selectedDiseaseForModal}
        records={records}
        isOpen={!!selectedDiseaseForModal}
        onClose={() => setSelectedDiseaseForModal(null)}
        onNavigateToMap={onNavigateToMap}
      />
    </div>
  );
};
