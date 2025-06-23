export interface Campaign {
  _id: string;
  name: string;
  vaccineName: string;
  doseNumber: number;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Consent {
  _id: string;
  campaignId: Campaign;
  studentId: string;
  parentId: string;
  status: "APPROVED" | "DECLINED" | "PENDING";
  reasonForDeclining?: string;
  confirmedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentConsentInfo {
  studentId: string;
  studentName: string;
  consents: Consent[];
}

export interface UpdateStatusId {
  campaignId: string;
  studentId: string;
}

export interface UpdateStatus {
  status: string;
  reasonForDeclining?: string;
}
