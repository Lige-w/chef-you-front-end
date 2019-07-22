class Instruction {

    constructor(params){
        this.id = params.id
        this.description = params.description
        this.index = params.index
    }

    static parseInstructions(e) {
        const instructionNodes = e.target.querySelectorAll('.direction-input')
        const filteredNodes = [...instructionNodes].filter(node => !!node.value || !!node.dataset.id)
        return filteredNodes.map((node, index) => {
            const instructionParams =  {
                description: node.value,
                index: index
            }

            if (!!node.dataset.id) {instructionParams.id = node.dataset.id}

            return instructionParams
        })
    }
}