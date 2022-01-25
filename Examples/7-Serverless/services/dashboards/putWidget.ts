import { APIGatewayProxyHandler } from "aws-lambda";
import { Utility } from "../shared/utility";
import { Widget } from "./models/widget.model";
import { StatusCode } from "../shared/statusCode";
import { UnitOfWork } from "../shared/repository/unitOfWork";

const uow = new UnitOfWork();

export const putWidget: APIGatewayProxyHandler = async (event, _context) => { 
    const userId = Utility.getUserId(event);
    const widgetId = event.pathParameters.id;
    const newWidget: Widget = JSON.parse(event.body);

    const dashboard = await uow.dashboard.get({userId});

    if(!dashboard) {
        return StatusCode.Error500(event.headers.origin);
    }

    const index = dashboard.widgets.findIndex((w) => w.id == widgetId);
    dashboard.widgets[index] = newWidget;

    const updatedDashboard = await uow.dashboard.update(dashboard);
    if(!updatedDashboard) {
        return StatusCode.Error500(event.headers.origin);
    }

    return StatusCode.Success201({}, event.headers.origin);
}