export interface ShadowState {
    timestamp: number;
    current: {
      state: {
        reported: {
          deviceId: string;
          manufactorer: string;
          peripherals: Array<{ name: string }>;
        };
      };
    };
  }