import { APIGatewayProxyEvent } from "aws-lambda";
import { Scenario } from "../scenarios/models/scenario.model";

export class Utility {
  public static getUserId(event: APIGatewayProxyEvent): string {
    return event.requestContext.authorizer.claims.sub;
  }

  public static generateRuleName(scenario: Scenario) {
    return `${scenario.scenarioName
      .split(" ")
      .join("")
      .substr(0, 15)}_${scenario.id}`
      .split("-")
      .join("_");
  }
}
