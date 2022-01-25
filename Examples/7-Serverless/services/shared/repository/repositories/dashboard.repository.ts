import { Dashboard } from "../../../dashboards/models/dashboard.model";
import { Repository } from "./repository";
import { IDashboardRepository } from "../interfaces/IDashboardRepository";

interface DashboardKeys {
    userId: string;
}

export class DashboardRepository extends Repository<Dashboard, DashboardKeys> implements IDashboardRepository {}