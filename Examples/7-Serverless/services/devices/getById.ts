import { APIGatewayProxyHandler } from "aws-lambda";
import { Utility } from "../shared/utility";
import { StatusCode } from "../shared/statusCode";
import { UnitOfWork } from "../shared/repository/unitOfWork";

const uow = new UnitOfWork();

export const getById: APIGatewayProxyHandler = async (event, _context) => {
  const userId = Utility.getUserId(event);

  const device = await uow.devices.get({
    id: event.pathParameters.id,
    userId
  });

  // TODO: Fix query parameter to work with nested list properties 
  device.peripherals.forEach(p => p.values = null);

  if (!device) {
    return StatusCode.Error500(event.headers.origin);
  }

  return StatusCode.Success200(device, event.headers.origin);
};
