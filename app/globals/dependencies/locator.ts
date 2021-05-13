import { appConfig } from '~/config/app-config';
import {
    PtAuthRepository,
    PtBacklogRepository,
    PtLoggingRepository,
    PtStorageRepository,
    PtUserRepository,
    PtDashboardRepository,
    PtErrorRepository
} from '~/core/contracts/repositories';
import {
    PtAppStateService,
    PtAuthService,
    PtBacklogService,
    PtCommentService,
    PtLoggingService,
    PtStorageService,
    PtTaskService,
    PtUserService,
    PtDashboardService,
    PtDeviceInfoService,
    PtErrorService
} from '~/core/contracts/services';
import { AppConfig } from '~/core/models/config/app-config.model';
import {
    AppStateService,
    LoggingService,
    StorageService,
    UserService
} from '~/core/services';
import { } from '~/core/services';
import {
    BacklogService,
    CommentService,
    TaskService
} from '~/core/services/backlog';
import { StorageRepository } from '~/infrastructure/local';
import {
    AuthRepository,
    BacklogRepository,
    LoggingRepository,
    UserRepository
} from '~/infrastructure/repositories';
import { AuthService } from '~/core/services/auth';
import { DashboardRepository } from '~/infrastructure/repositories/dashboard.repository';
import { DashboardService } from '~/core/services/dashboard';
import { DeviceInfoService } from '~/infrastructure/local/deviceinfo.service';
import { ErrorRepository } from '~/infrastructure/repositories/error.repository';
import { ErrorService } from '~/core/services/error.service';

const config = <AppConfig>appConfig;

// Init Repositories
let errorRepo: PtErrorRepository;

const loggingRepo: PtLoggingRepository = new LoggingRepository(
    config.loggingEnabled,
    config.loggingLevel
);

const dashboardRepo: PtDashboardRepository = new DashboardRepository(
    config.apiEndpoint
);

const backlogRepo: PtBacklogRepository = new BacklogRepository(
    config.apiEndpoint
);
const authRepo: PtAuthRepository = new AuthRepository(config.apiEndpoint);
const storageRepo: PtStorageRepository = new StorageRepository();
const userRepo: PtUserRepository = new UserRepository(config.apiEndpoint);

// Init Services
let deviceInfoService: PtDeviceInfoService = new DeviceInfoService();
let errorService: PtErrorService;
const loggingService: PtLoggingService = new LoggingService(loggingRepo);
const storageService: PtStorageService = new StorageService(storageRepo);
const appStateService: PtAppStateService = new AppStateService(storageService);
const authService: PtAuthService = new AuthService(
    authRepo,
    storageService,
    loggingService,
    appStateService
);
const dashboardService: PtDashboardService = new DashboardService(
    dashboardRepo
);
const backlogService: PtBacklogService = new BacklogService(
    loggingService,
    backlogRepo,
    appStateService
);
const commentService: PtCommentService = new CommentService(
    loggingService,
    backlogRepo,
    authService
);
const taskService: PtTaskService = new TaskService(loggingService, backlogRepo);
const userService: PtUserService = new UserService(
    loggingService,
    userRepo,
    appStateService
);


// Repo initializers
function getErrorRepo(): PtErrorRepository {
    if (!errorRepo) {
        errorRepo = new ErrorRepository(config.apiEndpoint);
    } return errorRepo;
}


// Service providers
export function getDeviceInfoService(): PtDeviceInfoService {
    if (!deviceInfoService) {
        deviceInfoService = new DeviceInfoService();
    }
    return deviceInfoService;
}

export function getErrorService(): PtErrorService {
    if (!errorService) {
        errorService = new ErrorService(getErrorRepo(), getDeviceInfoService());
    }
    return errorService;
}

export function getAuthService(): PtAuthService {
    return authService;
}

export function getDashboardService(): PtDashboardService {
    return dashboardService;
}

export function getBacklogService(): PtBacklogService {
    return backlogService;
}

export function getCommentService(): PtCommentService {
    return commentService;
}

export function getLoggingService(): PtLoggingService {
    return loggingService;
}

export function getStorageService(): PtStorageService {
    return storageService;
}

export function getTaskService(): PtTaskService {
    return taskService;
}

export function getUserService(): PtUserService {
    return userService;
}

export function getApiEndpoint() {
    return config.apiEndpoint;
}
