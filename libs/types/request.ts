interface MedicationRequestItem {
  _id: string;
  medicationRequestId: string;
  medicationName: string;
  dosage: string;
  instruction: string;
}

interface ParentInfo {
  _id: string;
  username: string;
}

interface StudentInfo {
  _id: string;
  fullName: string;
}

export interface MedicationRequest {
  _id: string;
  parentId: ParentInfo;
  studentId: StudentInfo;
  startDate: string;
  endDate: string;
  prescriptionFile: string;
  status: string;
  requestItems: MedicationRequestItem[];
}

export interface MedicationSchedule {
  _id: string;
  medicationRequestId: string;
  studentId: {
    _id: string;
    fullName: string;
    className: string;
  };
  createdByNurse: {
    _id: string;
    username: string;
  };
  updatedByNurse: {
    _id: string;
    username: string;
  };
  sessionSlots: string;
  status: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
