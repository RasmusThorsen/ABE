import { DeviceRepository } from "./repositories/device.repository";
import { ScenarioRepository } from "./repositories/scenario.repository";
import { DashboardRepository } from "./repositories/dashboard.repository";
import { IDashboardRepository } from "./interfaces/IDashboardRepository";
import { IScenarioRepository } from "./interfaces/IScenarioRepository";
import { IDeviceRepository } from "./interfaces/IDeviceRepository";

export class UnitOfWork {
    public readonly devices: IDeviceRepository;
    public readonly scenarios: IScenarioRepository;
    public readonly dashboard: IDashboardRepository;

    constructor(deviceTable: string = "devices-table", scenarioTable: string = "scenarios-table", dashboardTable: string = "dashboard-table") {
        this.devices = new DeviceRepository(deviceTable);
        this.scenarios = new ScenarioRepository(scenarioTable);
        this.dashboard = new DashboardRepository(dashboardTable);
    }
}