interface ThirdPartyAuth {
    setToken(thirdParty: string, token : string): void;
    checkToken(thirdParty: string, token : string) : boolean;
}

interface RegularAuth {
    checkPassword(password: string) : boolean;
    resetPassword(): void;
}

class User implements ThirdPartyAuth, RegularAuth {
    private _password : string = 'user';
    private _facebookToken : string = "";
    private _googleToken : string = "";

    //Interesting detail here: while I did not define a return type or param type, any deviation from the interface will give you an error.
    // Test it out by uncommenting the code below.
    public checkToken(thirdParty: string, token: string) : boolean {
        if (thirdParty === 'google') {
            return (token === this._googleToken);
        } else if (thirdParty === 'facebook') {
            return (token === this._facebookToken);
        } else {
            return false;
        }
    }
    public setToken(thirdParty: string, token: string) : void {
        if (thirdParty === 'google') {
            this._googleToken = token;
        } else if (thirdParty === 'facebook') {
            this._facebookToken = token;
        }
    }

    checkPassword(password: string) : boolean {
        return (password === this._password);
    }

    resetPassword() {
        let newPassword = prompt('What is your new password?');
        if (newPassword !== null){
            this._password = newPassword;
        }
    }
}

//admin cannot use google or facebook token
class Admin implements RegularAuth {
    private _password : string = 'admin';

    checkPassword(password: string): boolean {
        return (password === this._password);
    }

    resetPassword() {
        let newPassword = prompt('What is your new password?');
        if (newPassword !== null){
            this._password = newPassword;
        }
    }
}

// class GoogleBot implements UserAuth {}

const passwordElement = <HTMLInputElement>document.querySelector('#password');
const typePasswordElement = <HTMLInputElement>document.querySelector('#typePassword');
const typeGoogleElement = <HTMLInputElement>document.querySelector('#typeGoogle');
const typeFacebookElement = <HTMLInputElement>document.querySelector('#typeFacebook');
const loginAsAdminElement = <HTMLInputElement>document.querySelector('#loginAsAdmin');
const resetPasswordElement = <HTMLAnchorElement>document.querySelector('#resetPassword');
const loginFormElement = <HTMLFormElement>document.querySelector('#login-form');

let guest = new User;
let admin = new Admin;

loginFormElement.addEventListener('submit', (event) => {
    event.preventDefault();

    let user = loginAsAdminElement.checked ? admin : guest;

    if(!loginAsAdminElement.checked && user === guest) {
        user.setToken('google', 'secret_token_google');
        user.setToken('facebook', 'secret_token_fb');
    }
    debugger;

    let auth = false;

    if(user === guest){
        switch(true) {
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
    } else {
        auth = admin.checkPassword(passwordElement.value);
    }
    

    if(auth) {
        alert('login success');
    } else {
        alert('login failed');
    }
});

resetPasswordElement.addEventListener('click', (event) => {
   event.preventDefault();

   let user = loginAsAdminElement.checked ? admin : guest;
   user.resetPassword();
});