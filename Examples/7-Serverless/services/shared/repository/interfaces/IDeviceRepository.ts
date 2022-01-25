import { Device } from "../../../devices/models/device.model";
import { IRepository } from "./IRepository";
import { DeviceKeys } from "../../../devices/models/deviceKeys.model";
import { ShadowState } from "../../../devices/models/shadowState.model";

export interface IDeviceRepository extends IRepository<Device, DeviceKeys> {
    getValues(keys: DeviceKeys, state: string, start: number, end: number, name: string, datapoints: number);

    saveValues(state: ShadowState);
}