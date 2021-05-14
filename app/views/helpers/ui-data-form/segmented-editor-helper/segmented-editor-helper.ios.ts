import { Color } from '@nativescript/core';

export function setSegmentedEditorColor(editor, color: Color): void {
  const coreEditor = <UISegmentedControl>editor.editor;
  coreEditor.tintColor = color.ios;
}
