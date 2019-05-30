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
                unit: Ingredient.parseUnit(node.children[1].value, node.children[0].value)
            }

            if(!!node.dataset.quantityId) {ingredientParams.id = node.dataset.quantityId}
            if(!!node.dataset.ingredientId) {ingredientParams.ingredient_attributes.id = node.dataset.ingredientId}

            return ingredientParams
        })
    }

    static parseUnit(unit, amount) {
        switch(unit.toLowerCase().trim()) {
            case 'tsp':
            case 'tea spoon':
            case 'teaspoon':
            case 'tea spoons':
            case 'teaspoons':
                unit = amount > 1 ? 'teaspoons' : 'teaspoon'
                break
            case 'c':
            case 'cup':

            case 'cups':
                unit = amount > 1 ? 'cups' : 'cup'
                break
            case 'tbs':
            case 'tb':
            case 'table spoon':
            case 'tablespoon':
            case 'table spoons':
            case 'tablespoons':
                unit = amount > 1 ? 'tablespoons' : 'tablespoon'
                break
            case 't':
                if (unit === 'T') {
                    unit = amount > 1 ? 'tablespoons' : 'tablespoon'
                } else {
                    unit = amount > 1 ? 'teaspoons' : 'teaspoon'
                }
                break
            case 'lb':
            case 'lbs':
            case 'pounds':
            case 'pound':
                unit = amount > 1 ? 'cups' : 'cup'
                break
            default:
                unit.trim()
        }
        return unit
    }

    renderQuantities(node) {
        const ingredient = document.createElement("li")
        ingredient.innerHTML = `<strong>${this.amount} ${this.unit}</strong> ${this.name}`
        node.appendChild(ingredient)
    }
}
