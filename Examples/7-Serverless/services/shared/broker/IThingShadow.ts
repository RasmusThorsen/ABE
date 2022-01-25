export interface IThingShadow {
    getThingShadow(thingName: string): AWS.IotData.JsonDocument;
}