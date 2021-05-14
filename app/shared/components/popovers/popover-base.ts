import { EventData, GridLayout } from '@nativescript/core';
import { LayoutBase } from 'tns-core-modules/ui/layouts/layout-base';
import { closePopover } from '~/shared/helpers/popover/popover.helper';

export function onPopoverLoaded(args: EventData) {
    const container = args.object as LayoutBase;

    const overlay = new GridLayout();
    overlay.className = 'overlay';

    overlay.on('tap', () => {
        closePopover();
    });

    container.insertChild(overlay, 0);
}
