function registerWebSocket() {

    SpaceHub.RegisterEvents();

    // Start the connection.
    $.connection.hub.start().done(function () {
        /*
        onLoadWorker.webSocketConnected = true;
        onLoadWorker.progress = onLoadWorker.progress + 10;
        $('#loadingProgressbar').attr('value', onLoadWorker.progress);
        onLoadWorker.endStartup();
        */
        PlanetType.GetPlanetTypes();
    });
}

function StartUp() {
    registerWebSocket();
    
}

$(document).ready(StartUp);