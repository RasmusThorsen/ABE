import { ConditionLogic } from "./conditionLogic.model";

export interface BaseStepItem {
    id: string;
    deviceId: string;
    thingName: string;
    position: Point;
  }
  
  export type Step = ActionStep | ConditionStep | TriggerStep | UnspecifiedStep;
  
  export interface UnspecifiedStep extends BaseStepItem {
    type: 'unspecified';
  }
  
  export interface ActionStep extends BaseStepItem {
    type: 'action';
    stateChanges: PeripheralStateChange[];
  }
  
  export interface ConditionStep extends BaseStepItem {
    type: 'condition';
    conditionLogic?: ConditionLogic;
    connections: Connection[];
  }
  
  export interface TriggerStep extends Pick<ConditionStep, 'conditionLogic' | 'connections'>, BaseStepItem {
    type: 'trigger';
  }

  export interface Point {
    x: number;
    y: number;
  }

  export interface PeripheralStateChange {
    peripheralName: string;
    desiredStates: State[];
  }
  
  export interface State {
    name: string;
    value: string | number | boolean;
  }

  export interface Connection {
    id: string;
    start: StepConnector;
    end: StepConnector;
  }
  
  export interface StepConnector {
    position: Point;
    edge?: Edge;
    stepId?: string;
  }

  export enum Edge {
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
    Left = 'left',
  }
