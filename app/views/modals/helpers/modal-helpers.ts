import { Page, ShowModalOptions } from 'tns-core-modules/ui/page';
import { ROUTES } from '~/shared/helpers/navigation/routes';
import { PtModalContext } from './pt-modal-context.model';
import { PtModalListDisplayItem } from './pt-modal-list-display-item.model';
import { PtUser } from '~/core/models/domain';
import { getUserService } from '~/globals/dependencies/locator';
import { ptUserToModalListDisplayItem } from './pt-modal-to-model-utils';
import { EMPTY_STRING } from '~/core/models/domain/constants/strings';

let modalIsShowing = false;

export function createPtModalContext<T, R>(
    title: string,
    payload: T,
    defaultResult: R = null,
    btnOkText: string = 'Done',
    btnCancelText: string = 'Cancel'
): PtModalContext<T, R> {
    return {
        title,
        payload,
        defaultResult,
        btnOkText,
        btnCancelText
    };
}

export function showModal<T>(
    page: Page,
    route: string,
    fullscreen: boolean,
    context: any
): Promise<T> {
    return new Promise<T>(resolve => {
        const showModalOptions: ShowModalOptions = {
            context: context,
            closeCallback: resolve,
            fullscreen: fullscreen
        };

        page.showModal(route, showModalOptions);
    });
}

export function showModalNewItem<T>(page: Page): Promise<T> {
    const context = {
        btnOkText: 'Save'
    };
    return showModal<T>(page, ROUTES.newItemModal, true, context);
}

function createModal<T, R>(
    page: Page,
    route: string,
    context: PtModalContext<T, R>
): Promise<R> {
    if (modalIsShowing) {
        return Promise.reject<R>('A modal dialog is already showing.');
    }

    return new Promise<R>(resolve => {
        const showModalOptions: ShowModalOptions = {
            context: context,
            closeCallback: result => {
                resolve(result);
                modalIsShowing = false;
            },
            fullscreen: true
        };

        page.showModal(route, showModalOptions);
    });
}

export function showModalListSelector<T>(
    page: Page,
    context: PtModalContext<
        PtModalListDisplayItem<T>[],
        PtModalListDisplayItem<T>
    >
): Promise<PtModalListDisplayItem<T>> {
    return createModal<PtModalListDisplayItem<T>[], PtModalListDisplayItem<T>>(
        page,
        ROUTES.listSelectorModal,
        context
    );
}

export function showModalAssigneeList(
    page: Page,
    currentAssignee: PtUser
): Promise<PtUser> {
    const userService = getUserService();

    return new Promise<PtUser>(resolve => {
        userService.fetchUsers().then(users => {
            const items = users.map(ptUserToModalListDisplayItem);
            const defaultItem = ptUserToModalListDisplayItem(currentAssignee);

            const ctx = createPtModalContext<
                PtModalListDisplayItem<PtUser>[],
                PtModalListDisplayItem<PtUser>
            >('Select Assignee', items, defaultItem, EMPTY_STRING, 'Cancel');

            showModalListSelector<PtUser>(page, ctx).then(modalItem => {
                resolve(modalItem.payload);
            });
        });
    });
}
