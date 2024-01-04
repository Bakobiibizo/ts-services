import { qauackersPromptList } from "../../../../services/promptManagement/prompts/qaPrompts";

import { Agent, VariableListItem, VariablesList } from "../../../../services/agentManagement/agentManager.dt";
import { qauackersVariableList } from '../../../../services/agentManagement/agents/QAuackers';

describe('code snippet', () => {

    // Creating a new instance of Agent with valid parameters should return an Agent object.
    it('should return an Agent object when creating a new instance of Agent with valid parameters', () => {
        const agent = new Agent(qauackersVariableList.name, qauackersVariableList.name, qauackersPromptList, qauackersVariableList);
        expect(agent).toBeInstanceOf(Agent);
    });

    // Creating a new instance of VariablesList with valid parameters should return a VariablesList object.
    it('should return a VariablesList object when creating a new instance of VariablesList with valid parameters', () => {
        const variablesList = new VariablesList([{
            name: "VariableName",
            value: "VariableValue"
        }]);
        expect(variablesList).toBeInstanceOf(VariablesList);
    });

    // Adding a new VariableListItem to a VariablesList with invalid parameters should throw an error.
    it('should throw an error when adding a new VariableListItem to a VariablesList with invalid parameters', () => {
        const variablesList = new VariablesList([]);
        expect(() => {
            variablesList.setItems({
                name: "",
                value: "VariableValue"
            });
        }).toThrow();
    });
});
