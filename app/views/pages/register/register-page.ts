import { NavigatedData, Page, EventData } from 'tns-core-modules/ui/page';
import { Button } from 'tns-core-modules/ui/button';
import { RegisterViewModel } from '~/shared/view-models/pages/register/register.page.vm';
import {
    goToLoginPage,
    goToRootPage
} from '~/shared/helpers/navigation/nav.helper';



export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new RegisterViewModel();
}

export function onRegisterTap(args: EventData) {
    const btn = args.object as Button;
    const vm = btn.page.bindingContext as RegisterViewModel;

    vm.onRegisterTapHandler()
        .then(() => {
            goToRootPage(true);
        })
        .catch(error => {
            console.error(error);
            alert('Sorry, could not register you at this time');
        });
}

export function onGotoLoginTap() {
    goToLoginPage(false);
}
