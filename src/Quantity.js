class Quantity {
    static parseFormIngredients(e) {
        const ingredientNodes = e.target.querySelectorAll('.ingredient-input')
        const nodesWithValue = [...ingredientNodes].filter(node => !!node.children[2].value)
        return nodesWithValue.map(node => {
            return {
                ingredient_attributes: {name: node.children[2].value},
                amount: node.children[0].value,
                unit: node.children[1].value

            }
        })
    }
}