import { ListView } from '@nativescript/core';
import { ListViewScrollListener } from './list-view-scroll-listener';

export function addScrollListener(
    listView: ListView,
    sl: ListViewScrollListener
) {
    let androidDragging = false;

    listView.android.setOnScrollListener(
        new android.widget.AbsListView.OnScrollListener({
            onScroll(view, firstVisibleItem, visibleItemCount, totalItemCount) {
                sl.scrolled(getCurrentYPos(listView));
            },
            onScrollStateChanged(view, scrollState) {
                if (
                    scrollState ===
                    android.widget.AbsListView.OnScrollListener
                        .SCROLL_STATE_IDLE
                ) {
                    if (!androidDragging) {
                        sl.scrollHalted();
                    } else {
                        sl.dragStop();
                    }
                } else if (
                    scrollState ===
                    android.widget.AbsListView.OnScrollListener
                        .SCROLL_STATE_TOUCH_SCROLL
                ) {
                    if (androidDragging === false) {
                        sl.dragStart();
                        androidDragging = true;
                    }
                }
            }
        })
    );
}

export function getCurrentYPos(listView: ListView): number {
    const pos = listView.android.computeVerticalScrollOffset();
    return pos;
}
