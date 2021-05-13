import * as traceModule from 'tns-core-modules/trace';
import { NavigatedData, Page, EventData } from 'tns-core-modules/ui/page';
import { Button } from 'tns-core-modules/ui/button';
import { LoginViewModel } from '~/shared/view-models/pages/login/login.page.vm';
import {
    goToRegisterPage,
    goToRootPage
} from '~/shared/helpers/navigation/nav.helper';
import { setStatusBarColors } from '~/views/utils/status-bar-utils';
import { RPSTraceCategory } from '~/infrastructure/tracing/rps-trace-categories';
import { showPopoverMessage } from '~/shared/helpers/popover/popover.helper';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new LoginViewModel();
    setStatusBarColors();
}

export function onLoginTap(args: EventData) {
    const btn = args.object as Button;
    let vm = btn.page.bindingContext as LoginViewModel;
    // vm = null;

    /*
    if (!vm) {
        traceModule.error('Attempt to login - ViewModel is null or undefined');
        showPopoverMessage('Sorry, something went wrong.');
        return;
    }
    */

    // Let the VM know about login action
    vm.onLoginTapHandler()
        .then(() => {
            goToRootPage(true);
        })
        .catch(error => {
            console.error(error);
            alert('Sorry, could not log in at this time');
        });
}

export function onGotoRegisterTap() {
    // console.log('HERE WE ARE: onGotoRegisterTap');
    /*
    traceModule.write(
        'HERE WE ARE: onGotoRegisterTap',
        RPSTraceCategory,
        traceModule.messageType.error
    );
    */

    traceModule.error('HERE WE ARE: onGotoRegisterTap');

    goToRegisterPage();
}
