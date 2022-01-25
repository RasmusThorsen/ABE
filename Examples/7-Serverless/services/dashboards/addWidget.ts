import { APIGatewayProxyHandler } from "aws-lambda";
import { Widget } from "./models/widget.model";
import { StatusCode } from "../shared/statusCode";
import { Utility } from "../shared/utility";
import { UnitOfWork } from "../shared/repository/unitOfWork";

const uow = new UnitOfWork();

export const addWidget: APIGatewayProxyHandler = async (event, _context) => {
  const widget: Widget = JSON.parse(event.body);
  const userId = Utility.getUserId(event);

  if (!widget.id) {
    return StatusCode.Error400(event.headers.origin, "Missing required ID");
  }

  const dashboard = await uow.dashboard.get({userId});

  if (!dashboard) {
    const created = await uow.dashboard.add({
      userId,
      widgets: [widget]
    });

    if (!created) {
      return StatusCode.Error500(event.headers.origin);
    }
  } else {
    dashboard.widgets.push(widget);

    const update = await uow.dashboard.update(dashboard);

    if (!update) {
      return StatusCode.Error500(event.headers.origin);
    }
  }

  return StatusCode.Success201({ ...widget }, event.headers.origin);
};
