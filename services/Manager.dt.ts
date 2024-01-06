import { AgentList } from "./agentManagement/Agents.dt"
import { GeneratorList } from "./generatorManagement/Generator.dt"


export class Manager {
    agentList: AgentList
    generatorList: GeneratorList

    constructor() {
        this.agentList = new AgentList([])
        this.generatorList = new GeneratorList([])
    }
}