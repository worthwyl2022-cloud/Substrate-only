export interface CognitiveModule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'standby' | 'calibrating';
  icon: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}
