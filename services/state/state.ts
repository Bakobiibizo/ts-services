import fs from "fs"

export type State = {
    state: string,
    content: string
}

export class CreateState implements State {
    state: string
    content: string
    constructor(state: string, content: string) {
        this.state = state
        this.content = content
    }
}

export type Manager = {
    state: CreateState
    states: [State]
    states_path: string

    get(): [State],
    add(state: string, description: string): string
    update(key: string, value: string): string,
    remove(key: string): string,

}

export default class StateManager implements Manager {
    state = new CreateState("init", "value")
    states: [State]
    states_path: string
    private constructor(file_path: string = "./states.json") {
        this.states_path = file_path
        this.states = this.get()
    }
    add(state: string, description: string): string {
        this.states.push(new CreateState(state, description))
        fs.writeFileSync(this.states_path, JSON.stringify(this.states))
        return "state added"
    }

    get(): [State] {
        if (!fs.existsSync(this.states_path)) {
            fs.writeFileSync(this.states_path, JSON.stringify(this.states))
            return this.states
        }
        const data = fs.readFileSync(this.states_path, "utf8")
        this.states = JSON.parse(data)
        return this.states
    }
    update(key: string, value: string): string {
        if (!this.states) {
            return "state not found"
        }
        this.states.filter((item, index) => {
            this.states[index].state = key
            this.states[index].content = value
        })
        fs.writeFileSync(this.states_path, JSON.stringify(this.states))
        return "state updated"
    }

    remove(item: string): string {
        if (!this.states) {
            return "state not found"
        }
        this.states.filter((item, index) => {
            this.states.splice(index, 1)
        })
        fs.writeFileSync(this.states_path, JSON.stringify(this.states))
        return `state removed ${item}`
    }
}