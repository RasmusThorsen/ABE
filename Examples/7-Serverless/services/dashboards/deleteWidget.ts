import { APIGatewayProxyHandler } from "aws-lambda";
import { Utility } from "../shared/utility";
import { StatusCode } from "../shared/statusCode";
import { UnitOfWork } from "../shared/repository/unitOfWork";

const uow = new UnitOfWork();

export const deleteWidget: APIGatewayProxyHandler = async (event, _context) => {
  const userId = Utility.getUserId(event);
  const widgetId = event.pathParameters.id;
  
  const dashboard = await uow.dashboard.get({userId});

  if (!dashboard) {
    return StatusCode.Error500(event.headers.origin);
  }

  const widgets = dashboard.widgets.filter(w => w.id != widgetId);

  const update = await uow.dashboard.update({
    userId,
    widgets
  })

  if (!update) {
    return StatusCode.Error500(event.headers.origin);
  }

  return StatusCode.Success204(event.headers.origin);
};
