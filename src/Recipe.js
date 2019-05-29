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

    //Render Recipe to recipe show page
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

        const editLink = document.createElement('div')
        editLink.classList.add('far', 'fa-edit', 'float-right')
        pageOne.appendChild(editLink)

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

    renderEdit(e) {
        const root = document.getElementById('root')

        const overlay = document.createElement('div')
        overlay.classList.add('overlay')
        root.appendChild(overlay)

        const formWrapper = document.createElement('div')
        formWrapper.classList.add('form-wrapper')
        root.appendChild(formWrapper)

        const pageTitle = document.createElement('h1')
        pageTitle.classList.add('page-title')
        pageTitle.innerText = 'Add A New Recipe'
        formWrapper.appendChild(pageTitle)

        const form = document.createElement('form')
        form.classList.add('recipe-form')
        form.addEventListener('submit', e => this.createRecipe(e))
        formWrapper.appendChild(form)

        const name = document.createElement('input')
        name.placeholder = 'Enter Your Recipe Name'
        form.appendChild(name)

        const servingsWrapper = document.createElement('div')
        form.appendChild(servingsWrapper)

        const servings = document.createElement('input')
        servings.type = 'number'
        servings.placeholder = 'Enter number of servings'
        servingsWrapper.appendChild(servings)

        const description = document.createElement('textarea')
        description.placeholder = "Enter a description of this recipe"
        form.appendChild(description)

        const ingredients = document.createElement('ul')
        ingredients.classList.add('form-ingredients')
        form.appendChild(ingredients)
        User.addIngredientField(e)

        const directions = document.createElement('ol')
        directions.classList.add('form-directions')
        form.appendChild(directions)
        User.addDirectionField(e)

        const submit = document.createElement('input')
        submit.type = 'submit'
        submit.value = 'Add This Recipe'
        form.appendChild(submit)

    }
}