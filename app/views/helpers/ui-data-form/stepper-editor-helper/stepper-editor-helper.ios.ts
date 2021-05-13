import { Color } from 'tns-core-modules/color';

export function setStepperEditorColors(
    editor,
    lightColor: Color,
    darkColor: Color
): void {
    const coreEditor = <UIStepper>editor.editor;
    coreEditor.tintColor = lightColor.ios;

    for (let i = 0; i < coreEditor.subviews.count; i++) {
        if (coreEditor.subviews[i] instanceof UIButton) {
            (<any>coreEditor.subviews[i]).imageView.tintColor = darkColor.ios;
        }
    }
}
