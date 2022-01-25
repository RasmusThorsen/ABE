export interface BasePeripheral {
  specialType?: string;
  generalType?: string;
  name: string;
  states: State[];
  displayName: string;
}

export interface Peripheral extends BasePeripheral {
  values: Map<string, Map<string, any>>;
}

export interface State {
  name: string;
  valueType: "string" | "number" | "boolean" | "enum";
  rw: "write" | "read" | "rw";
  acceptedValues?: string[];
  min?: string;
  max?: string;
}

export interface GetPeripheralDto extends BasePeripheral {}
export interface PostPeripheralDto extends BasePeripheral {}
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
