import { PtErrorRepository } from '~/core/contracts/repositories';
import { PtErrorService, PtDeviceInfoService } from '~/core/contracts/services';

export class ErrorService implements PtErrorService {

    private _uId: string;
    private _uName: string;

    constructor(
        private errorRepo: PtErrorRepository,
        private deviceInfoService: PtDeviceInfoService
    ) { }

    public setCurrentUser(userId: string, userName: string): void {
        this._uId = userId;
        this._uName = userName;
    }

    public reportError(error: Error) {

        const deviceData = this.deviceInfoService.getDeviceInfo();

        const errorData = {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            deviceData,
            user: {
                userId: this._uId,
                userName: this._uName
            }
        };

        this.errorRepo.reportError(JSON.stringify(errorData));
    }


}
