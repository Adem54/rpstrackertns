import * as appModule from '@nativescript/core/application';
import * as platformModule from '@nativescript/core/platform';

import { PtDeviceInfoService } from '~/core/contracts/services';

export class DeviceInfoService implements PtDeviceInfoService {

    public getDeviceInfo() {

        let appId = '';
        let appVersionName = '';
        let appVersionCode = '';

        if (platformModule.isIOS) {
            appId = NSBundle.mainBundle.bundleIdentifier;
            appVersionName = NSBundle.mainBundle.infoDictionary.objectForKey('CFBundleShortVersionString');
            appVersionCode = NSBundle.mainBundle.infoDictionary.objectForKey('CFBundleVersion');
        } else {
            appId = appModule.android.context.getPackageName();
            const androidPackageManager = appModule.android.context.getPackageManager();
            const androidPackageInfo = androidPackageManager.getPackageInfo(appId, 0);
            appVersionName = androidPackageInfo.versionName;
            appVersionCode = androidPackageInfo.versionCode;
        }

        return {
            device: {
                deviceType: platformModule.device.deviceType,
                deviceModel: platformModule.device.model,
                deviceOS: platformModule.device.os,
                deviceOSVersion: platformModule.device.osVersion,
                deviceUUID: platformModule.device.uuid
            },
            screen: {
                screenHeight: platformModule.Screen.mainScreen.heightDIPs,
                screenWidth: platformModule.Screen.mainScreen.widthDIPs,
                screenScale: platformModule.Screen.mainScreen.scale
            },
            appId,
            appVersionName,
            appVersionCode,
            runtime: {
                name: 'nativescript',
                version: global.__runtimeVersion
            }
        };
    }
}
