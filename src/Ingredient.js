class Ingredient {

    constructor(params) {
        this.quantityId = params.id
        this.ingredientId = params.ingredient_id
        this.name = params.name
        this.unit = params.unit
        this.amount = params.amount
        this.index = params.index
    }

    static parseFormIngredients(e) {
        const ingredientNodes = e.target.querySelectorAll('.ingredient-input')
        const nodesWithValue = [...ingredientNodes].filter(node => !!node.children[2].value || !!node.dataset.quantityId)
        return nodesWithValue.map((node, index) => {
            const ingredientParams = {
                ingredient_attributes: {
                    name: node.children[2].value
                },
                amount: node.children[0].value,
                unit: Ingredient.parseUnit(node.children[1].value, node.children[0].value),
                index: index
            }

            if(!!node.dataset.quantityId) {ingredientParams.id = node.dataset.quantityId}
            if(!!node.dataset.ingredientId) {ingredientParams.ingredient_attributes.id = node.dataset.ingredientId}

            return ingredientParams
        })
    }

    static parseUnit(unit, amount) {
        const parsedAmount = Ingredient.parseAmount(amount)

        switch(unit.toLowerCase().trim()) {
            case 'tsp':
            case 'tea spoon':
            case 'teaspoon':
            case 'tea spoons':
            case 'teaspoons':
                unit = parsedAmount > 1 ? 'teaspoons' : 'teaspoon'
                break
            case 'c':
            case 'cup':

            case 'cups':
                unit = parsedAmount > 1 ? 'cups' : 'cup'
                break
            case 'tbs':
            case 'tb':
            case 'table spoon':
            case 'tablespoon':
            case 'table spoons':
            case 'tablespoons':
                unit = parsedAmount > 1 ? 'tablespoons' : 'tablespoon'
                break
            case 't':
                if (unit === 'T') {
                    unit = parsedAmount > 1 ? 'tablespoons' : 'tablespoon'
                } else {
                    unit = parsedAmount > 1 ? 'teaspoons' : 'teaspoon'
                }
                break
            case 'lb':
            case 'lbs':
            case 'pounds':
            case 'pound':
                unit = parsedAmount > 1 ? 'pounds' : 'pound'
                break
            default:
                unit.trim()
        }
        return unit
    }

    static  parseAmount(amount) {
        const split = amount.split('/')
        if (split[0].split(' ').length > 1 || split.length !== 2) {
            return parseInt(amount)
        } else {
            return parseInt(split[0], 10) / parseInt(split[1], 10)
        }
    }

    renderQuantities(node) {
        const ingredient = document.createElement("li")
        ingredient.innerHTML = `<strong>${this.amount} ${this.unit}</strong> - ${this.name}`
        node.appendChild(ingredient)
    }


}
