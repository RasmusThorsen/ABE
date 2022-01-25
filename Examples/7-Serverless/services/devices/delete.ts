import { APIGatewayProxyHandler } from "aws-lambda";
import { StatusCode } from "../shared/statusCode";
import { Utility } from "../shared/utility";
import { UnitOfWork } from "../shared/repository/unitOfWork";
import { ThingManager } from "../shared/thingManager/thingManager";

const uow = new UnitOfWork();
const thingManager = new ThingManager();

export const deleteDevice: APIGatewayProxyHandler = async (event, _context) => {
  const userId = Utility.getUserId(event);

  const device = await uow.devices.get({
    id: event.pathParameters.id,
    userId,
  });

  await thingManager.deleteThing(device.thingName);

  const success = await uow.devices.remove({
    id: event.pathParameters.id,
    userId,
  });

  if (!success) {
    return StatusCode.Error500(event.headers.origin);
  }

  return StatusCode.Success204(event.headers.origin);
};
