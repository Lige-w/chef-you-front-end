class Recipe {
    constructor(params) {
        this.id = params.id
        this.name = params.name
        this.description = params.description
        this.servings = params.servings
        if (!!params.quantities) {this.ingredients = params.quantities.map(ingredient => new Ingredient(ingredient))}
        if (!!params.instructions) {this.instructions = params.instructions.map(instruction => new Instruction(instruction))}
    }

    //render recipe to User Portal
    renderIndex(node) {
        const listItem = document.createElement('li')
        node.appendChild(listItem)

        const title = document.createElement('h3')
        title.innerText = this.name
        title.addEventListener('click', e => this.getRecipe(e))
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

        const controlWrapper = document.createElement("div")
        controlWrapper.classList.add('control-wrapper')
        pageOne.appendChild(controlWrapper)

        const editLink = document.createElement('div')
        editLink.classList.add('far', 'fa-edit', 'edit-link')
        editLink.addEventListener('click', e => this.renderEdit(e))
        controlWrapper.appendChild(editLink)

        const deleteLink = document.createElement('div')
        deleteLink.classList.add('fas', 'fa-trash', 'delete-link')
        deleteLink.addEventListener('click', e => this.renderDeleteModal(e))
        controlWrapper.appendChild(deleteLink)

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
        instructionElement.innerText = instruction.description
        node.appendChild(instructionElement)
    }

    renderEdit(e) {
        const body = document.querySelector('body')

        const overlay = document.createElement('div')
        overlay.classList.add('overlay')
        overlay.addEventListener('click', e => {
            e.target.nextElementSibling.remove()
            e.target.remove()
        })
        body.appendChild(overlay)

        const formWrapper = document.createElement('div')
        formWrapper.classList.add('form-wrapper')
        body.appendChild(formWrapper)

        const pageTitle = document.createElement('h1')
        pageTitle.classList.add('page-title')
        pageTitle.innerText = 'Add A New Recipe'
        formWrapper.appendChild(pageTitle)

        const form = document.createElement('form')
        form.classList.add('recipe-form')
        form.addEventListener('submit', e => this.updateRecipe(e))
        formWrapper.appendChild(form)

        const name = document.createElement('input')
        name.value = this.name
        form.appendChild(name)

        const servingsWrapper = document.createElement('div')
        form.appendChild(servingsWrapper)

        const servings = document.createElement('input')
        servings.type = 'number'
        servings.value = this.servings
        servingsWrapper.appendChild(servings)

        const description = document.createElement('textarea')
        description.value = this.description
        form.appendChild(description)

        const ingredients = document.createElement('ul')
        ingredients.classList.add('form-ingredients')
        form.appendChild(ingredients)

        this.ingredients.forEach(Recipe.addIngredientField)

        User.addIngredientField(e)

        const directions = document.createElement('ol')
        directions.classList.add('form-directions')
        form.appendChild(directions)

        this.instructions.forEach(Recipe.addInstructionField)
        User.addDirectionField(e)

        const submitWrapper = document.createElement('div')
        submitWrapper.classList.add('submit')
        form.appendChild(submitWrapper)

        const submit = document.createElement('input')
        submit.type = 'submit'
        submit.value = 'Add This Recipe'
        submitWrapper.appendChild(submit)

    }

    //adds fields for existing ingredients on edit page
    static addIngredientField(ingredient) {

        const ingredients = document.querySelector('.form-ingredients')

        const ingredientRow = document.createElement('li')
        ingredientRow.dataset.quantityId = ingredient.quantityId
        ingredientRow.dataset.ingredientId = ingredient.ingredientId
        ingredientRow.classList.add('ingredient-input')
        ingredients.appendChild(ingredientRow)

        const qty = document.createElement('input')
        qty.type = 'number'
        qty.value = ingredient.amount
        ingredientRow.appendChild(qty)

        const unit = document.createElement('input')
        unit.value = ingredient.unit
        ingredientRow.appendChild(unit)

        const ingredientInput = document.createElement('input')
        ingredientInput.value = ingredient.name
        ingredientRow.addEventListener('input', () => delete(ingredientRow.dataset.ingredientId))
        ingredientRow.appendChild(ingredientInput)
    }

    // adds fields for existing instructions
    static addInstructionField(instruction) {
        const directions = document.querySelector('.form-directions')

        const directionWrapper = document.createElement('li')
        directions.appendChild(directionWrapper)

        const direction = document.createElement('textarea')
        direction.classList.add('direction-input')
        direction.dataset.id = instruction.id
        direction.value = instruction.description
        directionWrapper.appendChild(direction)
    }

    updateRecipe(e) {
        e.preventDefault()

        const body = {
            recipe: {
                user_id: Page.currentUser.id,
                name: e.target[0].value,
                servings: e.target[1].value,
                description: e.target[2].value,
                quantities_attributes: Ingredient.parseFormIngredients(e),
                instructions_attributes: Instruction.parseInstructions(e)
            }
        }

        fetch(`${Page.RECIPES_URL}/${this.id}`, Page.configObj('PATCH', body))
            .then(resp => resp.json())
            .then(recipe => {
                document.querySelector('.overlay').remove()
                document.querySelector('.form-wrapper').remove()
                const updatedRecipe = new Recipe(recipe)
                updatedRecipe.render()
            })
            .catch(console.log)

    }

    renderDeleteModal(e) {
        const body = document.querySelector('body')

        const overlay = Page.renderOverlay()
        body.appendChild(overlay)

        const deleteWrapper = document.createElement('div')
        deleteWrapper.id = 'delete-wrapper'
        body.appendChild(deleteWrapper)

        const choicesWrapper = document.createElement('div')
        choicesWrapper.innerText = `Are you sure you want to delete ${this.name}?`
        deleteWrapper.appendChild(choicesWrapper)

        const yes = document.createElement('button')
        yes.innerText = "Yes, delete this recipe."
        yes.addEventListener('click', e => this.deleteRecipe(e))
        choicesWrapper.appendChild(yes)

    }

    deleteRecipe(e) {
        debugger

        fetch(`${Page.RECIPES_URL}/${this.id}`, Page.configObj('DELETE', {}))
            .then(() => {
                debugger
                Page.currentUser.recipes
                Page.currentUser.render()
            })
            .catch(console.log)

    }
}