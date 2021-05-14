import * as app from '@nativescript/core/application';
import { Trace } from '@nativescript/core';
import { setNativeEvents } from '~/globals/app-events/app-events-native';
import { getErrorService } from '../dependencies/locator';

export const setAppEvents = () => {
    setNativeEvents();

    app.on(app.launchEvent, function (_args: app.ApplicationEventData) {
        console.log('launchEvent');
    });

    app.on(app.displayedEvent, function (_args: app.ApplicationEventData) {
        console.log('displayedEvent');
    });

    app.on(app.suspendEvent, function (_args: app.ApplicationEventData) {
        console.log('suspendEvent');
    });

    app.on(app.resumeEvent, function (_args: app.ApplicationEventData) {
        console.log('resumeEvent');
    });

    app.on(app.exitEvent, function (_args: app.ApplicationEventData) {
        console.log('exitEvent');
    });

    app.on(app.lowMemoryEvent, function (_args: app.ApplicationEventData) {
        console.log('lowMemoryEvent');
    });

    app.on(app.orientationChangedEvent, function (
        _args: app.ApplicationEventData
    ) {
        console.log('orientationChangedEvent');
    });



    app.on(app.uncaughtErrorEvent, function (_args: app.UnhandledErrorEventData) {
        console.log('uncaughtErrorEvent');
        console.log(_args.error);
        Trace.error(_args.error);
    });

    app.on(app.discardedErrorEvent, function (_args: app.DiscardedErrorEventData) {
        console.log('discardedErrorEvent');
        console.log(_args.error);
        getErrorService().reportError(_args.error);
    });
};
