export interface StatsResponse {
  id: number;
  date: string;
  stat: Stat;
}

export interface Stat {
  userStatistics: UserStatistics;
  technicianStatistics: TechnicianStatistics;
  requestStatistics: RequestStatistics;
  interventionStatistics: InterventionStatistics;
  maintenancesStatistics: MaintenancesStatistics;
  organisationStatistics: OrganisationStatistics;
}

export interface UserStatistics {
  totalUsers: number;
  maleUsers: number;
  femaleUsers: number;
  users: number;
  technicians: number;
  managers: number;
}

export interface TechnicianStatistics {
  technicianTotal: number;
  maleUsers: number;
  femaleUsers: number;
  topPerformingTechnicianIntervention: Technician[][];
  topPerformingTechnicianMaintenances: Technician[][];
}

export interface Technician {
  firstName: string;
  lastName: string;
  totalInterventions?: number;
  totalMaintenances?: number;
}

export interface RequestStatistics {
  requestTotal: number;
  pending: number;
  progress: number;
  finish: number;
}

export interface InterventionStatistics {
  interventionTotal: number;
  pending: number;
  progress: number;
  finish: number;
}

export interface MaintenancesStatistics {
  maintenancesTotal: number;
  progress: number;
  finish: number;
}

export interface OrganisationStatistics {
  directionTotal: number;
  specialityTotal: number;
  materialTotal: number;
}
