import { Step, PeripheralStateChange, TriggerStep } from "./models/step.model";
import * as AWS from "aws-sdk";
import { ConditionLogic } from "./models/conditionLogic.model";
import { AwsBroker } from "../shared/broker/AwsBroker";
import { UnitOfWork } from "../shared/repository/unitOfWork";

const broker = new AwsBroker();
const uow = new UnitOfWork();

export const action = async (event, _context) => {
  const scenario = await uow.scenarios.get({id: event.scenarioId, userId: event.userId});

  if (!scenario) {
    return;
  }
  
  const triggerStep = scenario.steps.find(
    s => s.type === "trigger"
  ) as TriggerStep;

  const next: string[] = [];
  triggerStep.connections.forEach(c => {
    next.push(c.end.stepId);
  });
  for (const s of scenario.steps.filter(s => next.includes(s.id))) {
    await invokeAction(s, scenario.steps);
  }
};

const invokeAction = async (currentStep: Step, allSteps: Step[]) => {
  const triggerStep = allSteps.find(s => s.type === "trigger");
  if (
    currentStep.type === "action" &&
    currentStep.deviceId !== triggerStep.deviceId
  ) {
    await broker
      .publish({
        qos: 0,
        topic: `$aws/things/${currentStep.thingName}/shadow/update`,
        payload: `{
              "state": {
                  "desired": {
                      "peripherals": ${JSON.stringify(
                        currentStep.stateChanges.map(s => parseState(s))
                      )}
                  }
              }
          }`
      });
  } else if (currentStep.type === "condition") {

    const awsShadow = await broker
      .getThingShadow(currentStep.thingName);

    if (validateCondition(currentStep.conditionLogic, awsShadow)) {
      for (const c of currentStep.connections) {
        const step = allSteps.find(s => s.id === c.end.stepId);
        await invokeAction(step, allSteps);
      }
    }
  }
};

function parseState(s: PeripheralStateChange) {
  const stateChanges: { [key: string]: string | number | boolean } = {};
  stateChanges["name"] = s.peripheralName;
  s.desiredStates.forEach(d => {
    stateChanges[d.name] = d.value;
  });
  return stateChanges;
}

function validateCondition(condition: ConditionLogic, shadowJson: AWS.IotData.JsonDocument): boolean {
  const shadow = JSON.parse(shadowJson.toString());
  switch (condition.logicalOperator) {
    case "and": {
      let result = false;
      if (condition.conditions.length >= 2) {
        result =
          validateCondition(condition.conditions[0], shadow) &&
          validateCondition(condition.conditions[1], shadow);
      }

      if (condition.conditions.length > 2) {
        for (let i = 2; i < condition.conditions.length; i += 2) {
          result =
            result &&
            validateCondition(condition.conditions[i], shadow) &&
            (i + 1 <= condition.conditions.length - 1
              ? validateCondition(condition.conditions[i + 1], shadow)
              : true);
        }
      }

      return result;
    }
    case "or": {
      let result = false;
      if (condition.conditions.length >= 2) {
        result =
          validateCondition(condition.conditions[0], shadow) ||
          validateCondition(condition.conditions[1], shadow);
      }

      if (condition.conditions.length > 2) {
        for (let i = 2; i < condition.conditions.length; i += 2) {
          result =
            result ||
            validateCondition(condition.conditions[i], shadow) ||
            (i + 1 <= condition.conditions.length - 1
              ? validateCondition(condition.conditions[i + 1], shadow)
              : false);
        }
      }

      return result;
    }
    case "equalTo": {
      const p = shadow.state.reported.peripherals.find(
        p => p.name === condition.peripheralName
      );
      return p[condition.stateName] === condition.conditionStateValue;
    }
    case "greaterThan": {
      const p = shadow.state.reported.peripherals.find(
        p => p.name === condition.peripheralName
      );
      return p[condition.stateName] > condition.conditionStateValue;
    }
    case "lessThan": {
      const p = shadow.state.reported.peripherals.find(
        p => p.name === condition.peripheralName
      );
      return p[condition.stateName] < condition.conditionStateValue;
    }
    case "inBetween": {
      const p = shadow.state.reported.peripherals.find(
        p => p.name === condition.peripheralName
      );
      return (
        p[condition.stateName] > condition.conditionStateValue.min &&
        p[condition.stateName] < condition.conditionStateValue.max
      );
    }
    default:
      return false;
  }
}
