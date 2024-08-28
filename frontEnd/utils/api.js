import { query } from "../graphql/query.js";

export default class API {
    constructor(container){
        this.container = container
        this.checkUserInput = this.checkUserInput.bind(this)
    }

    checkUserInput = (formSelector, callback) => {
        const form = this.container.querySelector(formSelector);
    
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const { errors, data } = this.validateForm(event);
    
            if (Object.keys(errors).length === 0) {
                try {
                    const result = await this.signin(data, 'https://learn.zone01dakar.sn/api/auth/signin');
                    
                    if (result) {
                        // Handle successful login
                        console.log('Login successful', result);
                        if (callback) callback(null, result);  // Call callback with result
                    } else {
                        this.displayErrors({ general: 'invalid credentials' });
                        if (callback) callback(new Error('Login failed'));  // Call callback with error
                    }
                } catch (error) {
                    this.displayErrors({ general: error.message });
                    if (callback) callback(error);  // Call callback with error
                }
            } else {
                this.displayErrors(errors);
                if (callback) callback(new Error('Validation errors'));  // Call callback with validation errors
            }
        });
    }
    

    validateForm(event) {
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        const errors = {};
        
        for (let [key, value] of Object.entries(data)) {
            if (!value.trim()) {
                errors[key] = `${key} is required`;
            }
        }        
        return { errors, data };
    }

    displayErrors(errors) {
        this.container.querySelectorAll('.error-message').forEach(el => el.remove());

        for (const [key, message] of Object.entries(errors)) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            errorElement.style.color = "white";
            errorElement.style.display = "flex";
            errorElement.style.justifyContent = "center";

            if (key === 'general') {
                const formElement = this.container.querySelector('form');
                errorElement.classList.add('general-error');
                formElement.prepend(errorElement);
            } else {
                const inputElement = this.container.querySelector(`[name="${key}"]`);
                if (inputElement) {
                    const inputBox = inputElement.closest('.input-box') || inputElement.parentNode;
                    inputBox.appendChild(errorElement);
                } else {
                    console.warn(`No input field found for ${key}`);
                }
            }
        }
    }


    async signin(data, url) {
        const { UsernameOrEmail, Password } = data;
        const encodedCredentials = btoa(`${UsernameOrEmail}:${Password}`);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${encodedCredentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403){
                    this.displayErrors({ general: "Invalid credentials!" });
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const token = await response.json();
            localStorage.setItem('jwt', token);
            const queryResult = await this.makeGraphQLQuery(query);
            return queryResult

        } catch (error) {
            console.error('Error during signin:', error);
            return error; 
        }
    }

    async makeAuthenticatedRequest(url, options = {}) {
        let token = localStorage.getItem('jwt');
    
        const makeRequest = async (token) => {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            return response;
        };
    
        try {
            return await makeRequest(token);
        } catch (error) {
            if (error.message === 'Unauthorized') {
                localStorage.removeItem('jwt');
            }
        }
    }

    async makeGraphQLQuery(query) {
        const url =  "https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql"
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        };
    
        try {
            const response = await this.makeAuthenticatedRequest(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error making GraphQL query:', error);
            throw error;
        }
    }
}
