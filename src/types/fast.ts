export type FastDiseaseGroup = 
  | 'Vesicular' 
  | 'Pox & Skin' 
  | 'Respiratory' 
  | 'Vector-Borne & Hemorrhagic' 
  | 'Zoonoses' 
  | 'Swine & Others';

export interface AuthoritativeReference {
  title: string;
  organization: string;
  url?: string;
  type: string;
}

export interface FastDiseaseKnowledge {
  id: string;
  name: string;
  acronym: string;
  group: FastDiseaseGroup;
  etiologicalAgent: string;
  primaryHosts: string[];
  secondaryHosts?: string[];
  importance: {
    global: string;
    ethiopianContext: string;
    economicImpact: string;
  };
  epidemiology: {
    transmission: string[];
    incubationPeriod: string;
    morbidityMortality: string;
    seasonality: string;
  };
  clinicalSigns: {
    general: string[];
    acute: string[];
    pathognomonic: string[];
    differentialDiagnosis: string[];
  };
  surveillance: {
    caseDefinition: {
      suspected: string;
      confirmed: string;
    };
    samplingRequirements: string[];
    notificationPeriod: string;
  };
  laboratoryDiagnosis: {
    fieldTests: string[];
    referenceTests: string[];
    sampleTypes: string[];
    biosafetyLevel: string;
  };
  preventionAndControl: {
    vaccinationStrategy: string;
    biosecurityMeasures: string[];
    movementControl: string;
    emergencyActions: string[];
  };
  oneHealthRelevance?: {
    isZoonotic: boolean;
    humanImpact?: string;
    wildlifeReservoir?: string;
    environmentalFactors?: string;
  };
  authoritativeReferences: AuthoritativeReference[];
  matchingAdnisDiseases: string[]; // Used to bind with actual live ADNIS surveillance records
}

export type FastResourceCategory =
  | 'Disease Information'
  | 'Surveillance'
  | 'Epidemiology'
  | 'Laboratory'
  | 'Field Investigation'
  | 'Prevention & Control'
  | 'Emergency Response'
  | 'Training'
  | 'One Health'
  | 'Scientific Publications';

export type FastResourceType =
  | 'PDF'
  | 'Manual'
  | 'Guideline'
  | 'Job Aid'
  | 'Fact Sheet'
  | 'Video'
  | 'Training'
  | 'Form'
  | 'Website'
  | 'Scientific Article'
  | 'Dataset';

export type FastOrganization =
  | 'EuFMD'
  | 'FAO'
  | 'WOAH'
  | 'WHO'
  | 'Africa CDC'
  | 'Animal Health Institute (AHI)'
  | 'Ethiopian MoA / Regional Lab'
  | 'Peer-Reviewed Literature';

export interface FastResource {
  id: string;
  title: string;
  description: string;
  disease: string;
  category: FastResourceCategory;
  resourceType: FastResourceType;
  organization: FastOrganization;
  publicationDate: string;
  version?: string;
  language: 'English' | 'Afaan Oromoo' | 'Amharic' | 'Multilingual';
  url?: string;
  tags: string[];
  verificationStatus: 'Verified Official' | 'Authoritative Technical Guideline' | 'Training Material' | 'Peer-Reviewed Reference';
  fileSize?: string;
}

export interface FastFieldToolChecklistItem {
  id: string;
  label: string;
  details?: string;
  critical?: boolean;
}

export interface FastFieldTool {
  id: string;
  title: string;
  category: 'Checklist' | 'Case Form' | 'Sampling Protocol' | 'Biosecurity' | 'Movement & Traceability' | 'Risk Assessment';
  description: string;
  targetUser: string;
  stepsOrItems: FastFieldToolChecklistItem[];
  sopGuidance: string[];
  downloadableTemplateUrl?: string;
  interactiveFormType?: 'outbreak_investigation' | 'case_investigation' | 'biosecurity_audit' | 'sampling_checklist' | 'risk_scoring';
}

export interface FastLabDiagnosticMatrix {
  diseaseId: string;
  diseaseName: string;
  preferredSample: string;
  transportMedia: string;
  primaryTest: string;
  confirmatoryTest: string;
  nationalLabCapacity: string;
  biosafetyRequirement: string;
  turnaroundTime: string;
  interpretationNotes: string;
}

export interface FastOneHealthInterface {
  id: string;
  domain: 'Zoonoses' | 'AMR' | 'Food Safety' | 'Wildlife-Livestock Interface' | 'Vector-Borne & Climate' | 'Emerging Threats';
  title: string;
  animalSector: string;
  humanHealthSector: string;
  wildlifeSector?: string;
  environmentSector?: string;
  priorityLevel: 'High' | 'Critical' | 'Medium';
  surveillanceLinkage: string;
  jointInterventionProtocols: string[];
}

export interface FastTrainingCourse {
  id: string;
  title: string;
  provider: string;
  duration: string;
  targetAudience: string;
  level: 'Foundational' | 'Intermediate' | 'Advanced';
  description: string;
  modules: string[];
  learningObjectives: string[];
  certificateAvailable: boolean;
  linkUrl?: string;
}
