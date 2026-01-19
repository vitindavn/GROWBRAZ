
export enum Genetics {
  AUTO = 'Auto',
  PHOTO = 'Photoperiod'
}

export enum GrowStage {
  GERMINATION = 'Germination',
  SEEDLING = 'Seedling',
  VEGETATIVE = 'Vegetative',
  FLOWERING = 'Flowering',
  HARVESTED = 'Harvested'
}

export enum LogType {
  WATERING = 'Watering',
  FEEDING = 'Feeding',
  TRAINING = 'Training',
  PHOTO = 'Photo'
}

export enum TrainingType {
  TOPPING = 'Topping',
  LST = 'LST',
  DEFOLIATION = 'Defoliation',
  SUPER_CROPPING = 'Super Cropping'
}

export interface GrowSpace {
  id: string;
  name: string;
  dimensions: string;
  lightType: string;
  lightPower: number;
}

export interface MaintenanceLog {
  id: string;
  date: number;
  type: LogType;
  ph?: number;
  ecPpm?: number;
  volumeLiters?: number;
  nutrients?: string;
  trainingTypes?: TrainingType[];
  notes?: string;
  imageUrl?: string;
}

export interface Plant {
  id: string;
  growSpaceId: string;
  name: string;
  strain: string;
  genetics: Genetics;
  seedBank: string;
  startDate: number;
  currentStage: GrowStage;
  logs: MaintenanceLog[];
}
