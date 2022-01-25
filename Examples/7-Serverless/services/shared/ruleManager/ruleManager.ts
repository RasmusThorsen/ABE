import { IRuleManager } from "./IRuleManager";
import * as AWS from "aws-sdk";

export class RuleManager implements IRuleManager {
    private readonly _aws = new AWS.Lambda();
    private readonly _iot = new AWS.Iot();

  public async createRule(ruleName: string, scenarioId: string, userId: string, triggerThingName: string, whereClause: string): Promise<boolean> {
    const result = await this._iot
    .createTopicRule({
      ruleName,
      topicRulePayload: {
        awsIotSqlVersion: "2016-03-23",
        sql: `
          SELECT * AS content, '${scenarioId}' AS scenarioId, '${userId}' AS userId
          FROM '$aws/things/${triggerThingName}/shadow/update'
          WHERE ${whereClause}
        `,
        actions: [
          {
            lambda: {
              functionArn:
                "arn:aws:lambda:eu-central-1:059399871100:function:scenario-service-dev-action"
            }
          }
        ]
      }
    })
    .promise();

    if(result.$response.error) {
        return false;
    }

    return true;
  }

  public async deleteRule(ruleName: string): Promise<boolean> {
    const result = await this._iot.deleteTopicRule({
        ruleName
    }).promise()

    if(result.$response.error) {
        return false;
    }

    return true;
  }

  public async addPermission(id: string, ruleName:string): Promise<boolean> {
    const result = await this._aws.addPermission({
        Action: "lambda:InvokeFunction",
        FunctionName: "scenario-service-dev-action",
        Principal: "iot.amazonaws.com",
        StatementId: id,
        SourceAccount: "059399871100",
        SourceArn: `arn:aws:iot:eu-central-1:059399871100:rule/${ruleName}`
      }).promise();

    if(result.$response.error) {
        return false;
    }

    return true;
  }

  public async removePermission(scenarioId: string): Promise<boolean> {
    const result = await this._aws.removePermission({
        StatementId: scenarioId,
        FunctionName: "scenario-service-dev-action"
    }).promise();

    if(result.$response.error) {
        return false;
    }
    return true;
  }
}
