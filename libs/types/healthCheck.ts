interface Campaign {
  _id: string;
  name: string;
  schoolYear: string;
  startDate: string;
  endDate: string;
}
interface Student {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
}

interface Class {
  _id: string;
  className: string;
  gradeLevel: number;
  schoolYear: string;
}

interface Nurse {
  _id: string;
  username: string;
  email: string;
  phone: string;
}

export interface HealthCheckConsent {
  _id: string;
  campaignId: Campaign;
  studentId: Student;
  parentId: string;
  classId: Class;
  nurseId: Nurse;
  status: string;
  reasonForDeclining: string | null;
  confirmedAt: string | null;
}

export interface UpdateConsent {
  status: string;
  reasonForDeclining?: string;
}
