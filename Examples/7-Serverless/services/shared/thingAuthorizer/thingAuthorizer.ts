import { ICertificateManager } from "./ICertificateManager";
import { IPolicyManager } from "./IPolicyManager";
import { Certificate } from "../../devices/models/certificate.model";
import * as AWS from "aws-sdk";
import { CreatePolicyRequest } from "aws-sdk/clients/iot";

export class ThingAuthorizer implements ICertificateManager, IPolicyManager {
  private readonly _iot = new AWS.Iot();

  public async createPolicy(groupName: string): Promise<string> {
    const tempName = "${iot:Connection.Thing.ThingName}";
    const createPolicyParams: CreatePolicyRequest = {
      policyDocument: `{
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Action": ["iot:Connect"],
              "Resource": "*"
            },
            {
              "Effect": "Allow",
              "Action": [
                "iot:Publish",
                "iot:Receive"
              ],
              "Resource": "arn:aws:iot:eu-central-1:059399871100:topic/$aws/things/${tempName}/shadow/*"
            },
            {
              "Effect": "Allow",
              "Action": "iot:Subscribe",
              "Resource": "arn:aws:iot:eu-central-1:059399871100:topicfilter/$aws/things/${tempName}/shadow/*"
            }
          ]
        }`,
      policyName: `${groupName}-thingpolicy`
    };

    const resp = await this._iot.createPolicy(createPolicyParams).promise();

    if (resp.$response.error) {
      console.log(resp.$response.error);
      return undefined;
    }
    return resp.policyName;
  }

  public async deletePolicy(policyName: string): Promise<boolean>  {
    const result = await this._iot.deletePolicy({
        policyName
    }).promise();

    if(result.$response.error) {
        return false;
    }

    return true;
  }

  public async attachPolicyToArn(policyName: string, arn: string): Promise<boolean> {
    const resp = await this._iot
      .attachPolicy({
        policyName,
        target: arn
      })
      .promise();

    if (resp.$response.error) {
      console.log(resp.$response.error);
      return false;
    }
    return true;
  }


  public async createCertificate(): Promise<Certificate> {
    const resp = await this._iot
      .createKeysAndCertificate({ setAsActive: true })
      .promise();

    if (resp.$response.error) {
      console.log(resp.$response.error);
      return undefined;
    }

    return {
      arn: resp.certificateArn,
      id: resp.certificateId,
      pem: resp.certificatePem,
      publicKey: resp.keyPair.PublicKey,
      privateKey: resp.keyPair.PrivateKey
    };
  }

  public async deleteCertificate(certId: string): Promise<boolean> {
    const result = await this._iot.deleteCertificate({
        certificateId: certId,
        forceDelete: true
    }).promise();

    if(result.$response.error) {
        return false;
    }

    return true;
  }

  public async attachThingToCert(thingName: string, certArn: string): Promise<boolean> {
    const resp = await this._iot
      .attachThingPrincipal({
        thingName,
        principal: certArn
      })
      .promise();

    if (resp.$response.error) {
      console.log(resp.$response.error);
      return false;
    }
    return true;
  }
}
