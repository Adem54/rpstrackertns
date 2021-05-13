import {
    DashboardFilter,
    StatusCounts,
    PriorityCounts,
    TypeCounts
} from '~/core/models/dto/dashboard';
import { FilteredIssues } from '~/core/models/domain/statistics';

export interface PtDashboardService {
    getStatusCounts(filter: DashboardFilter): Promise<StatusCounts>;

    getPriorityCounts(filter: DashboardFilter): Promise<PriorityCounts>;

    getTypeCounts(filter: DashboardFilter): Promise<TypeCounts>;

    getFilteredIssues(filter: DashboardFilter): Promise<FilteredIssues>;
}
