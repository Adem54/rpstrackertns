import { Observable } from '@nativescript/core';
import { PtLoginModel } from '~/core/models/domain/pt-login.model';
import { PtAuthService } from '~/core/contracts/services/pt-auth-service.contract';
import { getAuthService } from '~/globals/dependencies/locator';

export class LoginViewModel extends Observable {
    private authService: PtAuthService;
    public email = 'alex@email.com';
    public password = 'nuvious';

    public loggingIn = false;

    constructor() {
        super();
        this.authService = getAuthService();
    }

    public onEmailChanged(args) {
        this.set('email', args);
    }

    public onPasswordChanged(args) {
        this.set('password', args);
    }

    public onLoginTapHandler() {
        // Pass the login model to the auth service
        const loginModel: PtLoginModel = {
            username: this.email,
            password: this.password
        };

        this.loggingIn = true;

        return new Promise((resolve, reject) => {
            this.authService
                .login(loginModel)
                .then(() => {
                    this.loggingIn = false;
                    resolve();
                })
                .catch(er => {
                    this.loggingIn = false;
                    reject(er);
                });
        });
    }
}
