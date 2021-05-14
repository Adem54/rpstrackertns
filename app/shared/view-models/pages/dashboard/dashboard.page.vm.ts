import { Observable } from '@nativescript/core';
import { ObservableProperty } from '~/shared/observable-property-decorator';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import {
    PtBacklogService,
    PtAuthService,
    PtDashboardService
} from '~/core/contracts/services';
import { PtItem, PtUser } from '~/core/models/domain';
import {
    getBacklogService,
    getAuthService,
    getDashboardService
} from '~/globals/dependencies/locator';
import { StatusCounts, DashboardFilter } from '~/core/models/dto/dashboard';
import { FilteredIssues, ItemsForMonth } from '~/core/models/domain/statistics';
import { DateRange } from '~/core/models/domain/dates';

interface ChartDatum {
    Month: string;
    Count: number;
}
export type ChartItemStatus = 'Open' | 'Closed';

export class DashboardViewModel extends Observable {
    private authService: PtAuthService;
    private dashboardService: PtDashboardService;

    private _sbSelectedIndex = 2;
    private monthsSelectionMap = [3, 6, 12];
    private categories: Date[] = [];
    private itemsForMonthArray: ItemsForMonth[] = [];
    private filter: DashboardFilter;

    @ObservableProperty() public numIssuesActive = 0;
    @ObservableProperty() public numIssuesClosed = 0;
    @ObservableProperty() public numIssuesOpen = 0;
    @ObservableProperty() public selectedMonth = '';
    @ObservableProperty() public selectedStatus: ChartItemStatus = 'Open';
    @ObservableProperty() public isDataPointSelected = false;
    public items: ObservableArray<PtItem> = new ObservableArray<PtItem>();

    public dataOpen = new ObservableArray<ChartDatum>([]);
    public dataClosed = new ObservableArray<ChartDatum>([]);

    public get sbSelectedIndex() {
        return this._sbSelectedIndex;
    }

    public set sbSelectedIndex(v: number) {
        this._sbSelectedIndex = v;
        this.monthRangeUpdate(this.monthsSelectionMap[v]);
        this.resetDataPoint();
    }

    /*
    private dateTimeSource = [
        { Month: this.dateFormat(new Date(2015, 1, 11)), Count: 10 },
        { Month: this.dateFormat(new Date(2015, 2, 11)), Count: 10 },
        { Month: this.dateFormat(new Date(2015, 3, 1)), Count: 1 },
        { Month: this.dateFormat(new Date(2015, 4, 3)), Count: 3 },
        { Month: this.dateFormat(new Date(2015, 5, 11)), Count: 18 },
        { Month: this.dateFormat(new Date(2015, 6, 1)), Count: 7 },
        { Month: this.dateFormat(new Date(2015, 7, 3)), Count: 5 },
        { Month: this.dateFormat(new Date(2015, 8, 11)), Count: 4 },
        { Month: this.dateFormat(new Date(2015, 9, 1)), Count: 2 },
        { Month: this.dateFormat(new Date(2015, 10, 3)), Count: 6 }
    ];

    private dataClosed1 = [
        { Month: this.dateFormat(new Date(2015, 1, 11)), Count: 10 },
        { Month: this.dateFormat(new Date(2015, 2, 11)), Count: 17 },
        { Month: this.dateFormat(new Date(2015, 3, 1)), Count: 2 },
        { Month: this.dateFormat(new Date(2015, 4, 3)), Count: 30 },
        { Month: this.dateFormat(new Date(2015, 5, 11)), Count: 19 },
        { Month: this.dateFormat(new Date(2015, 6, 1)), Count: 7 },
        { Month: this.dateFormat(new Date(2015, 7, 3)), Count: 1 },
        { Month: this.dateFormat(new Date(2015, 8, 11)), Count: 0 },
        { Month: this.dateFormat(new Date(2015, 9, 1)), Count: 20 },
        { Month: this.dateFormat(new Date(2015, 10, 3)), Count: 61 }
    ];
*/

    constructor() {
        super();
        this.authService = getAuthService();
        this.dashboardService = getDashboardService();

        const range = this.getDateRange(
            this.monthsSelectionMap[this._sbSelectedIndex]
        );

        this.filter = {
            dateEnd: range.dateEnd,
            dateStart: range.dateStart
        };
    }

    public dataPointSelected(index: number, seriesTitle: ChartItemStatus) {
        this.isDataPointSelected = true;
        this.items.length = 0;

        const selDate = this.categories[index];
        this.selectedMonth = this.dateFormat(selDate);

        this.selectedStatus = seriesTitle;
        if (this.selectedStatus === 'Open') {
            this.items.push(this.itemsForMonthArray[index].open);
        } else {
            this.items.push(this.itemsForMonthArray[index].closed);
        }
    }

    private resetDataPoint() {
        this.isDataPointSelected = false;
        this.selectedMonth = '';
        this.selectedStatus = 'Open';
    }

    public refresh() {
        Promise.all<StatusCounts, FilteredIssues>([
            this.dashboardService.getStatusCounts(this.filter),
            this.dashboardService.getFilteredIssues(this.filter)
        ])
            .then(results => {
                const statusCounts = results[0];
                const issuesAll = results[1];
                this.parseStatusCounts(statusCounts);
                this.parseChartData(issuesAll);
            })
            .catch(er => console.error(er));
    }

    private parseStatusCounts(statusCounts: StatusCounts) {
        this.numIssuesActive = statusCounts.activeItemsCount;
        this.numIssuesClosed = statusCounts.closedItemsCount;
        this.numIssuesOpen = statusCounts.openItemsCount;
    }

    private parseChartData(issuesAll: FilteredIssues) {
        this.itemsForMonthArray = issuesAll.items;

        const catsTemp = issuesAll.categories.map(c => new Date(c));

        if (this.categories.length !== catsTemp.length) {
            this.categories = catsTemp;
            const opens: ChartDatum[] = [];
            const closeds: ChartDatum[] = [];

            for (let i = 0; i < this.categories.length; i++) {
                const currentCat = this.categories[i];
                const numItemsOpen = this.itemsForMonthArray[i].open.length;
                const numItemsClosed = this.itemsForMonthArray[i].closed.length;

                const cdOpen: ChartDatum = {
                    Month: this.dateFormat(currentCat),
                    Count: numItemsOpen
                };
                const cdClosed: ChartDatum = {
                    Month: this.dateFormat(currentCat),
                    Count: numItemsClosed
                };
                opens.push(cdOpen);
                closeds.push(cdClosed);
            }

            this.dataOpen.length = 0;
            this.dataOpen.push(opens);
            this.dataClosed.length = 0;
            this.dataClosed.push(closeds);
        }
    }

    private monthRangeUpdate(months: number) {
        const range = this.getDateRange(months);

        this.filter = {
            userId: this.filter.userId,
            dateEnd: range.dateEnd,
            dateStart: range.dateStart
        };

        this.refresh();
    }

    private getDateRange(months: number): DateRange {
        const now = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - months);
        return {
            dateStart: start,
            dateEnd: now
        };
    }

    private dateFormat(date: Date): string {
        const month = date.toDateString().substring(4, 7);
        const year = date.toDateString().substring(13, 15);
        const formatted = `${month} ${year}`;
        return formatted;
    }
}
