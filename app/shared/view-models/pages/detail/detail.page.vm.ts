import { Observable, ObservableArray } from '@nativescript/core';
import { ItemType } from '~/core/constants/pt-item-types';

import { PtItem, PtUser } from '~/core/models/domain';
import { PriorityEnum } from '~/core/models/domain/enums';
import { PtItemType } from '~/core/models/domain/types';

import { DetailScreenType } from '~/core/models/types';

import { ObservableProperty } from '~/shared/observable-property-decorator';

import {
    getAuthService,
    getBacklogService,
    getTaskService,
    getCommentService,
    getApiEndpoint
} from '~/globals/dependencies/locator';
import {
    PtAuthService,
    PtBacklogService,
    PtTaskService,
    PtCommentService
} from '~/core/contracts/services';
import { goBack } from '~/shared/helpers/navigation/nav.helper';
import { toDeleteItemRequest } from '~/core/contracts/requests/backlog/delete-item.request';
import {
    PtItemDetailsEditFormModel,
    ptItemToFormModel,
    applyFormModelUpdatesToItem
} from '~/core/models/forms';
import { PT_ITEM_STATUSES, PT_ITEM_PRIORITIES } from '~/core/constants';
import {
    toUpdateItemRequest,
    toCreateTaskRequest,
    toCreateCommentRequest
} from '~/core/contracts/requests/backlog';
import { EMPTY_STRING } from '~/core/models/domain/constants/strings';
import { PtTaskViewModel } from './pt-task.vm';
import { PtCommentViewModel } from './pt-comment.vm';
import { PtNewTask, PtNewComment } from '~/core/models/dto/backlog';
import { getCurrentUserAvatar } from '~/core/services';

export class DetailViewModel extends Observable {
    private authService: PtAuthService;
    private backlogService: PtBacklogService;
    private taskService: PtTaskService;
    private commentService: PtCommentService;

    @ObservableProperty() public selectedScreen: DetailScreenType = 'details';
    @ObservableProperty() public selectedAssignee: PtUser;
    public itemTitle: string;

    /* details form */
    public itemForm: PtItemDetailsEditFormModel = null;
    public itemTypesProvider = ItemType.List.map(t => t.PtItemType);
    public statusesProvider = PT_ITEM_STATUSES;
    public prioritiesProvider = PT_ITEM_PRIORITIES;
    @ObservableProperty() public selectedTypeValue: PtItemType;
    public selectedPriorityValue: PriorityEnum;
    @ObservableProperty() public itemTypeImage;
    /* details form END */

    /* tasks */
    public newTaskTitle = EMPTY_STRING;
    public tasks: ObservableArray<PtTaskViewModel>;
    /* tasks END */

    /* comments */
    public currentUserAvatar: string;
    public newCommentText = EMPTY_STRING;
    public comments: ObservableArray<PtCommentViewModel>;
    /* comments END */

    constructor(private ptItem: PtItem) {
        super();

        this.authService = getAuthService();
        this.backlogService = getBacklogService();
        this.taskService = getTaskService();
        this.commentService = getCommentService();

        this.itemForm = ptItemToFormModel(ptItem);

        this.currentUserAvatar = getCurrentUserAvatar(
            getApiEndpoint(),
            this.authService.getCurrentUserId()
        );

        this.itemTitle = ptItem.title;
        this.selectedAssignee = ptItem.assignee;

        this.tasks = new ObservableArray<PtTaskViewModel>(
            ptItem.tasks.map(task => new PtTaskViewModel(task, ptItem))
        );
        this.comments = new ObservableArray<PtCommentViewModel>(
            ptItem.comments.map(comment => new PtCommentViewModel(comment))
        );
    }

    public onTabDetailsTap() {
        this.selectedScreen = 'details';
    }

    public onTabTasksTap() {
        this.selectedScreen = 'tasks';
    }

    public onTabChitchatTap() {
        this.selectedScreen = 'chitchat';
    }

    /* details START */
    public updateSelectedTypeValue(selTypeValue: PtItemType) {
        this.selectedTypeValue = selTypeValue;
        this.itemTypeImage = ItemType.imageResFromType(this.selectedTypeValue);
    }

    public deleteRequested() {
        const deleteItemRequest = toDeleteItemRequest(this.ptItem);
        this.backlogService
            .deletePtItem(deleteItemRequest)
            .then(() => {
                goBack();
            })
            .catch(() => {
                console.log('some error occured');
                goBack();
            });
    }

    public notifyUpdateItem() {
        const updatedItem = applyFormModelUpdatesToItem(
            this.ptItem,
            this.itemForm,
            this.selectedAssignee
        );

        const updateItemRequest = toUpdateItemRequest(updatedItem);

        this.backlogService.updatePtItem(updateItemRequest);
    }

    /* details END */

    /* tasks START */
    public onAddTask() {
        const newTitle = this.newTaskTitle.trim();
        if (newTitle.length === 0) {
            return;
        }

        const newTask: PtNewTask = {
            title: newTitle,
            completed: false
        };

        const createTaskRequest = toCreateTaskRequest(newTask, this.ptItem);

        this.taskService
            .addNewPtTask(createTaskRequest)
            .then(response => {
                this.tasks.unshift(
                    new PtTaskViewModel(response.createdTask, this.ptItem)
                );
                this.set('newTaskTitle', EMPTY_STRING);
            })
            .catch(() => {
                console.log('something went wrong when adding task');
            });
    }
    /* tasks END */

    /* comments START */
    public onAddComment() {
        const newCommentTxt = this.newCommentText.trim();
        if (newCommentTxt.length === 0) {
            return;
        }

        const newComment: PtNewComment = {
            title: newCommentTxt
        };

        const createCommentRequest = toCreateCommentRequest(
            newComment,
            this.ptItem
        );

        this.commentService
            .addNewPtComment(createCommentRequest)
            .then(response => {
                const addedComment = response.createdComment;
                addedComment.user.avatar = this.currentUserAvatar;
                this.comments.unshift(new PtCommentViewModel(addedComment));
                this.set('newCommentText', EMPTY_STRING);
            })
            .catch(() => {
                console.log('something went wrong when adding comment');
            });
    }
    /* comments END */
}
