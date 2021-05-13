import { PtDashboardService } from '~/core/contracts/services';
import { PtDashboardRepository } from '~/core/contracts/repositories';
import {
    DashboardFilter,
    PriorityCounts,
    StatusCounts,
    TypeCounts
} from '~/core/models/dto/dashboard';
import { FilteredIssues } from '~/core/models/domain/statistics';
import { setUserAvatar } from '..';

export class DashboardService implements PtDashboardService {
    constructor(private repo: PtDashboardRepository) {}

    public getStatusCounts(filter: DashboardFilter): Promise<StatusCounts> {
        return this.repo.getStatusCounts(filter);
    }

    public getPriorityCounts(filter: DashboardFilter): Promise<PriorityCounts> {
        return this.repo.getPriorityCounts(filter);
    }

    public getTypeCounts(filter: DashboardFilter): Promise<TypeCounts> {
        return this.repo.getTypeCounts(filter);
    }

    public getFilteredIssues(filter: DashboardFilter): Promise<FilteredIssues> {
        return new Promise<FilteredIssues>(resolve => {
            this.repo
                .getFilteredIssues(filter)
                .then((result: FilteredIssues) => {
                    result.items.forEach(s => {
                        s.open.forEach(i => {
                            setUserAvatar(this.repo.apiEndpoint, i.assignee);
                        });
                        s.closed.forEach(i => {
                            setUserAvatar(this.repo.apiEndpoint, i.assignee);
                        });
                    });
                    resolve(result);
                });
        });
    }
}
