import { SystemLog } from './types';

interface TelemetryStore {
  logs: SystemLog[];
  stressData: any[];
  memoryData: any[];
}

export const telemetryStore: TelemetryStore = {
  logs: [],
  stressData: [],
  memoryData: []
};
