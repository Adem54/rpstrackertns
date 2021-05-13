import { Color } from 'tns-core-modules/color';

declare namespace com {
    namespace telerik {
        namespace widget {
            namespace numberpicker {
                class RadNumberPicker {
                    rootView;
                    labelView();
                    decreaseView();
                    increaseView();
                }
            }
        }
    }
}

type NumberPicker = com.telerik.widget.numberpicker.RadNumberPicker;

export function setStepperEditorColors(
    editor,
    lightColor: Color,
    darkColor: Color
): void {
    const numberPicker: NumberPicker = <NumberPicker>editor.getEditorView();

    numberPicker.labelView().setTextColor(darkColor.android);
    numberPicker.decreaseView().setTextColor(darkColor.android);
    numberPicker.increaseView().setTextColor(darkColor.android);

    const background1 = new android.graphics.drawable.GradientDrawable();
    background1.setStroke(2, lightColor.android);
    numberPicker.rootView().setBackground(background1);

    const background2 = new android.graphics.drawable.GradientDrawable();
    background2.setStroke(2, lightColor.android);
    numberPicker.decreaseView().setBackground(background2);

    const background3 = new android.graphics.drawable.GradientDrawable();
    background3.setStroke(2, lightColor.android);
    numberPicker.increaseView().setBackground(background3);
}
