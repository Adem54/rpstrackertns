import { ListView } from '@nativescript/core';
import { ListViewScrollListener } from './list-view-scroll-listener';
import { ListViewScrollListenerDelegateImpl } from './list-view-ios-delegate';

export function addScrollListener(
    listView: ListView,
    sl: ListViewScrollListener
) {
    const newDelegate = ListViewScrollListenerDelegateImpl.initWithOriginalDelegate(
        listView,
        sl,
        getCurrentYPos
    );

    (<any>listView)._delegate = newDelegate;
}

export function getCurrentYPos(listView: ListView): number {
    const pos = listView.ios.contentOffset.y;
    return pos;
}
