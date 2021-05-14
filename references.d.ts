/// <reference path="./node_modules/@nativescript/types/index.d.ts" />

declare namespace NodeJS {
    interface Global {
        __runtimeVersion: any;
        TNS_ENV: string;
    }
}
