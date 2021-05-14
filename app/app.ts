import * as application from '@nativescript/core/application';
import * as traceModule from '@nativescript/core/trace';
import { appConfig } from '~/config/app-config';
import { setAppEvents } from './globals/app-events/app-events';
import { localize } from 'nativescript-localize';

import '~/globals/dependencies/locator';
import { RPSTraceCategory } from './infrastructure/tracing/rps-trace-categories';
import { RPSTraceWriter } from './infrastructure/tracing/rps-trace-writer';
import { getErrorService } from '~/globals/dependencies/locator';

import { Sentry } from 'nativescript-sentry';

const dsn = 'https://a9ef42151e884d7f9dfc9a363ee5b1c7@sentry.io/1775832';
Sentry.init(dsn);

/*
const errorService = getErrorService();

traceModule.setCategories(traceModule.categories.concat(RPSTraceCategory));

traceModule.clearWriters();
traceModule.addWriter(new RPSTraceWriter(errorService));

traceModule.enable();
*/

const errorHandler: traceModule.ErrorHandler = {
    handlerError(err: Error) {
        if (global.TNS_ENV === 'dev') {
            console.log('RPS ERROR: ' + err);
            throw new Error('ERROR FROM HANDLER. ' + err.message);
        } else if (global.TNS_ENV === 'prod') {
            // report our error to backend

            // const errorService = getErrorService();
            // errorService.reportError(err);
            Sentry.captureException(err);
        }
    }
};
traceModule.setErrorHandler(errorHandler);

setAppEvents();

application.setResources({ L: localize });
application.run({ moduleName: 'app-root' });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
