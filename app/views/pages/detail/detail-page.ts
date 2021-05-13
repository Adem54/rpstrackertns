import { EventData, NavigatedData, Page, View } from 'tns-core-modules/ui/page';
import { ConfirmOptions, confirm } from 'tns-core-modules/ui/dialogs';
import { TextField } from 'tns-core-modules/ui/text-field';

import { DataFormEventData, RadDataForm } from 'nativescript-ui-dataform';

import { DetailViewModel } from '~/shared/view-models/pages/detail/detail.page.vm';
import { PtItem } from '~/core/models/domain';
import { goBack } from '~/shared/helpers/navigation/nav.helper';
import { showModalAssigneeList } from '~/views/modals/helpers/modal-helpers';
import { setStepperEditorColors } from '~/views/helpers/ui-data-form/stepper-editor-helper/stepper-editor-helper';
import { COLOR_LIGHT, COLOR_DARK } from '~/core/constants';
import { PriorityEnum } from '~/core/models/domain/enums';
import { setSegmentedEditorColor } from '~/views/helpers/ui-data-form/segmented-editor-helper/segmented-editor-helper';
import { setMultiLineEditorFontSize } from '~/views/helpers/ui-data-form/multi-line-editor-helper/multi-line-editor-helper';
import {
    setPickerEditorImageLocation,
    getPickerEditorValueText
} from '~/views/helpers/ui-data-form/picker-editor-helper/picker-editor-helper';
import { PtItemType } from '~/core/models/domain/types';

import { PtTaskViewModel } from '~/shared/view-models/pages/detail/pt-task.vm';

let detailsVm: DetailViewModel;
let itemDetailsDataForm: RadDataForm;

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const currentItem = <PtItem>page.navigationContext;

    itemDetailsDataForm = page.getViewById('itemDetailsDataForm');

    detailsVm = new DetailViewModel(currentItem);
    page.bindingContext = detailsVm;
}

export function onDeleteTap() {
    const options: ConfirmOptions = {
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item?',
        okButtonText: 'Yes',
        cancelButtonText: 'Cancel'
    };
    // confirm with options, with promise
    confirm(options).then((result: boolean) => {
        // result can be true/false/undefined
        if (result) {
            detailsVm.deleteRequested();
        }
    });
}

export function onAssigneeRowTap(args: EventData) {
    const view = <View>args.object;

    showModalAssigneeList(view.page, null).then(selectedAssignee => {
        if (selectedAssignee) {
            detailsVm.selectedAssignee = selectedAssignee;
        }
    });
}

export function onNavBackTap() {
    goBack();
}

export function onPropertyCommitted(args: DataFormEventData) {
    const vm = args.object.bindingContext as DetailViewModel;

    itemDetailsDataForm
        .validateAll()
        .then(ok => {
            if (ok) {
                vm.notifyUpdateItem();
            }
        })
        .catch(err => {
            console.error(err);
        });
}

export function onEditorUpdate(args: DataFormEventData) {
    switch (args.propertyName) {
        case 'description':
            editorSetupDescription(args.editor);
            break;
        case 'typeStr':
            editorSetupType(args.editor);
            break;
        case 'estimate':
            editorSetupEstimate(args.editor);
            break;
        case 'priorityStr':
            editorSetupPriority(args.editor);
            break;
    }
}

function editorSetupDescription(editor) {
    setMultiLineEditorFontSize(editor, 17);
}

function editorSetupType(editor) {
    setPickerEditorImageLocation(editor);
    const selectedTypeValue = <PtItemType>getPickerEditorValueText(editor);
    detailsVm.updateSelectedTypeValue(selectedTypeValue);
}

function editorSetupEstimate(editor) {
    // Change stepper colors
    setStepperEditorColors(editor, COLOR_LIGHT, COLOR_DARK);
}

function editorSetupPriority(editor) {
    const editorPriority = editor.value as PriorityEnum;
    setSegmentedEditorColor(editor, PriorityEnum.getColor(editorPriority));
}

/* TASKS START */
export function onTaskToggleTap(args: EventData) {
    const textField = <TextField>args.object;
    const taskVm = <PtTaskViewModel>textField.bindingContext;
    taskVm.onTaskToggleRequested();
}

export function onTaskFocused(args: EventData) {
    const textField = <TextField>args.object;
    const taskVm = <PtTaskViewModel>textField.bindingContext;
    taskVm.onTaskFocused(textField.text);

    textField.on('textChange', () => taskVm.onTextChange(textField.text));
}

export function onTaskBlurred(args: EventData) {
    const textField = <TextField>args.object;
    const taskVm = <PtTaskViewModel>textField.bindingContext;
    textField.off('textChange');
    taskVm.onTaskBlurred();
}
/* TASKS END */
