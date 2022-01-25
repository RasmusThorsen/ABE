import { IThingGroupManager } from "./IThingGroupManager";
import { IThingManger } from "./IThingManager";
import * as AWS from "aws-sdk";
import { AwsBasicResource } from "../../devices/models/awsBasicResource.model";

export class ThingManager implements IThingGroupManager, IThingManger {
  private readonly _iot = new AWS.Iot();

  public async createThingGroup(userId: string): Promise<AwsBasicResource> {
    const thingGroup = await this.getThingGroup(userId);
    if (thingGroup) {
      return thingGroup;
    }

    const resp = await this._iot
      .createThingGroup({ thingGroupName: userId })
      .promise();

    if (resp.$response.error) {
      console.log(resp.$response.error);
      return undefined;
    }

    return {
      arn: resp.thingGroupArn,
      name: resp.thingGroupName
    };
  }

  public async getThingGroup(userId: string): Promise<AwsBasicResource | null> {
    const resp = await this._iot
      .listThingGroups({ maxResults: 1, namePrefixFilter: userId })
      .promise();

    if (resp.thingGroups.length == 0) {
      return null;
    }

    return {
      arn: resp.thingGroups[0].groupArn,
      name: resp.thingGroups[0].groupName
    };
  }

  public async addThingToGroup(thing: AwsBasicResource,group: AwsBasicResource): Promise<boolean> {
    const resp = await this._iot
      .addThingToThingGroup({
        thingArn: thing.arn,
        thingName: thing.name,
        thingGroupArn: group.arn,
        thingGroupName: group.name
      })
      .promise();

    if (resp.$response.error) {
      console.log(resp.$response.error);
      return false;
    }

    return true;
  }

  public async removeThingFromGroup(thing: AwsBasicResource,group: AwsBasicResource): Promise<boolean> {
      const result = await this._iot.removeThingFromThingGroup({
        thingArn: thing.arn,
        thingName: thing.name,
        thingGroupArn: group.arn,
        thingGroupName: group.name
      }).promise();

      if(result.$response.error) {
          return false;
      }

      return true;
  }

  public async createThing(thingName: string): Promise<AwsBasicResource> {
    const resp = await this._iot.createThing({ thingName }).promise();
    if (resp.$response.error) {
      console.log(resp.$response.error);
      return undefined;
    }
    return {
      arn: resp.thingArn,
      name: resp.thingName
    };
  }

  public async deleteThing(thingName: string): Promise<boolean> {
    const result = await this._iot.deleteThing({
        thingName
    }).promise();

    if(result.$response.error) {
        return false;
    }

    return true;
  }
}
