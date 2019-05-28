class User {

    constructor(params) {
        this.id = params.id
        this.username = params.username
        this.recipes = params.recipes.map(recipe => new Recipe(recipe))
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
        const username = e.target.firstElementChild.value

        fetch(Page.USERS_URL)
            .then(resp => resp.json())
            .then(users => {
                const thisUser = users.find(user => user.username === username)
                const loggedIn = new User(thisUser)
                loggedIn.renderUserPortal()
            })
            .catch(console.log)
    }

    renderUserPortal() {
        const root = document.getElementById('root')
        root.innerHTML = ''
        root.classList.add('open')

        const title = document.createElement('h1')
        title.classList.add('page-title')
        title.innerText = 'The Greatest Recipes in the World'
        root.appendChild(title)

        const author = document.createElement('h3')
        author.innerText = `By ${this.username}`
        root.appendChild(author)

        const contentsWrapper = document.createElement('div')
        root.appendChild(contentsWrapper)

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


        this.recipes.forEach(recipe => recipe.renderIndex(recipes))

    }

    renderRecipeForm(e) {
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

    static addIngredientField(e) {
        e.target.removeEventListener('input', User.addIngredientField)
        const ingredients = document.querySelector('.form-ingredients')

        const ingredientRow = document.createElement('li')
        ingredientRow.classList.add('ingredient-input')
        ingredients.appendChild(ingredientRow)

        const qty = document.createElement('input')
        qty.type = 'number'
        ingredientRow.appendChild(qty)

        const unit = document.createElement('input')
        ingredientRow.appendChild(unit)

        const ingredient = document.createElement('input')
        ingredient.addEventListener('input', User.addIngredientField)
        ingredientRow.appendChild(ingredient)
    }

    static addDirectionField(e) {
        e.target.removeEventListener('input', User.addDirectionField)

        const directions = document.querySelector('.form-directions')

        const directionWrapper = document.createElement('li')
        directions.appendChild(directionWrapper)

        const direction = document.createElement('textarea')
        direction.classList.add('direction-input')
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