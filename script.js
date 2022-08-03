"use strict";
class User {
    constructor() {
        this._password = 'user';
        this._facebookToken = "secret_token_fb";
        this._googleToken = "secret_token_google";
    }
    //Interesting detail here: while I did not define a return type or param type, any deviation from the interface will give you an error.
    // Test it out by uncommenting the code below.
    checkToken(token, thirdParty) {
        if (thirdParty === 'google') {
            return (token === this._googleToken);
        }
        else if (thirdParty === 'facebook') {
            return (token === this._facebookToken);
        }
        else {
            return false;
        }
    }
    setToken(newToken, thirdParty) {
        if (thirdParty === 'google') {
            this._googleToken = newToken;
        }
        else if (thirdParty === 'facebook') {
            this._facebookToken = newToken;
        }
    }
    checkPassword(password) {
        return (password === this._password);
    }
    resetPassword() {
        let newPassword = prompt('What is your new password?');
        if (newPassword !== null) {
            this._password = newPassword;
        }
    }
}
//admin cannot use google or facebook token
class Admin {
    constructor() {
        this._password = 'admin';
    }
    checkPassword(password) {
        return (password === this._password);
    }
    resetPassword() {
        let newPassword = prompt('What is your new password?');
        if (newPassword !== null) {
            this._password = newPassword;
        }
    }
}
// class GoogleBot can only use google token
class GoogleBot {
    constructor() {
        this._googleToken = "secret_token_google";
    }
    checkToken(token) {
        return (token === this._googleToken);
    }
    setToken(newToken) {
        this._googleToken = newToken;
    }
}
const passwordElement = document.querySelector('#password');
const typePasswordElement = document.querySelector('#typePassword');
const typeGoogleElement = document.querySelector('#typeGoogle');
const typeFacebookElement = document.querySelector('#typeFacebook');
const loginAsUserElement = document.querySelector('#loginAsUser');
const loginAsAdminElement = document.querySelector('#loginAsAdmin');
const loginAsGoogleBotElement = document.querySelector('#loginAsGoogleBot');
const resetPasswordElement = document.querySelector('#resetPassword');
const loginFormElement = document.querySelector('#login-form');
let user = new User;
let admin = new Admin;
let googleBot = new GoogleBot;
loginFormElement.addEventListener('submit', (event) => {
    event.preventDefault();
    let auth = false;
    if (loginAsUserElement.checked) {
        switch (true) {
            case typePasswordElement.checked:
                auth = user.checkPassword(passwordElement.value);
                break;
            case typeGoogleElement.checked:
                auth = user.checkToken('google', passwordElement.value);
                break;
            case typeFacebookElement.checked:
                auth = user.checkToken('facebook', passwordElement.value);
                break;
        }
    }
    else if (loginAsAdminElement.checked) {
        switch (true) {
            case typePasswordElement.checked:
                auth = admin.checkPassword(passwordElement.value);
                break;
            case typeGoogleElement.checked:
            case typeFacebookElement.checked:
                alert('Admin cannot use third party tokens to login');
                break;
        }
    }
    else if (loginAsGoogleBotElement.checked) {
        switch (true) {
            case typeGoogleElement.checked:
                auth = googleBot.checkToken(passwordElement.value);
                break;
            case typeFacebookElement.checked:
            case typePasswordElement.checked:
                alert('A Googlebot can only use a Google token to login');
                break;
        }
    }
    if (auth) {
        alert('login success');
    }
    else {
        alert('login failed');
    }
});
resetPasswordElement.addEventListener('click', (event) => {
    event.preventDefault();
    if (loginAsGoogleBotElement.checked) {
        alert('A Googlebot cannot reset its token');
    }
    else {
        loginAsAdminElement.checked ? admin.resetPassword() : user.resetPassword();
    }
});
