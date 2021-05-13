import { PtItemType } from '~/core/models/domain/types';
import { PtUser } from '~/core/models/domain';

export interface PtNewItem {
    title: string;
    description?: string;
    type: PtItemType;
    selectedAssignee: PtUser;
}
