import { EventData, PropertyChangeData } from 'tns-core-modules/ui/page';
import { Color } from 'tns-core-modules/color';
import { LayoutBase } from 'tns-core-modules/ui/layouts/layout-base';
import { Label } from 'tns-core-modules/ui/label';
import { TextField } from 'tns-core-modules/ui/text-field';
import { KeyboardType } from 'tns-core-modules/ui/editable-text-base';
import { AnimationPromise } from 'tns-core-modules/ui/animation';
import { fromObject } from 'tns-core-modules/data/observable';

interface FloatLabelVm {
    placeholder: string;
    keyboardType: KeyboardType;
    secure: boolean;
    text: string;
    textChanged: Function;
}

interface ObsWithPlaceholder extends LayoutBase {
    placeholder: string;
    keyboardType: KeyboardType;
    secure: boolean;
    text: string;
    textChanged: Function;
}

interface PlaceholderEventData {
    object: ObsWithPlaceholder;
}

export function onLoaded(args: PlaceholderEventData) {
    const component = args.object;
    const label = component.getChildAt(0) as Label;
    const textField = component.getChildAt(1) as TextField;

    const vmObj: FloatLabelVm = {
        text: component.text,
        textChanged: component.textChanged,
        keyboardType: component.keyboardType,
        secure: component.secure,
        placeholder: component.placeholder
    };
    const vm = fromObject(vmObj);
    component.bindingContext = vm;

    if (vmObj.placeholder) {
        label.text = vmObj.placeholder;
    }

    if (vmObj.secure) {
        textField.secure = vmObj.secure;
    }
    if (vmObj.keyboardType) {
        textField.keyboardType = vmObj.keyboardType;
    }
    if (vmObj.text && vmObj.text !== '') {
        raiseLabel(label);
    }
    vm.on('propertyChange', (arg: PropertyChangeData) => {
        if (arg.propertyName === 'text') {
            vmObj.textChanged.apply(component.page.bindingContext, [
                arg.value
            ]);
        }
    });
}

export function onFocus(args) {
    const parent = args.object.parent;
    const label = parent.getChildAt(0);
    const textField = parent.getChildAt(1);

    // animate the label sliding up and less transparent.
    raiseLabel(label);

    // set the border bottom color to green to indicate focus
    textField.borderBottomColor = new Color('#00b47e');
}

export function onBlur(args) {
    const parent = args.object.parent;
    const label = parent.getChildAt(0);
    const textField = parent.getChildAt(1);

    // if there is text in our input then don't move the label back to its initial position.
    if (!textField.text) {
        lowerLabel(label);
    }
    // reset border bottom color.
    textField.borderBottomColor = new Color('#cec8c8');
}

function raiseLabel(label: Label): AnimationPromise {
    return label.animate({
        translate: { x: 0, y: - 25 },
        opacity: 1,
    });
}

function lowerLabel(label: Label): AnimationPromise {
    return label.animate({
        translate: { x: 0, y: 0 },
        opacity: 0.4
    });
}
