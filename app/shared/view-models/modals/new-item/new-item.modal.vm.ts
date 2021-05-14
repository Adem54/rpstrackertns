import { Observable } from '@nativescript/core';
import { PtUser } from '~/core/models/domain';
import { ObservableProperty } from '~/shared/observable-property-decorator';
import { PtAuthService } from '~/core/contracts/services';
import { getAuthService } from '~/globals/dependencies/locator';
import { PtNewItem } from '~/core/models/dto/backlog';
import { PtItemType } from '~/core/models/domain/types';
import { PtNewItemForm, initializeNewItemForm } from '~/core/models/forms';
import { ItemType } from '~/core/constants';

export class NewItemModalViewModel extends Observable {
    private authService: PtAuthService;

    public newItemForm: PtNewItemForm;

    public itemTypesProvider = ItemType.List.map(t => t.PtItemType);

    @ObservableProperty() public selectedAssignee: PtUser;

    constructor() {
        super();

        this.authService = getAuthService();
        this.selectedAssignee = this.authService.getCurrentUser();

        this.newItemForm = initializeNewItemForm();
    }

    public onOkButtonTapHandler(): PtNewItem {
        const newItem: PtNewItem = {
            title: this.newItemForm.title,
            description: this.newItemForm.description,
            type: <PtItemType>this.newItemForm.typeStr,
            selectedAssignee: this.selectedAssignee
        };
        return newItem;
    }
}
