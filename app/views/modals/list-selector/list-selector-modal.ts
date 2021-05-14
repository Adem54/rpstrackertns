import { ShownModallyData, Page } from '@nativescript/core';
import { ListSelectorModalViewModel } from '~/shared/view-models/modals/list-selector/list-selector.modal.vm';

export function onShownModally(args: ShownModallyData) {
  const page = <Page>args.object;
  const listSelectorModal = new ListSelectorModalViewModel(
    args.context,
    args.closeCallback
  );
  page.bindingContext = listSelectorModal;
}
