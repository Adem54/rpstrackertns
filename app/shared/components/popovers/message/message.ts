import { EventData } from 'tns-core-modules/ui/page';
import { onPopoverLoaded } from '../popover-base';
import { closePopover } from '~/shared/helpers/popover/popover.helper';

export function onLoaded(args: EventData) {
    onPopoverLoaded(args);
}

export function onTapOK() {
    alert('ok');
}

export function onTapClose() {
    closePopover();
}

export function unhandledTap() {
    // noop
}
