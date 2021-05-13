export function setStatusBarColors(): void {
    UIApplication.sharedApplication.setStatusBarStyleAnimated(
        UIStatusBarStyle.LightContent,
        false
    );
}

export function hideStatusBar(): void {
    UIApplication.sharedApplication.setStatusBarHiddenWithAnimation(
        true,
        UIStatusBarAnimation.Slide
    );
}

export function showStatusBar(): void {
    UIApplication.sharedApplication.setStatusBarHiddenWithAnimation(
        false,
        UIStatusBarAnimation.Slide
    );
}
