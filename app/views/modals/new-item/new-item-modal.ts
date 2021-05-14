import { EventData, Page, View } from '@nativescript/core';
import { RadDataForm } from 'nativescript-ui-dataform';

import { NewItemModalViewModel } from '~/shared/view-models/modals/new-item/new-item.modal.vm';
import { showModalAssigneeList } from '../helpers/modal-helpers';
import { hideStatusBar, showStatusBar } from '~/views/utils/status-bar-utils';

let vm: NewItemModalViewModel = null;
let itemDetailsDataForm: RadDataForm;

export function onLoaded(args: EventData) {
    const page = args.object as Page;
    itemDetailsDataForm = page.getViewById('itemDetailsDataForm');
    vm = new NewItemModalViewModel();
    page.bindingContext = vm;

    hideStatusBar();
}

export function onCancelButtonTap(args: EventData) {
    // vm.onCancelButtonTapHandler();
    const view = args.object as View;
    view.page.closeModal(null);

    showStatusBar();
}

export function onOkButtonTap(args: EventData) {
    const view = args.object as View;
    itemDetailsDataForm.validateAndCommitAll().then(ok => {
        if (ok) {
            const newItem = vm.onOkButtonTapHandler();
            view.page.closeModal(newItem);

            showStatusBar();
        }
    });
}

export function onAssigneeRowTap(args: EventData) {
    const view = args.object as View;

    showModalAssigneeList(view.page, vm.selectedAssignee).then(
        selectedAssignee => {
            if (selectedAssignee) {
                vm.selectedAssignee = selectedAssignee;
            }
        }
    );
}
