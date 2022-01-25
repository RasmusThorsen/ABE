import { IRepository } from "../interfaces/IRepository";
import { DynamoDB } from "aws-sdk";
// import { QueryInput } from "aws-sdk/clients/dynamodb";

export class Repository<T, U> implements IRepository<T, U> {
  readonly keywords = ["id", "name", "type", "boolean", "number", "values"];

  protected readonly _db = new DynamoDB.DocumentClient({
    region: "eu-central-1",
    convertEmptyValues: true
  });

  protected _tableName: string;

  constructor(tableName: string) {
    this._tableName = tableName;
  }

  public async get(keys: U): Promise<T> {
    const resp = await this._db
      .get({
        TableName: this._tableName,
        Key: keys
      })
      .promise();

    if (resp.$response.error) {
      return null;
    }

    return <T>resp.Item;
  }

  public async getAll(key: {[keyName: string]: string}, query: string[] = []): Promise<T[]> {
    const propertiesToGet: string[] = [];
    const attributeNames = {};
    let expression: boolean = false;
    expression;
    const keyName: string = Object.keys(key)[0];
    console.log(key);
    
    query.forEach(q => {
      if (this.keywords.includes(q)) {
        propertiesToGet.push(q.padStart(q.length + 1, "#"));
        attributeNames[q.padStart(q.length + 1, "#")] = q;
        expression = true;
      } else {
        propertiesToGet.push(q);
      }
    });
    
    const params = {
      TableName: this._tableName,
      KeyConditionExpression: `${keyName} = :key`,
      ExpressionAttributeValues: {
        ":key": key[keyName]
      }
    };

    
    if (query.length > 0) {
      params["ProjectionExpression"] = propertiesToGet.join(",");

      if (expression) {
        params["ExpressionAttributeNames"] = attributeNames;
      }
    }
    
    const resp = await this._db.query(params).promise();
    
    if (resp.$response.error) {
      return null;
    }
    return <T[]>resp.Items;
  }

  public async add(entity: T): Promise<T | null> {
    const resp = await this._db
      .put({
        TableName: this._tableName,
        Item: {
          ...entity
        }
      })
      .promise();

    if (resp.$response.error) {
      return null;
    }

    return <T>resp.$response.data;
  }
  
  public async addRange(entities: T[]): Promise<void> {
    for(const e of entities) {
      await this.add(e);
    }
  }

  public async update(entity: T): Promise<boolean> {
    const result = await this.add(entity);
    if(!result) {
      return false;
    }

    return true;
  }

  public async remove(keys: U): Promise<boolean> {
    const resp = await this._db.delete({
      TableName: this._tableName,
      Key: keys
    }).promise();

    if(resp.$response.error) {
      return false;
    }

    return true;
  }

  public async removeRange(keys: U[]): Promise<void> {
    for(const k of keys) {
      await this.remove(k);
    }
  }
}
