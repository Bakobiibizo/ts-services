import state from 'state';
export default class StateManager {
    stateList: State = []
    private constructor() {
        this.stateList = []
    }

    addState(state: string): string {
        this.stateList.push(state)
        return "state added"
    }

    getStateList(): string[] {
        return this.stateList
    }

    updateState(stateName: string, newState: string): string {
        this.stateList.map((item) => {
            if (item === stateName) {
                item = newState
                return "state updated"
            }
            return "state not found"
        })
    }

    removeState(stateName: string): string {
        this.stateList.filter((item) => {
            item !== stateName
            return "state removed"
        })
    }
}