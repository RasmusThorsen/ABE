import { APIGatewayProxyHandler } from "aws-lambda";
import { UnitOfWork } from "../shared/repository/unitOfWork";
import { Utility } from "../shared/utility";
import { StatusCode } from "../shared/statusCode";

const uow = new UnitOfWork();

export const getAll: APIGatewayProxyHandler = async (event, _context) => {
    const userId = Utility.getUserId(event);

    const scenarios = await uow.scenarios.getAll({userId}, ["id", "description", "userId", "scenarioName"]);

    return StatusCode.Success200(scenarios, event.headers.origin);
}