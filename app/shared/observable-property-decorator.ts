import { Observable } from '@nativescript/core';

const PREFIX = 'RPS_OBSERVABLE_PROP_';

export function ObservableProperty() {
    return (target: Observable, propertyKey: string) => {
        Object.defineProperty(target, propertyKey, {
            get() {
                return this[PREFIX + propertyKey];
            },
            set(value) {
                if (this[PREFIX + propertyKey] === value) {
                    return;
                }

                this[PREFIX + propertyKey] = value;
                this.notifyPropertyChange(propertyKey, value);
            },
            enumerable: true,
            configurable: true
        });
    };
}
