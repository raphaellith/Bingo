if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then((reg) => console.log("Service worker registered", reg))
        .catch((err) => console.log("Service worker not registered", err));
    
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.update();
        }
    });
} else {
    console.log("Service worker is not supported");
}
