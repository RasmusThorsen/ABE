import { IBroker } from "./IBroker";
import * as AWS from "aws-sdk";
import { IThingShadow } from "./IThingShadow";

export class AwsBroker implements IBroker, IThingShadow {
  private readonly _broker = new AWS.IotData({
    endpoint: "a1iyq2icst47as-ats.iot.eu-central-1.amazonaws.com"
  });

  public subscribe() {
    throw new Error("Method not implemented.");
  }

  public async publish(publishRequest: AWS.IotData.PublishRequest) {
    await this._broker.publish(publishRequest).promise();
  }

  public async getThingShadow(thingName: string): Promise<AWS.IotData.JsonDocument> {
    const awsShadow = await this._broker
      .getThingShadow({ thingName })
      .promise();

    return awsShadow.payload;
  }
}
