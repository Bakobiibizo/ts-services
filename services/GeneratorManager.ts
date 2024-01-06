import { GeneratorList } from "./generatorManagement/Generator.dt";

export const GeneratorManager = new GeneratorList([])

export const generator = GeneratorManager.getItem("LlamaRequestGenerator")