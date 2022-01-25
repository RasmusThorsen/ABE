export interface IBroker {
    publish(publishRequest: AWS.IotData.PublishRequest);
    subscribe();
}