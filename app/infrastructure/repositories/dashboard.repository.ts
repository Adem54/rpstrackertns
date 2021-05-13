import { PtDashboardRepository } from '~/core/contracts/repositories';
import {
    DashboardFilter,
    StatusCounts,
    TypeCounts,
    PriorityCounts
} from '~/core/models/dto/dashboard';
import { FilteredIssues } from '~/core/models/domain/statistics';

export class DashboardRepository implements PtDashboardRepository {
    constructor(public apiEndpoint: string) {}

    private getFilterParamString(filter: DashboardFilter): string {
        const params = [
            filter.userId ? `userId=${filter.userId}` : '',
            filter.dateStart
                ? `dateStart=${filter.dateStart.toDateString()}`
                : '',
            filter.dateEnd ? `dateEnd=${filter.dateEnd.toDateString()}` : ''
        ];

        const paramStr = params.join('&').replace(/ /g, '%20');

        return paramStr;
    }
    private getStatusCountsUrl(paramStr: string): string {
        return `${this.apiEndpoint}/stats/statuscounts?${paramStr}`;
    }

    private getPriorityCountsUrl(paramStr: string): string {
        return `${this.apiEndpoint}/stats/prioritycounts?${paramStr}`;
    }

    private getTypeCountsUrl(paramStr: string): string {
        return `${this.apiEndpoint}/stats/prioritycounts?${paramStr}`;
    }

    private getFilteredIssuesUrl(paramStr: string): string {
        return `${this.apiEndpoint}/stats/filteredissues?${paramStr}`;
    }

    public getStatusCounts(filter: DashboardFilter): Promise<StatusCounts> {
        return fetch(
            this.getStatusCountsUrl(this.getFilterParamString(filter)),
            {
                method: 'GET'
            }
        ).then(response => response.json());
    }

    public getPriorityCounts(filter: DashboardFilter): Promise<PriorityCounts> {
        return fetch(
            this.getPriorityCountsUrl(this.getFilterParamString(filter))
        ).then(response => response.json());
    }

    public getTypeCounts(filter: DashboardFilter): Promise<TypeCounts> {
        return fetch(
            this.getTypeCountsUrl(this.getFilterParamString(filter))
        ).then(response => response.json());
    }

    public getFilteredIssues(filter: DashboardFilter): Promise<FilteredIssues> {
        return fetch(
            this.getFilteredIssuesUrl(this.getFilterParamString(filter))
        ).then(response => response.json());
    }
}
