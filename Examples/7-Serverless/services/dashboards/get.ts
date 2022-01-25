import { APIGatewayProxyHandler } from "aws-lambda";
import { Utility } from "../shared/utility";
import { StatusCode } from "../shared/statusCode";
import { UnitOfWork } from "../shared/repository/unitOfWork";

const uow = new UnitOfWork();

export const get: APIGatewayProxyHandler = async (event, _context) => {
  const userId = Utility.getUserId(event);

  const dashboard = await uow.dashboard.get({userId});

  if(!dashboard) {
      StatusCode.Success204(event.headers.origin);
  }

  return StatusCode.Success200(dashboard.widgets, event.headers.origin);
};
