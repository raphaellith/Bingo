/*
Handles progressive web app installation instructions, which vary across devices and browsers as described below. No instructions should be displayed if the page is run already as a PWA.


1. IN SUPPORTED BROWSERS AND DEVICES

"To install the BINGO app on this device, please press the button below."

In supported browsers and devices, an event 'beforeinstallprompt' will occur upon loading of the site. By listening, catching and prompting this event properly, we can create a button that prompts the app installation process when pressed.

This works in the majority of browsers and devices, with notable exceptions listed below. See compatibility table in https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event.

- Firefox and Safari on desktop
- Firefox on Android
- All iOS devices


2. ON DESKTOP AND ANDROID DEVICES WHERE THE BROWSER DOES NOT SUPPORT beforeinstallprompt

"To install the BINGO app on this device, please switch to a different browser such as Chrome, Opera or Edge."


3. ON iOS DEVICES

"To install the BINGO app on this device, please tap Share and select Add to Home Screen."


4. WHEN VIEWED IN PWA

"Looks like you've already installed the app &mdash; brilliant!"
*/


function isIOS() {  // Returns whether iOS is being used
    const userAgent = navigator.userAgent || window.opera;
    
    // Check for iOS devices
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
}


function isRunAsPWA() {  // Returns whether pge is run as a PWA instead of in browser
    return window.matchMedia('(display-mode: standalone)').matches;
}


function initInstallationInstructions() {
    // Create variable for catching the beforeInstallPrompt event
    let beforeInstallPromptEvent;  

    // Obtain references to each of the three instruction sets

    let installInstructionsForSupportedBrowsers = document.getElementById("install-instructions-for-supported-browsers");

    let installInstructionsForUnsupportedBrowsersDesktopOrAndroid = document.getElementById("install-instructions-for-unsupported-browsers-desktop-or-android");

    let installInstructionsForIOS = document.getElementById("install-instructions-for-ios");

    let alreadyInstalledMessage = document.getElementById("already-installed-message");

    if (isRunAsPWA()) {
        alreadyInstalledMessage.hidden = false;
        return;
    }

    if (isIOS()) {
        installInstructionsForIOS.hidden = false;
    } else {
        installInstructionsForUnsupportedBrowsersDesktopOrAndroid.hidden = false;
    }

    // Listen for 'beforeinstallprompt'
    window.addEventListener(
        'beforeinstallprompt',
        (event) => {
            event.preventDefault();

            // Show instruction set for supported browsers
            installInstructionsForIOS.hidden = true;
            installInstructionsForSupportedBrowsers.hidden = false;
            installInstructionsForUnsupportedBrowsersDesktopOrAndroid.hidden = true;

            // Store the event so it can be triggered later when the user clicks the installButton
            beforeInstallPromptEvent = event;
        }
    );

    let installButton = document.getElementById("install-button");
    installButton.addEventListener(
        'click',
        () => {
            // if the deferredEvent exists, call its prompt method to display the install dialog
            if (beforeInstallPromptEvent) {
                beforeInstallPromptEvent.prompt();
            }
        }
    );
}


initInstallationInstructions();