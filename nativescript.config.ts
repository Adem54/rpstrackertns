import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.rpstrackertns',
  appPath: 'app',
  appResourcesPath: 'app/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
  discardUncaughtJsExceptions: 'false',
  useLegacyWorkflow: false,
} as NativeScriptConfig;
