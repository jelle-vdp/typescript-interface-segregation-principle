interface ThirdPartyAuth {
    setToken(newToken: string, thirdParty?: string): void;
    checkToken(token: string, thirdParty?: string): boolean;
}

interface RegularAuth {
    checkPassword(password: string) : boolean;
    resetPassword(): void;
}

class User implements ThirdPartyAuth, RegularAuth {
    private _password : string = 'user';
    private _facebookToken : string = "secret_token_fb";
    private _googleToken : string = "secret_token_google";

    //Interesting detail here: while I did not define a return type or param type, any deviation from the interface will give you an error.
    // Test it out by uncommenting the code below.
    public checkToken(token: string, thirdParty: string) : boolean {
        if (thirdParty === 'google') {
            return (token === this._googleToken);
        } else if (thirdParty === 'facebook') {
            return (token === this._facebookToken);
        } else {
            return false;
        }
    }
    public setToken(newToken: string, thirdParty: string) : void {
        if (thirdParty === 'google') {
            this._googleToken = newToken;
        } else if (thirdParty === 'facebook') {
            this._facebookToken = newToken;
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

// class GoogleBot can only use google token
class GoogleBot implements ThirdPartyAuth {
    private _googleToken : string = "secret_token_google";

    public checkToken(token: string) : boolean {
        return (token === this._googleToken);
    }

    public setToken(newToken: string) : void {
        this._googleToken = newToken;
    }
}


const passwordElement = <HTMLInputElement>document.querySelector('#password');
const typePasswordElement = <HTMLInputElement>document.querySelector('#typePassword');
const typeGoogleElement = <HTMLInputElement>document.querySelector('#typeGoogle');
const typeFacebookElement = <HTMLInputElement>document.querySelector('#typeFacebook');
const loginAsUserElement = <HTMLInputElement>document.querySelector('#loginAsUser');
const loginAsAdminElement = <HTMLInputElement>document.querySelector('#loginAsAdmin');
const loginAsGoogleBotElement = <HTMLInputElement>document.querySelector('#loginAsGoogleBot');
const resetPasswordElement = <HTMLAnchorElement>document.querySelector('#resetPassword');
const loginFormElement = <HTMLFormElement>document.querySelector('#login-form');

let user = new User;
let admin = new Admin;
let googleBot = new GoogleBot;

loginFormElement.addEventListener('submit', (event) => {
    event.preventDefault();

    let auth = false;
    
    if (loginAsUserElement.checked){
        switch(true) {
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
    } else if (loginAsAdminElement.checked){
        switch(true) {
            case typePasswordElement.checked:
                auth = admin.checkPassword(passwordElement.value);
                break;
            case typeGoogleElement.checked:
            case typeFacebookElement.checked:
                alert('Admin cannot use third party tokens to login');
                break;
        }
    } else if (loginAsGoogleBotElement.checked){
        switch(true) {
            case typeGoogleElement.checked:
                auth = googleBot.checkToken(passwordElement.value);
                break;
            case typeFacebookElement.checked:
            case typePasswordElement.checked:
                alert('A Googlebot can only use a Google token to login');
                break;
        }
    }

    if(auth) {
        alert('login success');
    } else {
        alert('login failed');
    }
});

resetPasswordElement.addEventListener('click', (event) => {
   event.preventDefault();

   if (loginAsGoogleBotElement.checked){
        alert ('A Googlebot cannot reset its token');
   } else {
     loginAsAdminElement.checked ? admin.resetPassword() : user.resetPassword();
   }
});