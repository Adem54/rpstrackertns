import * as frame from '@nativescript/core/ui/frame';

declare const android: any;

export function setStatusBarColors(): void {
    /*
    if (platform.device.sdkVersion >= '21') {
        const window = app.android.startActivity.getWindow();
        window.setStatusBarColor(0xff0000);

        const View = android.view.View;

        const decorView = window.getDecorView();
        decorView.setSystemUiVisibility(
            // tslint:disable-next-line:no-bitwise
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        );
    }
    */
}

export function hideStatusBar() {
    // execure android hiding code
    frame
        .topmost()
        .android.activity.getWindow()
        .getDecorView()
        .setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_FULLSCREEN);
}

export function showStatusBar() {
    // execure android showing code
    frame
        .topmost()
        .android.activity.getWindow()
        .getDecorView()
        .setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_VISIBLE);
}
