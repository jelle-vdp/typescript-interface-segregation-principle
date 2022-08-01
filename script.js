"use strict";
class User {
    constructor() {
        this._password = 'user';
        this._facebookToken = "";
        this._googleToken = "";
    }
    //Interesting detail here: while I did not define a return type or param type, any deviation from the interface will give you an error.
    // Test it out by uncommenting the code below.
    checkToken(thirdParty, token) {
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
    setToken(thirdParty, token) {
        if (thirdParty === 'google') {
            this._googleToken = token;
        }
        else if (thirdParty === 'facebook') {
            this._facebookToken = token;
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
// class GoogleBot implements UserAuth {}
const passwordElement = document.querySelector('#password');
const typePasswordElement = document.querySelector('#typePassword');
const typeGoogleElement = document.querySelector('#typeGoogle');
const typeFacebookElement = document.querySelector('#typeFacebook');
const loginAsAdminElement = document.querySelector('#loginAsAdmin');
const resetPasswordElement = document.querySelector('#resetPassword');
const loginFormElement = document.querySelector('#login-form');
let guest = new User;
let admin = new Admin;
loginFormElement.addEventListener('submit', (event) => {
    event.preventDefault();
    let user = loginAsAdminElement.checked ? admin : guest;
    if (!loginAsAdminElement.checked && user === guest) {
        user.setToken('google', 'secret_token_google');
        user.setToken('facebook', 'secret_token_fb');
    }
    debugger;
    let auth = false;
    if (user === guest) {
        switch (true) {
            case typePasswordElement.checked:
                auth = user.checkPassword(passwordElement.value);
                break;
            case typeGoogleElement.checked:
                auth = user.checkToken('google', 'secret_token_google');
                break;
            case typeFacebookElement.checked:
                debugger;
                auth = user.checkToken('facebook', 'secret_token_fb');
                break;
        }
    }
    else {
        auth = admin.checkPassword(passwordElement.value);
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
    let user = loginAsAdminElement.checked ? admin : guest;
    user.resetPassword();
});
