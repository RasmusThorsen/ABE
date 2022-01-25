import { APIGatewayProxyHandler } from "aws-lambda";
import { StatusCode } from "../shared/statusCode";
import { Utility } from "../shared/utility";
import { UnitOfWork } from "../shared/repository/unitOfWork";

const uow = new UnitOfWork();

export const getList: APIGatewayProxyHandler = async (event, _context) => {
  const userId = Utility.getUserId(event);

  const result = await uow.devices.getAll({userId}, []);

  // TODO: Fix query parameter to work with nested list properties 
  result.forEach(d => d.peripherals.forEach(p => p.values = null));
  
  if (!result) {
    return StatusCode.Error500(event.headers.origin);
  }

  return StatusCode.Success200(result, event.headers.origin);
};
