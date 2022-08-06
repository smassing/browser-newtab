
//autorun this function on page load.
(function() {
    let connectedVPN = false;
    let showLauncher = false;

    

    function initConnectivitySystem() {
        
        function queryCourtNetworkConnection() {
            // Creating Our XMLHttpRequest object 
            let xhr = new XMLHttpRequest();

            // Making our connection  
            let url = "http://security.ca10.circ10.dcn/user";
            //var url = 'https://jsonplaceholder.typicode.com/todos/1';

            xhr.onerror = function (e) {
                e.preventDefault();

                //set VPN connection status 
                connectedVPN = false;
            }

            //set default VPN connection status
            connectedVPN = true;

            xhr.open("GET", url, true);
            xhr.setRequestHeader('Accept','application/html');
            //xhr.setRequestHeader('Accept','application/json;odata=verbose');

            // Sending our request 
            xhr.send();
        }

        queryCourtNetworkConnection();

    }



    //run app bootstrap
    initConnectivitySystem();
    //get launcher preference value from local storage
    let launcherPref = window.localStorage.getItem('ca10launcher::launcher');
    if (launcherPref) {
        if (launcherPref=='launcher') {
            showLauncher = true;
        } else {
            showLauncher = false;
        }
    } else {
        showLauncher = false;
    }
    if (showLauncher) {
        window.location.href = './launcher.htm';
    } else {
        window.location.href = 'https://fedcourts.sharepoint.com/sites/CA10';
    }

})();