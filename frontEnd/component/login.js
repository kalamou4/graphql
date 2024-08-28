import API from "../utils/api.js"
import Router from "../src/router.js";

export default class Login extends HTMLElement{
    constructor() {
        super();
        this.Api = new API(this)
        this.Router = new Router()
    }

    connectedCallback() {
        this.renderHTML();
        this.renderCSS();
        this.setupLoginHandler();
    }

    setupLoginHandler() {
        this.Api.checkUserInput('#loginForm', (error, result) => {
            if (error) {
                console.error('Login failed:', error);
            } else {
                if (result && result.data) {
                    localStorage.setItem('userData', JSON.stringify(result.data));
                    this.Router.route("#home", true);
                } else {
                    console.error('Login failed');
                }
            }
        });
    }
    

    renderHTML() {
        this.innerHTML = `
            <div class="login-container" id="login">
                <div class="top">
                    <header>Login</header>
                </div>
                <form method="post" id="loginForm">
                    <div class="input-box"> 
                        <input type="text" class="input-field" name="UsernameOrEmail" placeholder="Username or Email">
                        <i class="bx bx-user"></i>
                    </div>
                    <div class="input-box">
                        <input type="password" class="input-field" name="Password" placeholder="Password">
                        <i class="bx bx-lock"></i>
                    </div>
                    <div class="input-box">
                        <input type="submit" id="submit_login" class="submit" value="Sign In">
                    </div>                       
                </form>
            </div>
        `;
    }

    renderCSS(){
        const style = document.createElement("style")
        style.textContent = `

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
        }

        .login-container {
            background: rgba(15, 15, 15, 0.9);
            border-radius: 10px;
            padding: 40px;
            width: 400px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .top header {
            color: white;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
        }

        .input-box {
            position: relative;
            margin-bottom: 20px;
        }

        .input-field {
            font-size: 16px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            height: 50px;
            width: 100%;
            padding: 0 45px;
            border: none;
            border-radius: 25px;
            outline: none;
            transition: 0.3s ease;
        }

        .input-field:hover, .input-field:focus {
            background: rgba(255, 255, 255, 0.2);
        }

        .input-box i {
            position: absolute;
            top: 50%;
            left: 15px;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.7);
        }

        ::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.7);
        }

        .submit {
            font-size: 16px;
            font-weight: 500;
            color: #0f0f0f;
            height: 50px;
            width: 100%;
            border: none;
            border-radius: 25px;
            background: #ffffff;
            cursor: pointer;
            transition: 0.3s ease-in-out;
        }

        .submit:hover {
            background: #f0f0f0;
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
        }
                
        `
        this.appendChild(style)
    }
}
