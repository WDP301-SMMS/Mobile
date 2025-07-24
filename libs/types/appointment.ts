interface Parent {
  _id: string;
  username: string;
  email: string;
  phone: string;
}

interface Student {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
}

interface Result {
  _id: string;
  checkupDate: string;
  overallConclusion: string;
  isAbnormal: boolean;
}

export interface HealthMeeting {
  _id: string;
  studentId: Student;
  parentId: Parent;
  resultId: Result;
  meetingTime: string;
  location: string;
  status: string;
  notes: string;
  afterMeetingNotes: string;
}
