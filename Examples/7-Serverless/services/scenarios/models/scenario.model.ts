import { Step } from './step.model';

export interface Scenario {
  id: string;
  userId: string;
  scenarioName: string;
  description: string;
  steps: Step[];
}
