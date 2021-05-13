import { Observable } from 'tns-core-modules/data/observable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { PtItem } from '~/core/models/domain';
import { PtBacklogService } from '~/core/contracts/services/pt-backlog-service.contract';
import {
    getBacklogService,
    getAuthService
} from '~/globals/dependencies/locator';
import {
    toFetchItemsRequest,
    toCreateItemRequest
} from '~/core/contracts/requests/backlog';
import { PtAuthService } from '~/core/contracts/services';
import { PtNewItem } from '~/core/models/dto/backlog';
import { CreateItemResponse } from '~/core/contracts/responses/backlog';

export class BacklogViewModel extends Observable {
    private authService: PtAuthService;
    private backlogService: PtBacklogService;

    public items: ObservableArray<PtItem> = new ObservableArray<PtItem>();

    constructor() {
        super();

        this.authService = getAuthService();
        this.backlogService = getBacklogService();
    }

    public onPresetSelected() {
        this.refresh();
    }

    public refresh() {
        const fetchReq = toFetchItemsRequest(
            this.backlogService.getCurrentPreset(),
            this.authService.getCurrentUserId()
        );

        this.backlogService.fetchItems(fetchReq).then(response => {
            // empty the observable array
            this.items.length = 0;

            // push the result into the array
            this.items.push(response.items);
        });
    }

    public addNewItemHandler(newItem: PtNewItem) {
        if (newItem) {
            this.addItem(newItem);
        }
    }

    private addItem(newItem: PtNewItem) {
        const createItemRequest = toCreateItemRequest(
            newItem,
            newItem.selectedAssignee
        );

        this.backlogService
            .addNewPtItem(createItemRequest)
            .then((r: CreateItemResponse) => {
                this.items.unshift(r.createdItem);
            })
            .catch(() => {
                console.log('some error occured');
            });
    }
}
