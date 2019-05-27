class Instruction {
    static parseInstructions(e) {
        const instructionNodes = e.target.querySelectorAll('.direction-input')
        const filteredNodes = [...instructionNodes].filter(node => !!node.value)
        return filteredNodes.map(node => {
            return {description: node.value}
        })
    }
}