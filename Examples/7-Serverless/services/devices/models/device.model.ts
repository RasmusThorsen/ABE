import {
  BasePeripheral,
  PostPeripheralDto,
  GetPeripheralDto,
  Peripheral
} from "./peripheral.model";

export interface BaseDevice<T extends BasePeripheral> {
  displayName: string;
  description?: string;
  manufactorer: string;
  type: string;
  peripherals: T[];
}

export interface Device extends BaseDevice<Peripheral> {
  id: string;
  userId: string;
  thingName: string;
}

export interface PostDeviceResponseDto extends BaseDevice<PostPeripheralDto> {
  pem: string;
  privateKey: string
}

export interface PostDeviceDto extends BaseDevice<PostPeripheralDto> {}
export interface GetDeviceDto extends BaseDevice<GetPeripheralDto> {}

