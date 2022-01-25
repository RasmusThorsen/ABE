import { IRepository } from "./IRepository";
import { Dashboard } from "../../../dashboards/models/dashboard.model";
import { DashboardKeys } from "../../../dashboards/models/dashboardKeys.model";

export interface IDashboardRepository extends IRepository<Dashboard, DashboardKeys> {}