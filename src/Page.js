class Page {

    static RECIPES_URL = 'http://localhost:3000/api/v1/recipes'

    static USERS_URL = 'http://localhost:3000/api/v1/users'

    static  currentUser = false

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

        const loginForm = document.createElement('form')
        loginForm.classList.add('form', 'login')
        loginForm.addEventListener('submit', User.login)
        formWrapper.appendChild(loginForm)

        const usernameInput = document.createElement('input')
        usernameInput.placeholder = 'Please Enter Your Username'
        loginForm.appendChild(usernameInput)

        const submit = document.createElement('input')
        submit.type = 'submit'
        submit.value = 'Login'
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



}