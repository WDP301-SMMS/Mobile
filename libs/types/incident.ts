export type MedicalIncident = {
  _id: string;
  studentId: {
    _id: string;
    fullName: string;
    className: string;
  };
  nurseId: {
    _id: string;
    userName: string;
  };
  incidentType: string;
  description: string;
  severity: string;
  actionsTaken: string;
  note: string | null;
  incidentTime: string;
};
