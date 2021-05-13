import { PtErrorRepository } from '~/core/contracts/repositories';
import { handleFetchErrors } from '~/infrastructure/fetch-error-handler';

export class ErrorRepository implements PtErrorRepository {
    constructor(public apiEndpoint: string) { }

    private getReportErrorUrl() {
        return `${this.apiEndpoint}/reporterror`;
    }

    public reportError(
        errorData: string
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log('error repo - reporting');
            fetch(this.getReportErrorUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ errorreport: errorData })
            })
                .then(handleFetchErrors)
                .then(() => resolve())
                .catch(er => reject(er));
        });
    }
}
