export class ListViewScrollListener {
    public dragStart() {
        console.log('LISTVIEW: drag start');
    }

    public dragStop() {
        console.log('LISTVIEW: drag stop');
    }

    public scrolled(currentPos: number) {
        console.log('LISTVIEW: scrolled: ' + currentPos);
    }

    public scrollHalted() {
        console.log('LISTVIEW: scroll stopped');
    }
}
