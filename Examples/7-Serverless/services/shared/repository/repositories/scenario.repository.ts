import { Scenario } from "../../../scenarios/models/scenario.model";
import { Repository } from "./repository";
import { IScenarioRepository } from "../interfaces/IScenarioRepository";

//Todo add keys
export class ScenarioRepository extends Repository<Scenario, {}> implements IScenarioRepository {}