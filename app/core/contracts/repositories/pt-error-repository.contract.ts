
export interface PtErrorRepository {
    apiEndpoint: string;

    reportError(
        errorData: string
    ): Promise<void>;
}
