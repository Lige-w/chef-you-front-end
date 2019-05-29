class Instruction {

    constructor(params){
        this.quantityId = params.id
        this.ingredientId = params.ingredient_id
        this.description = params.description
    }

    static parseInstructions(e) {
        const instructionNodes = e.target.querySelectorAll('.direction-input')
        const filteredNodes = [...instructionNodes].filter(node => !!node.value)
        return filteredNodes.map(node => {
            return {description: node.value}
        })
    }
}