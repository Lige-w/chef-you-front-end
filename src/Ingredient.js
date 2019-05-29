class Ingredient {

    constructor(params) {
        this.quantityId = params.id
        this.ingredientId = params.ingredient_id
        this.name = params.name
        this.unit = params.unit
        this.amount = params.amount
    }

    static parseFormIngredients(e) {
        const ingredientNodes = e.target.querySelectorAll('.ingredient-input')
        const nodesWithValue = [...ingredientNodes].filter(node => !!node.children[2].value || !!node.dataset.quantityId)
        return nodesWithValue.map(node => {
            const ingredientParams = {
                ingredient_attributes: {
                    name: node.children[2].value
                },
                amount: node.children[0].value,
                unit: node.children[1].value
            }

            if(!!node.dataset.quantityId) {ingredientParams.id = node.dataset.quantityId}
            if(!!node.dataset.ingredientId) {ingredientParams.ingredient_attributes.id = node.dataset.ingredientId}

            return ingredientParams
        })
    }

    renderQuantities(node) {
        const ingredient = document.createElement("li")
        ingredient.innerHTML = `<strong>${this.amount} ${this.unit}</strong> ${this.name}`
        node.appendChild(ingredient)
    }
}