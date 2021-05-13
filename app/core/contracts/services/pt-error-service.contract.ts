export interface PtErrorService {
    setCurrentUser(userId: string, userName: string): void;
    reportError(error: Error): void;
}
