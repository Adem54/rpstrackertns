import { Trace } from '@nativescript/core/trace';
import { PtErrorService } from '~/core/contracts/services';

export class RPSTraceWriter {


    constructor(private errorService: PtErrorService) { }

    public write(message: any, category: string, type?: number): void {
        if (type) {
            switch (type) {
                case Trace.messageType.log:
                    console.log(
                        'RPS TRACEWRITER: ' + category + ': ' + message
                    );
                    break;
                case Trace.messageType.error:
                    console.error(
                        'RPS TRACEWRITER: ' + category + ': ' + message
                    );

                    this.errorService.reportError(new Error(message));

                    break;
            }
        } else {
            console.log('RPS TRACEWRITER: ' + category + ': ' + message);
        }
    }
}
