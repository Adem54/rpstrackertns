import { Observable } from '@nativescript/core';
import { ObservableProperty } from '~/shared/observable-property-decorator';
import { getAuthService } from '~/globals/dependencies/locator';
import { PtAuthService } from '~/core/contracts/services';

export class RootPageViewModel extends Observable {
    private authService: PtAuthService;

    @ObservableProperty() selectedPage: string;

    public get isAuthenticated() {
        return this.authService.isLoggedIn();
    }

    public get currentUser() {
        return this.authService.getCurrentUser();
    }

    constructor() {
        super();
        this.authService = getAuthService();
    }
}
