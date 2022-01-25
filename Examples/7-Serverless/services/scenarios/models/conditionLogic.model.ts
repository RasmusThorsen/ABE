export interface BaseConditionLogic {
    peripheralName: string;
    stateName: string;
  }
  
export type ConditionLogic = EqualToCondition | GraterThanCondition | LessThanCondition
| InBetweenCondition
| AndCondition
| OrCondition;

export interface EqualToCondition extends BaseConditionLogic {
logicalOperator: 'equalTo';
conditionStateValue: number;
}

export interface GraterThanCondition extends BaseConditionLogic {
logicalOperator: 'greaterThan';
conditionStateValue: number;
}

export interface LessThanCondition extends BaseConditionLogic {
logicalOperator: 'lessThan';
conditionStateValue: number;
}

export interface InBetweenCondition extends BaseConditionLogic {
logicalOperator: 'inBetween';
conditionStateValue: { min: number; max: number };
}

export interface AndCondition {
logicalOperator: 'and';
conditions: ConditionLogic[];
}

export interface OrCondition {
logicalOperator: 'or';
conditions: ConditionLogic[];
}
