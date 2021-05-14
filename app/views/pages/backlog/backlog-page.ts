import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { BacklogViewModel } from '~/shared/view-models/pages/backlog/backlog.page.vm';
import { NavigatedData, Page, View, EventData, ListView, ItemEventData, Screen, isIOS } from '@nativescript/core';
import { PtItem } from '~/core/models/domain';
import {
    goToDetailPage
} from '~/shared/helpers/navigation/nav.helper';
import { showModalNewItem } from '~/views/modals/helpers/modal-helpers';
import { PtNewItem } from '~/core/models/dto/backlog';
import { addScrollListener } from '~/views/utils/list-view-utils';
import { ListViewScrollListener } from '~/views/utils/list-view-scroll-listener';

const backlogVm: BacklogViewModel = new BacklogViewModel();
let drawer: RadSideDrawer = null;

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = backlogVm;

    const btnFab = page.getViewById('btnFab') as View;
    btnFab.top = Screen.mainScreen.heightDIPs - (isIOS ? 150 : 200);
    btnFab.left = Screen.mainScreen.widthDIPs - 70;
}

export function onLoaded(args: EventData) {
    const page = <Page>args.object;
    backlogVm.refresh();
    drawer = page.frame.parent as RadSideDrawer;
}

export function onListViewLoaded(args: EventData) {
    const listView = args.object as ListView;
    const sl = new ListViewScrollListener();
    // addScrollListener(listView, sl);
}

export function toggleDrawer() {
    drawer.toggleDrawerState();
}

export function onListItemTap(args: ItemEventData) {
    const item = <PtItem>args.view.bindingContext;
    goToDetailPage<PtItem>(item);
}

export function onAddTap(args: EventData) {
    const btn = args.object as View;

    showModalNewItem<PtNewItem>(btn.page).then(newItem =>
        backlogVm.addNewItemHandler(newItem)
    );
}
