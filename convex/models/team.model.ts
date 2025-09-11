export type TeamRole = "invited" | "member" | "admin";

export interface Team {
  _id: string;
  organizationId: string;
  name: string;
  createdBy: string;
  createdAt: string;
}

export interface TeamMember {
  _id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
}

