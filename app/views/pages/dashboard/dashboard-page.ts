import { Application, EventData, Page, isIOS, ItemEventData } from '@nativescript/core';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { BarSeries, ChartEventData } from 'nativescript-ui-chart';

import {
    DashboardViewModel,
    ChartItemStatus
} from '~/shared/view-models/pages/dashboard/dashboard.page.vm';
import { PtItemType } from '~/core/models/domain/types';
import { ItemType } from '~/core/constants';
import { PtItem } from '~/core/models/domain';
import { goToDetailPage } from '~/shared/helpers/navigation/nav.helper';

Application.getResources().imageResFromType = (type: PtItemType) =>
    ItemType.imageResFromType(type);

const vm: DashboardViewModel = new DashboardViewModel();
let drawer: RadSideDrawer = null;

export function onNavigatingTo(args: EventData) {
    const page = args.object as Page;

    page.bindingContext = vm;
}

export function onLoaded(args: EventData) {
    const page = args.object as Page;
    vm.refresh();
    drawer = page.frame.parent as RadSideDrawer;
}

export function toggleDrawer() {
    drawer.toggleDrawerState();
}

export function onPointSelected(args: ChartEventData) {
    const selSeries = args.series as BarSeries;
    let selSeriesStatus: ChartItemStatus = 'Open';
    if (isIOS) {
        selSeriesStatus = (<any>selSeries).title;
    } else {
        selSeriesStatus = selSeries.seriesName as ChartItemStatus;
    }
    vm.dataPointSelected(args.pointIndex, selSeriesStatus);
}

export function onListItemTap(args: ItemEventData) {
    const item = args.view.bindingContext as PtItem;
    goToDetailPage<PtItem>(item);
}
