export interface IPolicyManager {
    createPolicy(groupName: string): Promise<string>;
    deletePolicy(policyName:string): Promise<boolean>;
    attachPolicyToArn(policyName: string, arn: string): Promise<boolean>
}