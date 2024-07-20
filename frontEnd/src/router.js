export default class Router extends HTMLElement {
    constructor() {
        super();

        /** @type {Route[]} */
        this.routes = [
            // Other routes...
            {
                name: 'user-home-page',
                path: '../component/home.js',
                regExp: new RegExp(/^#home$/)
            },
            {
                name: 'register-login',
                path: '../component/login.js',
                regExp: new RegExp(/^$/)
            }
        ];

        this.hashChangeListener = event => this.route(location.hash, false, event.newURL === event.oldURL);
    }

    connectedCallback() {

        self.addEventListener('hashchange', this.hashChangeListener);
        this.route(location.hash , true)

    }

    disconnectedCallback() {
        self.removeEventListener('hashchange', this.hashChangeListener);
    }

    /**
     * route to the desired hash/domain
     *
     * @param {string} hash
     * @param {boolean} [replace = false]
     * @param {boolean} [isUrlEqual = true]
     * @return {void | string}
     */
    route(hash, replace = false, isUrlEqual = true) {

        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            if (hash === ""){
                hash = "#home";
            }
        } else {
            if (hash === "#home"){
                hash = "";
            }
        }

        if (location.hash !== hash) {
            if (replace) return location.replace(hash);
            return (location.hash = hash);
        }

        let route;
        // Find the correct route or throw an error
        if (!(route = this.routes.find(route => route.regExp.test(hash)))) {
            this.renderNotFound();
            return;
        }

        // Reuse route.component, if already set, otherwise import and define custom element
        (route.component ? Promise.resolve(route.component) : import(route.path).then(module => {
            // Don't define already existing customElements
            if (!customElements.get(route.name)) customElements.define(route.name, module.default);
            // Save it to route object for reuse. Grab child if it already exists.
            return (route.component = this.children && this.children[0] && this.children[0].tagName === route.name.toUpperCase() ? this.children[0] : document.createElement(route.name));
        })).then(component => {
            if (this.shouldComponentRender(route.name, isUrlEqual)) {
                this.render(component);
            }
        }).catch(error => {
            console.log(error);
            console.warn('Router did not find:', route) || error;
        });
    }

    /**
     * evaluates if a render is necessary
     *
     * @param {string} name
     * @param {boolean} [isUrlEqual = true]
     * @return {boolean}
     */
    shouldComponentRender(name, isUrlEqual = true) {
        if (!this.children || !this.children.length) return true;
        return !isUrlEqual || this.children[0].tagName !== name.toUpperCase();
    }

    /**
     * renders the page
     *
     * @param {HTMLElement} component
     * @return {void}
     */
    render(component) {
        // clear previous content
        this.innerHTML = '';
        this.appendChild(component);
    }

    renderNotFound() {
        // Implement your custom logic to render a "Not Found" component
        this.innerHTML = `<h1>404: Not Found</h1>`; // Example
    }
}

customElements.define('router-page', Router);