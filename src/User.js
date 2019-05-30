class User {

    constructor(params) {
        this.id = params.id
        this.username = params.username
        this.recipes = params.recipes.map(recipe => new Recipe(recipe))
        Page.currentUser = this
    }

    static register(e) {
        e.preventDefault()

        const body = {
            username: e.target.firstElementChild.value
        }

        fetch(Page.USERS_URL, Page.configObj('POST', body))
            .then(resp => resp.json())
            .then(user => {
                const loggedIn = new User(user)
                loggedIn.renderUserPortal()
            })
    }

    static login(e) {
        e.preventDefault()
         const body = {
            username: e.target.firstElementChild.value
         }

        fetch(Page.LOGIN_URL, Page.configObj('POST', body))
            .then(resp => resp.json())
            .then(user => {
                const loggedIn = new User(user)
                loggedIn.renderUserPortal()
            })
            .catch(console.log)
    }

    renderUserPortal() {
        const root = document.getElementById('root')
        root.innerHTML = ''
        root.classList.add('open')

        const pageOne = document.createElement('div')
        pageOne.classList.add('page-one')
        root.appendChild(pageOne)

        const title = document.createElement('h1')
        title.classList.add('page-title')
        title.innerText = 'The Greatest Recipes in the World'
        pageOne.appendChild(title)

        const author = document.createElement('h3')
        author.innerText = `By ${this.username}`
        pageOne.appendChild(author)

        const pageTwo = document.createElement('div')
        pageTwo. classList.add('page-two')
        root.appendChild(pageTwo)

        const contentsWrapper = document.createElement('div')
        pageTwo.appendChild(contentsWrapper)

        const recipeSubheader = document.createElement("h2")
        recipeSubheader.innerText = 'Recipes'
        contentsWrapper.appendChild(recipeSubheader)

        const addRecipe = document.createElement('a')
        addRecipe.innerText = "+ add a recipe"
        addRecipe.addEventListener('click', e => this.renderRecipeForm(e))
        contentsWrapper.appendChild(addRecipe)

        const recipes = document.createElement('ul')
        recipes.id = 'recipe-list'
        contentsWrapper.appendChild(recipes)

        const rightArrow = document.createElement('div')

        this.recipes.forEach(recipe => recipe.renderIndex(recipes))

    }

    renderRecipeForm(e) {
        const body = document.querySelector('body')

        const overlay = Page.renderOverlay()
        body.appendChild(overlay)


        const formWrapper = document.createElement('div')
        formWrapper.classList.add('form-wrapper', 'modal')
        body.appendChild(formWrapper)

        const pageTitle = document.createElement('h1')
        pageTitle.classList.add('page-title')
        pageTitle.innerText = 'Add A New Recipe'
        formWrapper.appendChild(pageTitle)

        const form = Page.formElement(e)
        form.addEventListener('submit', e => this.createRecipe(e))
        formWrapper.appendChild(form)

        User.addIngredientField(e)
        User.addDirectionField(e)
    }

    static addIngredientField(e) {
        e.target.removeEventListener('input', User.addIngredientField)
        const ingredients = document.querySelector('.form-ingredients')

        const ingredientRow = document.createElement('li')
        ingredientRow.classList.add('ingredient-input')
        ingredients.appendChild(ingredientRow)

        const qty = document.createElement('input')
        qty.placeholder = 'Amount'
        qty.type = 'number'
        ingredientRow.appendChild(qty)

        const unit = document.createElement('input')
        unit.placeholder = 'Unit of measure'
        ingredientRow.appendChild(unit)

        const ingredient = document.createElement('input')
        ingredient.addEventListener('input', User.addIngredientField)
        ingredient.placeholder = 'Ingredient'
        ingredientRow.appendChild(ingredient)
    }

    static addDirectionField(e) {
        e.target.removeEventListener('input', User.addDirectionField)

        const directions = document.querySelector('.form-directions')

        const directionWrapper = document.createElement('li')
        directions.appendChild(directionWrapper)

        const direction = document.createElement('textarea')
        direction.classList.add('direction-input')
        direction.placeholder = 'Add an instruction step'
        direction.addEventListener('input', User.addDirectionField)
        directionWrapper.appendChild(direction)
    }

    createRecipe(e) {
        e.preventDefault()

        const body = {
            recipe: {
                user_id: this.id,
                name: e.target[0].value,
                servings: e.target[1].value,
                description: e.target[2].value,
                quantities_attributes: Ingredient.parseFormIngredients(e),
                instructions_attributes: Instruction.parseInstructions(e)
            }
        }

        fetch(Page.RECIPES_URL, Page.configObj("POST", body))
            .then(resp => resp.json())
            .then(recipe => {
                document.querySelector('.overlay').remove()
                document.querySelector('.form-wrapper').remove()
                const newRecipe = new Recipe(recipe)
                newRecipe.render()
            })
            .catch(console.log)
    }

}