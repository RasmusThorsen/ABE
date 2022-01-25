import { AwsBasicResource } from "../../devices/models/awsBasicResource.model";

export interface IThingGroupManager {
    createThingGroup(userId: string): Promise<AwsBasicResource>;
    getThingGroup(userId: string): Promise<AwsBasicResource> | null;
    addThingToGroup(thing: AwsBasicResource,group: AwsBasicResource): Promise<boolean>
    removeThingFromGroup(thing: AwsBasicResource,group: AwsBasicResource): Promise<boolean>
}