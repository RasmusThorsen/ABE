import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient({ region: "eu-central-1" });

export class Validator {
  public static async checkDeviceId(deviceId: string, userId: string): Promise<boolean> {
    const params = {
      TableName: "devices-table",
      Key: {
        id: deviceId,
        userId: userId
      }
    };

    const result = await db.get(params).promise();

    if(result.Item == null) {
        return false;
    } 

    return true;
  }

  public static async firstDevice(userId: string): Promise<boolean> {
    const params = {
      TableName: "devices-table",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      }
    };
  
    const result = await db.query(params).promise();
    if(result.Items.length == 0) {
      return true;
    }

    return false;
  }
}
