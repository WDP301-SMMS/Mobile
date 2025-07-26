interface Parent {
  _id: string;
  username: string;
  gender: string;
  email: string;
  role: string;
  dob: string;
  phone: string;
  isActive: boolean;
}

interface Class {
  _id: string;
  className: string;
  gradeLevel: number;
}

export interface Student {
  _id: string;
  parentId: Parent;
  classId: Class;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Allergy {
  type: string;
  reaction: string;
  severity: string;
  notes: string;
}

interface ChronicCondition {
  conditionName: string;
  diagnosedDate?: Date;
  medication: string;
  notes: string;
}

interface MedicalHistoryEvent {
  condition: string;
  facility: string;
  treatmentDate: Date;
  method: string;
  notes?: string;
}

interface VisionCheckup {
  checkupDate: Date;
  rightEyeVision: string;
  leftEyeVision: string;
  wearsGlasses: boolean;
  isColorblind: boolean;
  notes?: string;
}

interface HearingCheckup {
  checkupDate: Date;
  rightEarStatus: string;
  leftEarStatus: string;
  usesHearingAid: boolean;
  notes?: string;
}

interface InjectedVaccine {
  vaccineName: string;
  doseNumber: number;
  note: string;
  dateInjected: Date;
  locationInjected: string;
}

export interface HealthProfile {
  studentId: string;
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  medicalHistory: MedicalHistoryEvent[];
  visionHistory: VisionCheckup[];
  hearingHistory: HearingCheckup[];
  vaccines: InjectedVaccine[];
  studentInfo: Student;
}

interface HealthCheckDetail {
  itemName: string;
  value: number;
  unit: string;
  isAbnormal: boolean;
}

interface Observations {
  observedAt: string;
  notes: string;
  isAbnormal: boolean;
}

interface HealthCheckHistory {
  campaignName: string;
  className: string;
  checkupDate: string;
  overallConclusion: string;
  recommendations: string;
  nurseName: string;
  details: HealthCheckDetail[];
}

interface VaccinationHistory {
  campaignName: string;
  vaccineName: string;
  doseNumber: number;
  administeredAt: string;
  administeredBy: string;
  organizationName: string;
  observations: Observations[];
}

export interface HealthHistory {
  studentId: string;
  studentName: string;
  currentClassName: string;
  schoolYear: string;
  healthChecks: HealthCheckHistory[];
  vaccinations: VaccinationHistory[];
}
