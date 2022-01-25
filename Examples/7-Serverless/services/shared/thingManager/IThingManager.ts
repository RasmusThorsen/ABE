import { AwsBasicResource } from "../../devices/models/awsBasicResource.model";

export interface IThingManger {
    createThing(thingName: string): Promise<AwsBasicResource>
    deleteThing(thingName: string): Promise<boolean>
}