import { topmost, EventData } from 'tns-core-modules/ui/frame';

export const POPOVER_SHOW_EVENT_NAME = 'showPopover';
export const POPOVER_HIDE_EVENT_NAME = 'hidePopover';

export type PopoverComponentType = {
    path: 'shared/components/popovers/message';
    name: 'message';
    bindingContext: string;
};

export interface PopoverComponentPayload {
    component: PopoverComponentType;
}

export interface PopoverEventData extends EventData {
    payload?: PopoverComponentPayload;
}

export function showPopoverMessage(message: string) {
    const evtData: PopoverEventData = {
        eventName: POPOVER_SHOW_EVENT_NAME,
        object: null,
        payload: {
            component: {
                path: 'shared/components/popovers/message',
                name: 'message',
                bindingContext: message
            }
        }
    };
    topmost().page.notify(evtData);
}

export function closePopover() {
    const evtData: PopoverEventData = {
        eventName: POPOVER_HIDE_EVENT_NAME,
        object: null
    };
    topmost().page.notify(evtData);
}
