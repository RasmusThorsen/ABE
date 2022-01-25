export interface IRuleManager {
    createRule(ruleName: string, scenarioId: string, userId: string, triggerThingName: string, whereClause: string): Promise<boolean>
    deleteRule(ruleName: string): Promise<boolean>
    addPermission(id: string, ruleName:string): Promise<boolean>
    removePermission(scenarioId: string): Promise<boolean>
}