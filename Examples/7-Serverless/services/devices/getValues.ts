import { APIGatewayProxyHandler } from "aws-lambda";
import { StatusCode } from "../shared/statusCode";
import { Utility } from "../shared/utility";
import { UnitOfWork } from "../shared/repository/unitOfWork";

const uow = new UnitOfWork();

export const getValues: APIGatewayProxyHandler = async (event, _context) => {
  if (
    !event.queryStringParameters["state"] ||
    !event.queryStringParameters["name"]
  ) {
    return StatusCode.Error400(
      event.headers.origin,
      "Missing required params: state or name"
    );
  }

  const userId = Utility.getUserId(event);

  const deviceId = event.pathParameters.id;
  const name = event.queryStringParameters["name"];
  const state = event.queryStringParameters["state"];
  let start = Number(event.queryStringParameters["start"]);
  if (!start) start = 0;

  let end = Number(event.queryStringParameters["end"]);
  if (!end) end = Date.now();

  let datapoints = Number(event.queryStringParameters["datapoints"]);

  const data = await uow.devices.getValues({id: deviceId, userId}, state, start, end, name, datapoints)

  return StatusCode.Success200(data, event.headers.origin);
};
