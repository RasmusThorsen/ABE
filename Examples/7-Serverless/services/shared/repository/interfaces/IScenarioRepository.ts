import { IRepository } from "./IRepository";
import { Scenario } from "../../../scenarios/models/scenario.model";

interface ScenarioKeys {
    id: string,
    userId: string,
}

export interface IScenarioRepository extends IRepository<Scenario, ScenarioKeys> {}