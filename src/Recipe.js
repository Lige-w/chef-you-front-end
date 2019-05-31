class Recipe {
    constructor(params) {
        this.id = params.id
        this.name = params.name
        this.description = params.description
        this.servings = params.servings
        if (!!params.quantities) {
            this.ingredients = params.quantities.map(ingredient => new Ingredient(ingredient))
                .filter(ingredient => !!ingredient.name)
                .sort((a, b) => a.index - b.index)
        }
        if (!!params.instructions) {
            this.instructions = params.instructions.map(instruction => new Instruction(instruction))
                .sort((a, b) => a.index - b.index)
        }
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
        this.setCurrentPage()

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

        const editLink = document.createElement('i')
        editLink.classList.add('far', 'fa-edit', 'edit-link')
        editLink.addEventListener('click', e => this.renderEdit(e))
        controlWrapper.appendChild(editLink)

        const deleteLink = document.createElement('i')
        deleteLink.classList.add('fas', 'fa-trash', 'delete-link')
        deleteLink.addEventListener('click', e => this.renderDeleteModal(e))
        controlWrapper.appendChild(deleteLink)

        const description = document.createElement('p')
        description.innerText = this.description
        pageOne.appendChild(description)

        if (this.servings) {
            const servings = document.createElement('p')
            servings.innerHTML = `<em>Makes ${this.servings} ${this.servings === 1 ? 'serving' : 'servings'}</em>`
            pageOne.appendChild(servings)
        }

        const ingredientHeader = document.createElement('h2')
        ingredientHeader.innerText = 'Ingredients'
        pageOne.appendChild(ingredientHeader)

        const ingredients = document.createElement('ul')
        pageOne.appendChild(ingredients)

        if(!!this.ingredients) {this.ingredients.forEach(ingredient => ingredient.renderQuantities(ingredients))}

        const pageTwo = document.createElement('div')
        pageTwo. classList.add('page-two')
        root.appendChild(pageTwo)

        const instructionsHeader = document.createElement('h2')
        instructionsHeader.innerText = 'Instructions'
        pageTwo.appendChild(instructionsHeader)

        const instructions = document.createElement('ol')
        pageTwo.appendChild(instructions)

        if(!!this.instructions) {
            this.instructions.forEach(instruction => this.renderInstruction(instructions, instruction))
        }

        Page.currentUser.renderLeftArrow()

        if (Page.currentPage + 1 < Page.currentUser.recipes.length) {Page.currentUser.renderRightArrow()}

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
        formWrapper.classList.add('form-wrapper', 'modal')
        body.appendChild(formWrapper)

        const pageTitle = document.createElement('h1')
        pageTitle.classList.add('page-title')
        pageTitle.innerText = 'Edit Recipe'
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

        const ingredientsHeader = document.createElement('h3')
        ingredientsHeader.innerText = 'Ingredients'
        form.appendChild(ingredientsHeader)

        const addIngredient = document.createElement('i')
        addIngredient.classList.add('fas', 'fa-plus', 'add')
        addIngredient.addEventListener('click', Recipe.prependIngredientRow)
        ingredientsHeader.appendChild(addIngredient)

        const ingredients = document.createElement('ul')
        ingredients.classList.add('form-ingredients')
        form.appendChild(ingredients)

        this.ingredients.forEach(Recipe.addIngredientField)

        User.addIngredientField(e)

        const instructionsHeader = document.createElement('h3')
        instructionsHeader.innerText = 'Instructions'
        form.appendChild(instructionsHeader)

        const addInstruction = document.createElement('i')
        addInstruction.classList.add('fas', 'fa-plus', 'add')
        addInstruction.addEventListener('click', Recipe.prependInstructionField)
        instructionsHeader.appendChild(addInstruction)

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
        submit.value = 'Edit This Recipe'
        submitWrapper.appendChild(submit)

    }

    //adds fields for existing ingredients on edit page
    static addIngredientField(ingredient) {

        const ingredients = document.querySelector('.form-ingredients')

        const ingredientRow = Recipe.ingredientRow(ingredient)
        ingredients.appendChild(ingredientRow)
        ingredientRow.addEventListener('input', () => delete(ingredientRow.dataset.ingredientId))

    }

    static ingredientRow(ingredient) {
        const ingredientRow = document.createElement('li')
        ingredientRow.dataset.quantityId = ingredient.quantityId
        ingredientRow.dataset.ingredientId = ingredient.ingredientId
        ingredientRow.classList.add('ingredient-input')

        const qty = document.createElement('input')
        qty.value = ingredient.amount
        ingredientRow.appendChild(qty)

        const unit = document.createElement('input')
        unit.value = ingredient.unit
        ingredientRow.appendChild(unit)

        const ingredientInput = document.createElement('input')
        ingredientInput.value = ingredient.name
        ingredientRow.appendChild(ingredientInput)

        const addAfter = document.createElement('i')
        addAfter.classList.add('fas', 'fa-plus', 'add')
        addAfter.addEventListener('click', e => Recipe.addIngredientFieldAfter(e))
        ingredientRow.appendChild(addAfter)

        return ingredientRow
    }

    static addIngredientFieldAfter(e) {
        const ingredients = document.querySelector('.form-ingredients')

        e.target.previousElementSibling.removeEventListener('input', User.addIngredientField)

        const nextIngredientRow = e.target.parentElement.nextElementSibling

        const ingredientRow = User.ingredientRow()
        ingredientRow.children[2].removeEventListener('input', User.addIngredientField)
        ingredients.insertBefore(ingredientRow, nextIngredientRow)
    }

    static prependIngredientRow(e) {
        const ingredients = document.querySelector('.form-ingredients')
        const ingredientRow = User.ingredientRow()
        ingredientRow.children[2].removeEventListener('input', User.addIngredientField)
        ingredients.prepend(ingredientRow)

    }

    // adds fields for existing instructions
    static addInstructionField(instruction) {
        const directions = document.querySelector('.form-directions')
        const directionWrapper = Recipe.instructionField(instruction)
        directions.appendChild(directionWrapper)

    }

    static instructionField(instruction) {
        const directionWrapper = document.createElement('li')

        const direction = document.createElement('textarea')
        direction.classList.add('direction-input')
        direction.dataset.id = instruction.id
        direction.value = instruction.description
        directionWrapper.appendChild(direction)

        const addAfter = document.createElement('i')
        addAfter.classList.add('fas', 'fa-plus', 'add')
        addAfter.addEventListener('click', Recipe.addInstructionAfter)
        directionWrapper.appendChild(addAfter)

        return directionWrapper
    }

    static addInstructionAfter(e) {
        const directions = document.querySelector('.form-directions')

        e.target.previousElementSibling.removeEventListener('input', User.addDirectionField)

        const nextDirectionRow = e.target.parentElement.nextElementSibling

        const directionField = User.directionField()
        directionField.children[0].removeEventListener('input', User.addDirectionField)
        directions.insertBefore(directionField, nextDirectionRow)
    }

    static prependInstructionField(e) {
        const directions = document.querySelector('.form-directions')

        const instructionField = User.directionField()
        instructionField.children[0].removeEventListener('input', User.addDirectionField)
        directions.prepend(instructionField)
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

                const userRecipes = Page.currentUser.recipes
                const index = userRecipes.indexOf(userRecipes.find(userRecipe => userRecipe.id === recipe.id))

                userRecipes[index] = new Recipe(recipe)

                userRecipes[index].render()
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
        choicesWrapper.classList.add('modal')
        deleteWrapper.appendChild(choicesWrapper)

        const yes = document.createElement('button')
        yes.innerText = "Yes, delete this recipe."
        yes.addEventListener('click', e => this.deleteRecipe(e))
        choicesWrapper.appendChild(yes)

    }

    deleteRecipe(e) {

        fetch(`${Page.RECIPES_URL}/${this.id}`, Page.configObj('DELETE', {}))
            .then((resp) => resp.json())
            .then(user => {
                document.querySelector('.overlay').remove()
                document.querySelector('#delete-wrapper').remove()
                user = new User(user)
                Page.currentUser = user
                user.renderUserPortal()
            })
            .catch(console.log)

    }

    setCurrentPage () {
        const userRecipes = Page.currentUser.recipes
        const index = userRecipes.indexOf(userRecipes.find(recipe => recipe.id === this.id))
        Page.currentPage = index
    }

}