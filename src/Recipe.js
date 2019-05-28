class Recipe {
    constructor(params) {
        this.id = params.id
        this.name = params.name
        this.description = params.description
        this.servings = params.servings
        if (!!params.quantities) {this.ingredients = params.quantities.map(ingredient => new Ingredient(ingredient))}
        if (!!params.instructions) {this.instructions = params.instructions.map(instruction => instruction.description)}
    }

    //render recipe to User Portal
    renderIndex(node) {
        const listItem = document.createElement('li')
        listItem.addEventListener('click', e => this.getRecipe(e))
        node.appendChild(listItem)

        const title = document.createElement('h3')
        title.innerText = this.name
        listItem.appendChild(title)
    }

    getRecipe(e) {
        fetch(`${Page.RECIPES_URL}/${this.id}`)
            .then(resp => resp.json())
            .then(recipe => {
                const newRecipe = new Recipe(recipe)
                newRecipe.render()
            })
    }

    render() {
        const root = document.getElementById('root')
        root.innerHTML = ""

        const pageOne = document.createElement('div')
        pageOne.classList.add('page-one')
        root.appendChild(pageOne)

        const title = document.createElement('h1')
        title.classList.add('page-title')
        title.innerText = this.name
        pageOne.appendChild(title)

        const description = document.createElement('p')
        description.innerText = this.description
        pageOne.appendChild(description)

        const servings = document.createElement('p')
        servings.innerHTML = `<em>Makes ${this.servings} servings</em>`
        pageOne.appendChild(servings)


        const ingredientHeader = document.createElement('h2')
        ingredientHeader.innerText = 'Ingredients'
        pageOne.appendChild(ingredientHeader)

        const ingredients = document.createElement('ul')
        pageOne.appendChild(ingredients)

        this.ingredients.forEach(ingredient => ingredient.renderQuantities(ingredients))

        const pageTwo = document.createElement('div')
        pageTwo. classList.add('page-two')
        root.appendChild(pageTwo)

        const instructionsHeader = document.createElement('h2')
        instructionsHeader.innerText = 'Instructions'
        pageTwo.appendChild(instructionsHeader)

        const instructions = document.createElement('ol')
        pageTwo.appendChild(instructions)

        this.instructions.forEach(instruction => this.renderInstruction(instructions, instruction))

    }

    renderInstruction(node, instruction) {
        const instructionElement = document.createElement('li')
        instructionElement.innerText = instruction
        node.appendChild(instructionElement)
    }
}