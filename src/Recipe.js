class Recipe {
    constructor(params) {
        this.name = params.name
        this.description = params.description
        this.servings = params.servings
    }

    renderIndex(node) {
        const listItem = document.createElement('li')
        node.appendChild(listItem)

        const title = document.createElement('h3')
        title.innerText = this.name
        listItem.appendChild(title)
    }
}