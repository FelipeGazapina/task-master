export interface Project {
  _id: string;
  organizationId: string;
  name: string;
  description: string;
  totalHoursBudgeted: number;
  hourlyRate?: number;
  createdBy: string;
  createdAt: string;
}

export interface Release {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

