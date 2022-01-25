import { Repository } from "./repository";
import { Device } from "../../../devices/models/device.model";
import { IDeviceRepository } from "../interfaces/IDeviceRepository";
import { DeviceKeys } from "../../../devices/models/deviceKeys.model";
import { ShadowState } from "../../../devices/models/shadowState.model";

export class DeviceRepository extends Repository<Device, DeviceKeys>
  implements IDeviceRepository {
  async getValues(
    deviceKeys: DeviceKeys,
    state: string,
    start: number,
    end: number,
    name: string,
    datapoints: number
  ): Promise<Map<string, any> | null> {
    const device = await this.get(deviceKeys);

    const peripheral = device.peripherals.filter(p => p.name == name)[0];
    if (!peripheral) {
      return null;
    }

    const stateExists = peripheral.states.some(s => s.name == state);
    if (!stateExists) {
      return null;
    }

    const valueMap: Map<string, number> = peripheral.values[state];

    const filteredMap = new Map<string, any>();
    for (const key in valueMap) {
      if (Number(key) > Number(start) && Number(key) < Number(end)) {
        filteredMap.set(key, valueMap[key]);
      }
    }

    if (!datapoints) {
      datapoints = filteredMap.size;
    }

    const averagedMap = new Map<string, any>();
    const partions = (end - start) / datapoints;
    // const partions = filteredMap.size / datapoints;
    const keys = Array.from(filteredMap.keys());
    let averageKeys: number[] = [];
    let missingPoints = 0;
    // for (let i = 0; i < keys.length; i += partions) {
    for (let i = 0; i < end - start; i += partions) {
      // let chunk = keys.slice(i, i + partions);
      const chunk = keys.filter(
        k => Number(k) > start + i && Number(k) < start + i + partions
      );
      let avgKey = 0;
      let avgValue = 0;

      chunk.forEach(key => {
        avgKey += Number(key);
        avgValue += Number(filteredMap.get(key));
      });

      const averageKey = Math.round(avgKey / chunk.length);
      // handle NaNs
      if (averageKey) {
        // has to use this syntax for json to stringify it.
        averagedMap[averageKey] = avgValue / chunk.length;
        averageKeys.push(averageKey);
      } else {
        missingPoints++;
      }
    }

    // if (datapoints > filteredMap.size) {
    //   const averageDiff =
    //     (averageKeys[averageKeys.length - 1] - averageKeys[0]) /
    //     averageKeys.length;
    //   const outOfRangePoints = datapoints - averageKeys.length;

    //   for (let i = 1; i <= outOfRangePoints; i++) {
    //     averagedMap[Math.round(averageKeys[0] - averageDiff * i)] = null;
    //   }
    // }

    for (let i = 1; i <= missingPoints; i++) {
      averagedMap[start + partions * i] = null;
    }

    return averagedMap;
  }

  async getByManufactorerId(
    deviceId: string,
    manufactorer: string
  ): Promise<Device> {
    const params = {
      TableName: this._tableName,
      IndexName: "manufactorerIndex",
      KeyConditionExpression: "manufactorer = :manufactorer",
      FilterExpression: "id = :deviceId",
      ExpressionAttributeValues: {
        ":deviceId": deviceId,
        ":manufactorer": manufactorer
      }
    };

    const resp = await this._db.query(params).promise();
    return resp.Items[0] as Device;
  }

  async saveValues(shadowState: ShadowState): Promise<boolean> {
    const deviceId = shadowState.current.state.reported.deviceId;
    const shadowPeripherals = shadowState.current.state.reported.peripherals;
    const manufactorer = shadowState.current.state.reported.manufactorer;

    const device = await this.getByManufactorerId(deviceId, manufactorer);

    for (const shadowPeripheral of shadowPeripherals) {
      const peripheral = device.peripherals.filter(
        p => (p.name = shadowPeripheral.name)
      )[0];

      peripheral.states.forEach(state => {
        if (!peripheral.values[state.name]) {
          peripheral.values[state.name] = new Map<string, any>();
        }
        peripheral.values[state.name][shadowState.timestamp] =
          shadowPeripheral[state.name];
      });
    }

    return await this.update(device);
  }
}
