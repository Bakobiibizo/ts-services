
export type Agent = {
    name: string
    description: string
    promptlist: [
    ]
}


export type Manager = {
    agentList: Agent[]

    add(agent: Agent): string
    get(): [Agent]
    update(agent: Agent): string
    remove(agent: Agent): string
}
