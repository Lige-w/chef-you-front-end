class Page {

    static RECIPES_URL = 'http://localhost:3000/api/v1/recipes'

    static USERS_URL = 'http://localhost:3000/api/v1/users'

    static LOGIN_URL = 'http://localhost:3000/api/v1/login'

    static  currentUser = false

    static currentPage = null

    static renderLogin() {
        const root = document.getElementById('root')
        root.innerHTML = ''

        const formWrapper = document.createElement('div')
        formWrapper.classList.add('login-wrapper')
        root.appendChild(formWrapper)

        const siteTitle = document.createElement('h1')
        siteTitle.classList.add('site-title')
        siteTitle.innerText = "Chef You"
        formWrapper.appendChild(siteTitle)

        const by = document.createElement('p')
        by.innerText = 'by'
        formWrapper.appendChild(by)

        const loginForm = document.createElement('form')
        loginForm.classList.add('form', 'login')
        loginForm.addEventListener('submit', User.login)
        formWrapper.appendChild(loginForm)

        const usernameInput = document.createElement('input')
        usernameInput.classList.add('username')
        usernameInput.placeholder = 'Please Enter Your Username'
        loginForm.appendChild(usernameInput)

        const submit = document.createElement('input')
        submit.type = 'submit'
        submit.value = 'Login'
        submit.classList.add('login-button')
        loginForm.appendChild(submit)

        const registerLink = document.createElement("a")
        registerLink.innerText = 'Register'
        registerLink.dataset.isRegister = 0
        registerLink.addEventListener("click", Page.toggleRegister)
        formWrapper.appendChild(registerLink)

    }

    static toggleRegister(e) {
        let isRegister = parseInt(e.target.dataset.isRegister)
        const loginForm = document.querySelector('form.login')

        if(!isRegister) {
            loginForm.removeEventListener('submit', User.login)
            loginForm.children[1].value = 'Register'
            loginForm.addEventListener('submit', User.register)

            isRegister ++
            e.target.dataset.isRegister = isRegister
            e.target.innerText = 'Login'
        } else {
            loginForm.removeEventListener('submit', User.register)
            loginForm.children[1].value = 'Login'
            loginForm.addEventListener('submit', User.login)

            isRegister --
            e.target.dataset.isRegister = isRegister
            e.target.innerText = 'Register'
        }
    }

    static configObj(method, body)  {
        return {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json'
            },
            body: JSON.stringify(body)
        }
    }

    static renderOverlay() {
        const overlay = document.createElement('div')
        overlay.classList.add('overlay')
        overlay.addEventListener('click', e => {
            e.target.nextElementSibling.classList.add('remove')
            setTimeout(Page.removeModal, 300)
        })

        return overlay
    }

    static removeModal() {
        document.querySelector('.overlay').nextElementSibling.remove()
        document.querySelector('.overlay').remove()
    }

    static formElement(e) {
        const form = document.createElement('form')
        form.classList.add('recipe-form')

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

        const submitWrapper = document.createElement('div')
        submitWrapper.classList.add('submit')
        form.appendChild(submitWrapper)

        const submit = document.createElement('input')
        submit.type = 'submit'
        submit.value = 'Add This Recipe'
        submitWrapper.appendChild(submit)

        return form
    }


}