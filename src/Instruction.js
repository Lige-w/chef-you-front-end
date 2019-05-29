class Instruction {

    constructor(params){
        this.id = params.id
        this.description = params.description
    }

    static parseInstructions(e) {
        const instructionNodes = e.target.querySelectorAll('.direction-input')
        const filteredNodes = [...instructionNodes].filter(node => !!node.value || !!node.dataset.id)
        return filteredNodes.map(node => {
            const instructionParams =  {
                description: node.value
            }

            if (!!node.dataset.id) {instructionParams.id = node.dataset.id}

            return instructionParams
        })
    }
}