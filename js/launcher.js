
//autorun this function on page load.
(function() {
    let connectedVPN = false;
    let connectedInternet = false;

    function getLinksList() {
        
        //get the table in the document that holds the links.
        const myLinksList = document.getElementById('myLinks');
        //clear the table
        myLinksList.innerHTML = '';

        //get the updated link list from local storage
        let myLinksText = '';
        let myLinksJSON = window.localStorage.getItem('ca10launcher::mylinks');
        let myLinks = null;

        if (myLinksJSON) {
            myLinks = JSON.parse(myLinksJSON);
            myLinks = myLinks.sort((a,b)=>a.title.localeCompare(b.title));
        } else {
            myLinks = new Array;
        }

        //loop through list and create the template
        for (let i=0; i < myLinks.length; i++) {
            myLinksText += `<a target="_blank" href="${myLinks[i].url}" class="btn btn-secondary btn-sm ${myLinks[i].network} link-list me-1">${myLinks[i].title}</a> `;
        }

        //update the table in the document
        myLinksList.innerHTML = myLinksText;
    }



    function initSearchSystem() {

        function runSearch(searchText) {
            let searchEngine = document.getElementById('search-select').value;
            let searchEngineBase = '';
            let searchEngineTail = '';
            let requiresVPN = false;
            switch (searchEngine) {
                case 'google':
                        searchEngineBase = 'https://www.google.com/search?q=';
                        break;
                case 'bing':
                        searchEngineBase = 'https://www.bing.com/search?q=';
                        break;
                case 'duck':
                        searchEngineBase = 'https://duckduckgo.com/?q=';
                        break;
                case 'jnet':
                        searchEngineBase = 'https://jnet.ao.dcn/search/';
                        requiresVPN = true;
                        break;                    
                case 'guide':
                        searchEngineBase = 'https://jnet.ao.dcn/search/';
                        searchEngineTail = '?f%5B0%5D=type%3Aguide_page&source=guide_search';
                        requiresVPN = true;
                        break;      
                case 'spo':
                        searchEngineBase = 'https://fedcourts.sharepoint.com/sites/CA10/_layouts/15/search.aspx/siteall?q=';
                        requiresVPN = true;
                        break;              
                default:
                        searchEngineBase = 'https://www.google.com/search?q=';
            }
            if (requiresVPN && !connectedVPN) {
                alert('This requires the VPN.  Connect to the VPN now or contact the Helpdesk at (303) 335-3034.  Attempting your search on the internet.');
                //get search-engine value from local storage and set search-select
                let enginePref = window.localStorage.getItem('ca10launcher::inet-search-engine');
                if (enginePref) {
                    switch (enginePref) {
                        case 'google':
                                searchEngineBase = 'https://www.google.com/search?q=';
                                break;
                        case 'bing':
                                searchEngineBase = 'https://www.bing.com/search?q=';
                                break;
                        case 'duck':
                                searchEngineBase = 'https://duckduckgo.com/?q=';
                                break;
                        default:
                                searchEngineBase = 'https://www.google.com/search?q=';
                    }
                } else {
                    searchEngineBase = 'https://www.google.com/search?q=';
                }
                window.open(searchEngineBase + searchText + searchEngineTail);
            } else {
                window.open(searchEngineBase + searchText + searchEngineTail);
            }
        }


        //listen for keypress event on form field the forward to appropriate search engine
        let tb = document.getElementById('search-string');
        tb.addEventListener('keydown', function(e) {
            if (e.which == 13 ) {
                e.preventDefault();
                runSearch(tb.value);
                tb.value = '';
            }
        });
        //listen for search button press
        let sf = document.getElementById('search-form');
        sf.addEventListener('submit', function(e) {
            e.preventDefault();
            runSearch(tb.value);
            tb.value = '';
        });

    }

    function initSearchSelectionSystem() {

        //listen for changes to the searchengine and store preference locally
        let sb = document.getElementById('search-select');
        sb.addEventListener('change', function(e) {
            window.localStorage.setItem('ca10launcher::search-engine', sb.value);
        });


        //get search-engine value from local storage and set search-select
        let enginePref = window.localStorage.getItem('ca10launcher::search-engine');
        if (enginePref) {
            //console.log(enginePref);
        } else {
            enginePref = 'google';
        }
        let search = document.getElementById('search-select');
        search.value = enginePref;

    }


    function initConnectivitySystem() {
        
        function queryCourtNetworkConnection() {
            // Creating Our XMLHttpRequest object 
            let vpnConnectionStatus = document.getElementById('vpn-connection-status');
            let xhr = new XMLHttpRequest();

            // Making our connection  
            let url = "http://security.ca10.circ10.dcn/user";
            //var url = 'https://jsonplaceholder.typicode.com/todos/1';

            xhr.onerror = function (e) {
                e.preventDefault();

                function disableDCNLinks() {

                    //hide all of the links with the dcn class 
                    let dcnNodeList = document.getElementsByClassName('dcn');
                    for (let i = 0 ; i < dcnNodeList.length; i++ ) {
                        dcnNodeList[i].classList.add('hidden');
                    }

                    //show the no dcn warning
                    let nodeAlertList = document.getElementsByClassName('nodcn');
                    for (let i = 0 ; i < nodeAlertList.length; i++ ) {
                        nodeAlertList[i].classList.remove('hidden');
                    }
                }
                disableDCNLinks();

                //set VPN connection status 
                vpnConnectionStatus.innerHTML = 'Court Network Access: <strong>NO</strong>';
                connectedVPN = false;
            }

            //set default VPN connection status
            vpnConnectionStatus.innerHTML = 'Court Network Access: <strong>YES</strong>';
            connectedVPN = true;

            xhr.open("GET", url, true);
            xhr.setRequestHeader('Accept','application/html');
            //xhr.setRequestHeader('Accept','application/json;odata=verbose');

            // Sending our request 
            xhr.send();
        }

        function queryInternetConnection() {
            let inetConnectionStatus = document.getElementById('inet-connection-status');
            let isConnected = window.navigator.onLine;

            if (isConnected) {
                inetConnectionStatus.innerHTML = 'Internet Access: <strong>YES</strong>';
                connectedInternet = true;
            } else {
                inetConnectionStatus.innerHTML = 'Internet Access: <strong>NO</strong>';
                connectedInternet = false;

                //hide all of the links with the inet class 
                let dcnNodeList = document.getElementsByClassName('inet');
                for (let i = 0 ; i < dcnNodeList.length; i++ ) {
                    dcnNodeList[i].classList.remove('hidden');
                }

                //show the no internet warning
                let nodeAlertList = document.getElementsByClassName('nointernet');
                for (let i = 0 ; i < nodeAlertList.length; i++ ) {
                    nodeAlertList[i].classList.remove('hidden');
                }

            }

        }

        queryCourtNetworkConnection();
        //queryInternetConnection();

    }



    //function to select dark or lightmode
    function initColorScheme()  {
        const appTheme = document.getElementById('appTheme');

        //get colorScheme from local storage if one is set.
        let colorScheme = window.localStorage.getItem('ca10launcher::theme');
        if (!colorScheme) {
            colorScheme = 'zephyr';
        }

        switch (colorScheme) {
            case 'auto':
                if (window.matchMedia) {
                    //is dark mode
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        appTheme.setAttribute("href", "./css/slate.bootstrap.min.css");
                    } else
                        appTheme.setAttribute("href", "./css/zephyr.bootstrap.min.css");
                }
                break;
            default:
                appTheme.setAttribute("href", `./css/${colorScheme}.bootstrap.min.css`);                                                                
                break;
        }



    }

    function showBetaFeatures() {
        let isBetaMode = window.localStorage.getItem('ca10launcher::betamode');
        if (isBetaMode) {
            //show beta features
            let nodeAlertList = document.getElementsByClassName('beta');
            for (let i = 0 ; i < nodeAlertList.length; i++ ) {
                nodeAlertList[i].classList.remove('hidden');
            }
            
        }
    }

    //run app bootstrap
    initSearchSystem ();
    initSearchSelectionSystem();
    initConnectivitySystem();
    initColorScheme();
    getLinksList();
    showBetaFeatures();


})();