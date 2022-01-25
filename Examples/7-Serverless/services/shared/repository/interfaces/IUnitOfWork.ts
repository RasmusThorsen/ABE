import { IDashboardRepository } from "./IDashboardRepository";
import { IDeviceRepository } from "./IDeviceRepository";
import { IScenarioRepository } from "./IScenarioRepository";

export interface IUnitOfWork {
    dashboards: IDashboardRepository;
    devices: IDeviceRepository;
    scenarios: IScenarioRepository;
}