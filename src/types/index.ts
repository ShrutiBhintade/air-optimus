export interface Aircraft {
  id: string;
  tailNumber: string;
  type: string;
  status: 'available' | 'maintenance' | 'mission' | 'standby';
  location: string;
  readiness: number;
  lastMaintenance: string;
  nextMaintenance: string;
  flightHours: number;
  maxFlightHours: number;
}

export interface CrewMember {
  id: string;
  name: string;
  rank: string;
  role: 'pilot' | 'navigator' | 'engineer' | 'operator';
  status: 'ready' | 'resting' | 'training' | 'unavailable';
  qualifications: string[];
  lastFlight: string;
  dutyHours: number;
  maxDutyHours: number;
}

export interface Mission {
  id: string;
  name: string;
  type: 'reconnaissance' | 'transport' | 'patrol' | 'training' | 'search_rescue';
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  priority: 'critical' | 'high' | 'medium' | 'low';
  startTime: string;
  endTime: string;
  assignedAircraft: string[];
  assignedCrew: string[];
  operationalZone: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'info';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  acknowledged: boolean;
  affectedResources: string[];
}

export interface OperationalZone {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
  status: 'active' | 'standby' | 'restricted';
  assignedResources: string[];
  weather: 'clear' | 'cloudy' | 'stormy' | 'foggy';
}

export interface ResourceAllocation {
  id: string;
  resourceType: 'aircraft' | 'crew' | 'fuel' | 'maintenance' | 'munitions';
  allocated: number;
  available: number;
  utilization: number;
  unit: string;
}

export interface TimelineEvent {
  id: string;
  type: 'aircraft' | 'crew' | 'weather' | 'resource' | 'mission';
  title: string;
  description: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  relatedId: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  type: 'allocation' | 'replan' | 'maintenance' | 'crew' | 'weather';
  factors: string[];
  alternatives: number;
  timestamp: string;
}

export interface KPIData {
  totalAircraft: number;
  availableAircraft: number;
  crewReady: number;
  operationalReadiness: number;
  activeMissions: number;
  activeAlerts: number;
}

export interface ReadinessData {
  value: number;
  aiConfidence: number;
  trend: 'up' | 'down' | 'stable';
  factors: { label: string; value: number; impact: 'positive' | 'negative' | 'neutral' }[];
}

export interface DigitalTwinNode {
  id: string;
  type: 'aircraft' | 'crew' | 'facility' | 'zone';
  position: { x: number; y: number };
  status: 'active' | 'standby' | 'maintenance' | 'alert';
  label: string;
  metadata: Record<string, string | number>;
}