import { APIGatewayProxyHandler } from "aws-lambda";
import { Scenario } from "./models/scenario.model";
import { v1 } from "uuid";
import { TriggerStep } from "./models/step.model";
import { ConditionLogic } from "./models/conditionLogic.model";
import { StatusCode } from "../shared/statusCode";
import { UnitOfWork } from "../shared/repository/unitOfWork";
import { Utility } from "../shared/utility";
import { RuleManager } from "../shared/ruleManager/ruleManager";
import { IRuleManager } from "../shared/ruleManager/IRuleManager";

const uow = new UnitOfWork();
const ruleManager: IRuleManager = new RuleManager();
let whereClause = "";

export const create: APIGatewayProxyHandler = async (event, _context) => {
  const scenario: Scenario = JSON.parse(event.body);
  const userId = Utility.getUserId(event);

  scenario.id = v1();
  scenario.userId = userId;

  whereClause = "";

  await uow.scenarios.add(scenario);

  const triggerStep = scenario.steps.find(s => s.type === "trigger") as TriggerStep;

  parseConditionLogic(triggerStep.conditionLogic);

  const ruleName =  Utility.generateRuleName(scenario);

  await ruleManager.createRule(ruleName, scenario.id, userId, triggerStep.thingName, whereClause);

  await ruleManager.addPermission(scenario.id, ruleName);

  return StatusCode.Success201(scenario, event.headers.origin);
};

function parseConditionLogic(condition: ConditionLogic) {
  whereClause;
  switch (condition.logicalOperator) {
    case "and":
      whereClause += "(";
      condition.conditions.forEach((c, i) => {
        parseConditionLogic(c);
        if (i != condition.conditions.length - 1) {
          whereClause += " AND ";
        }
      });
      whereClause += ")";
      break;
    case "or":
      whereClause += "(";
      condition.conditions.forEach((c, i) => {
          parseConditionLogic(c);
          if (i != condition.conditions.length - 1) {
            whereClause += " OR ";
          }
      });
      whereClause += ")";
      break;
    case "equalTo":
      whereClause += `get((SELECT * FROM state.reported.peripherals WHERE name = '${condition.peripheralName}'), 0).${condition.stateName} = ${condition.conditionStateValue}`;
      break;
    case "greaterThan":
      whereClause += `get((SELECT * FROM state.reported.peripherals WHERE name = '${condition.peripheralName}'), 0).${condition.stateName} > ${condition.conditionStateValue}`;
      break;
    case "inBetween":
      whereClause += `(get((SELECT * FROM state.reported.peripherals WHERE name = '${condition.peripheralName}'), 0).${condition.stateName} > ${condition.conditionStateValue.min} AND get((SELECT * FROM state.reported.peripherals WHERE name = '${condition.peripheralName}'), 0).${condition.stateName} < ${condition.conditionStateValue.max})`;
      break;
    case "lessThan":
      whereClause += `get((SELECT * FROM state.reported.peripherals WHERE name = '${condition.peripheralName}'), 0).${condition.stateName} < ${condition.conditionStateValue}`;
      break;
    default:
      break;
  }
}
