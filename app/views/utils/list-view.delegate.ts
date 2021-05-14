import { ListView } from '@nativescript/core';
import { ListViewScrollListener } from './list-view-scroll-listener';

@NativeClass()
class ListViewScrollListenerDelegateImpl extends NSObject
    implements UITableViewDelegate {
    public static ObjCProtocols = [UITableViewDelegate];

    private _lv: ListView;
    private _sl: ListViewScrollListener;
    private _getCurrentYPos: (listView: ListView) => number;

    public static initWithOriginalDelegate(
        listView: ListView,
        sl: ListViewScrollListener,
        getCurrentYPos: (listView: ListView) => number
    ): ListViewScrollListenerDelegateImpl {
        const originalDelegate = (<any>listView)
            ._delegate as UITableViewDelegate;

        const delegate = <ListViewScrollListenerDelegateImpl>(
            ListViewScrollListenerDelegateImpl.new()
        );

        delegate._lv = listView;
        delegate._sl = sl;
        delegate._getCurrentYPos = getCurrentYPos;

        return delegate;
    }

    public scrollViewDidScroll(scrollView: UIScrollView) {
        this._sl.scrolled(this._getCurrentYPos(this._lv));
    }

    public scrollViewWillBeginDragging(scrollView: UIScrollView) {
        this._sl.dragStart();
    }

    public scrollViewDidEndDraggingWillDecelerate(
        scrollView: UIScrollView,
        decelerate: boolean
    ) {
        this._sl.dragStop();
    }

    public scrollViewDidEndDecelerating(scrollView: UIScrollView) {
        this._sl.scrollHalted();
    }
}

export { ListViewScrollListenerDelegateImpl };
