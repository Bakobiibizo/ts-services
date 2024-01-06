import { GenericList } from "../commonTypes.dt"


export class Variable {
    [key: string]: any
}

export class VariablesList extends GenericList<Variable>{
    constructor(variables: Variable[]) {
        super();
        this.setItems(...variables)
    }
}