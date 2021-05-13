import { Frame } from 'tns-core-modules/ui/frame';
import { Page, EventData, View } from 'tns-core-modules/ui/page';
import { load } from 'tns-core-modules/ui/builder';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import {
    getAuthService,
    getBacklogService
} from '~/globals/dependencies/locator';
import {
    goToLoginPage,
    goToDashboardPage,
    goToBacklogPage,
    goToSettingsPage
} from '~/shared/helpers/navigation/nav.helper';
import { RootPageViewModel } from '~/shared/view-models/pages/root/root.page.vm';
import { PresetType } from '~/core/models/types';
import { LayoutBase } from 'tns-core-modules/ui/layouts/layout-base';
import {
    POPOVER_SHOW_EVENT_NAME,
    POPOVER_HIDE_EVENT_NAME,
    PopoverEventData
} from '~/shared/helpers/popover/popover.helper';

type PageTitleType = 'Dashboard' | 'Backlog' | 'Settings' | PresetType;
const drawerCloseTimeout = 100;

export function onLoaded(args: EventData) {
    const page = args.object as Page;
    const vm = new RootPageViewModel();
    vm.selectedPage = 'Dashboard';
    page.bindingContext = vm;

    const contentFrame = page.getViewById('contentFrame') as Frame;

    if (vm.isAuthenticated) {
        contentFrame.set('defaultPage', 'views/pages/dashboard/dashboard-page');
    } else {
        contentFrame.set('defaultPage', 'views/pages/login/login-page');
    }

    const container = page.getViewById('popoverContainer') as LayoutBase;

    page.on(POPOVER_SHOW_EVENT_NAME, (popArgs: PopoverEventData) => {
        const popoverPayload = popArgs.payload;

        const childView = load({
            path: popoverPayload.component.path,
            name: popoverPayload.component.name
        });
        childView.bindingContext = popoverPayload.component.bindingContext;

        container.addChild(childView);
        container.visibility = 'visible';
    });

    page.on(POPOVER_HIDE_EVENT_NAME, (popArgs: PopoverEventData) => {
        hidePopover(container);
    });
}

function hidePopover(container: LayoutBase) {
    container.removeChildren();
    container.visibility = 'hidden';
}

export function onNavigationItemTap(args: EventData): void {
    const view = args.object as View;
    const page = view.page;
    const drawer = page.getViewById('sideDrawer') as RadSideDrawer;
    const pageTitle = view.get('title') as PageTitleType;
    const vm = view.bindingContext as RootPageViewModel;
    const contentFrame = getContentFrame(view);

    const backlogService = getBacklogService();
    let navFunc = null;

    switch (pageTitle) {
        case 'Dashboard':
            navFunc = goToDashboardPage;
            break;
        case 'Backlog':
            navFunc = goToBacklogPage;
            break;
        case 'my':
            navFunc = goToBacklogPage;
            backlogService.setPreset(pageTitle);
            break;
        case 'open':
            navFunc = goToBacklogPage;
            backlogService.setPreset(pageTitle);
            break;
        case 'closed':
            navFunc = goToBacklogPage;
            backlogService.setPreset(pageTitle);
            break;
        case 'Settings':
            navFunc = goToSettingsPage;
            break;
        default:
            navFunc = goToDashboardPage;
            break;
    }

    if (pageTitle !== vm.selectedPage) {
        navFunc(contentFrame, true);
        closeDrawerWithDelay(drawer, drawerCloseTimeout);
        vm.selectedPage = pageTitle;
    } else {
        drawer.closeDrawer();
    }
}

export function onLogoutTap(args: EventData) {
    const view = args.object as View;
    const drawer = view.page.getViewById('sideDrawer') as RadSideDrawer;

    const authService = getAuthService();

    authService.logout().then(() => {
        goToLoginPage(true);
        closeDrawerWithDelay(drawer, drawerCloseTimeout);
    });
}

function getContentFrame(view: View) {
    return view.page.getViewById('contentFrame') as Frame;
}

function closeDrawerWithDelay(dr: RadSideDrawer, delayMs: number) {
    setTimeout(() => {
        dr.closeDrawer();
    }, delayMs);
}

export function onContentLoaded() {
    console.log('onContentLoaded');
}
