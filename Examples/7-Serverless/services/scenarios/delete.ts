import { APIGatewayProxyHandler } from "aws-lambda";
import { UnitOfWork } from "../shared/repository/unitOfWork";
import { StatusCode } from "../shared/statusCode";
import { Utility } from "../shared/utility";
import { RuleManager } from "../shared/ruleManager/ruleManager";
import { IRuleManager } from "../shared/ruleManager/IRuleManager";

const uow = new UnitOfWork();
const ruleManager: IRuleManager = new RuleManager();

export const deleteScenario: APIGatewayProxyHandler = async (event, _context) => { 
    const scenarioId = event.pathParameters.id;
    const userId = Utility.getUserId(event);

    const scenario = await uow.scenarios.get({ id: scenarioId, userId });

    const ruleName = Utility.generateRuleName(scenario);
    await ruleManager.deleteRule(ruleName);

    await ruleManager.removePermission(scenario.id);

    await uow.scenarios.remove({id: scenarioId, userId });

    return StatusCode.Success204(event.headers.origin);
}