import { APIGatewayProxyHandler } from "aws-lambda";
import { StatusCode } from "../shared/statusCode";
import { UnitOfWork } from "../shared/repository/unitOfWork";
import { Device } from "./models/device.model";
import { Utility } from "../shared/utility";

const uow = new UnitOfWork();

export const putDevice: APIGatewayProxyHandler = async (event, _context) => {
  const item: Device = JSON.parse(event.body);
  const userId = Utility.getUserId(event);

  const device: Device = {
    id: event.pathParameters.id,
    userId,
    description: item.description,
    displayName: item.displayName,
    manufactorer: item.manufactorer,
    thingName: item.thingName,
    type: item.type,
    peripherals: item.peripherals
  };

  const resp = await uow.devices.update(device);

  if (!resp) {
    return StatusCode.Error500(event.headers.origin);
  }

  return StatusCode.Success200({}, event.headers.origin);
};
