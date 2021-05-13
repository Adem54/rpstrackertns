/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="./node_modules/tns-platform-declarations/android.d.ts" />


declare namespace NodeJS {
    interface Global {
        __runtimeVersion: any;
        TNS_ENV: string;
    }
}
