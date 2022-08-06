(function() {


    function getLinksList() {
        
        //get the table in the document that holds the links.
        const myLinksList = document.getElementById('myLinksList');
        //clear the table
        myLinksList.innerHTML = '';

        //get the updated link list from local storage
        let myLinksText = '';
        let myLinksJSON = window.localStorage.getItem('ca10launcher::mylinks');
        let myLinks = null;

        if (myLinksJSON) {
            myLinks = JSON.parse(myLinksJSON);
            //sort the array
            myLinks = myLinks.sort((a,b)=>a.title.localeCompare(b.title));
        } else {
            myLinks = new Array;
        }

        //loop through list and create the template
        myLinks.forEach(linkItem => {
            myLinksText += `<tr><td>${linkItem.title}</td><td>${linkItem.url}</td><td>${linkItem.network}</td><td><a data-title="${linkItem.title}" class="btn btn-secondary btn-link-delete">Delete</a></td></tr>`;
        });

       //update the table in the document
        myLinksList.innerHTML = myLinksText;

        //attach events to the new list of links.
        initMyLinksHandlers();
    }

    function initMyLinksHandlers() {
        //get the addsite button on the form
        let AddLinkForm = document.getElementById('addLinkForm');
        const linkButtons = document.querySelectorAll('.btn-link-delete');

        //add events to the delete links for each item
        linkButtons.forEach(btn => {

            btn.addEventListener('click', function(e) {
                const itmTitle = e.target.getAttribute('data-title');

                //get the current link list from local storage
                let myLinksJSON = window.localStorage.getItem('ca10launcher::mylinks');
                let myLinks = null;

                if (myLinksJSON) {
                    myLinks = JSON.parse(myLinksJSON);
                } else {
                    myLinks = new Array;
                }

                //renmove the item
                myLinks = myLinks.filter(itm => itm.title != itmTitle);

                //save the array back to local storage
                const tmpLinks = JSON.stringify(myLinks);
                window.localStorage.setItem('ca10launcher::mylinks', tmpLinks);

                //refresh list
                getLinksList();

            });
        });


        //attach an event handler for click to add new item to the list.
        //validate that all the fields are filled in
        AddLinkForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const title = document.getElementById('displayname');
            const url = document.getElementById('url');
            const networkselect = document.getElementById('network-select');

            //get the current link list from local storage
            let myLinksJSON = window.localStorage.getItem('ca10launcher::mylinks');
            let myLinks = null;

            if (myLinksJSON) {
                myLinks = JSON.parse(myLinksJSON);
            } else {
                myLinks = new Array;
            }

            //sort the array
            myLinks = myLinks.sort((a,b)=>a.title.localeCompare(b.title));

            //append new item to list
            if (title.value.length > 0) {
                myLinks.push({title:title.value, url:url.value, network:networkselect.value});

                //push json back into local storage
                let myLinksText = JSON.stringify(myLinks);
                window.localStorage.setItem('ca10launcher::mylinks', myLinksText);

                //update the screen
                getLinksList();
            }

            //reset the form fields
            title.value = '';
            url.value = '';
            networkselect.value = 'dcn';

        });
    }




    function betaModeSupport() {
        let betaButton = document.getElementById('initBetaMode');
        betaButton.addEventListener('click', function(e) {
            let isBetaMode = window.localStorage.getItem('ca10launcher::betamode');
            if (isBetaMode) {
                window.localStorage.removeItem('ca10launcher::betamode');
                //show beta features
                let nodeList = document.getElementsByClassName('beta');
                for (let i = 0 ; i < nodeList.length; i++ ) {
                    nodeList[i].classList.add('hidden');
                }
            } else {
                window.localStorage.setItem('ca10launcher::betamode','true');
                //show beta features
                let nodeList = document.getElementsByClassName('beta');
                for (let i = 0 ; i < nodeList.length; i++ ) {
                    nodeList[i].classList.remove('hidden');
                }
            }
        });

    }

    function initINetSearchSelection() {

        //listen for changes to the searchengine and store preference locally
        let sb = document.getElementById('inet-search-select');
        sb.addEventListener('change', function(e) {
            window.localStorage.setItem('ca10launcher::inet-search-engine', sb.value);
        });


        //get search-engine value from local storage and set search-select
        let enginePref = window.localStorage.getItem('ca10launcher::inet-search-engine');
        if (enginePref) {
            //console.log(enginePref);
        } else {
            enginePref = 'google';
        }

        let search = document.getElementById('inet-search-select');
        search.value = enginePref;

    }


    function initLauncherSelection() {

        //listen for changes to the searchengine and store preference locally
        let sb = document.getElementById('launcher-select');
        sb.addEventListener('change', function(e) {
            window.localStorage.setItem('ca10launcher::launcher', sb.value);
        });


        //get search-engine value from local storage and set search-select
        let launcherPref = window.localStorage.getItem('ca10launcher::launcher');
        if (launcherPref) {
            sb.value = launcherPref;
        } else {
            sb.value = 'spo';
        }

    }




     //function to select dark or lightmode
     function initColorScheme()  {
        const appTheme = document.getElementById('appTheme');
        let sb = document.getElementById('theme-select');


        //add the event listener
        sb.addEventListener('change', function(e) {
            window.localStorage.setItem('ca10launcher::theme', e.target.value);
            switch (e.target.value) {
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
                    console.log(e.target.value, appTheme);
                    appTheme.setAttribute("href", `./css/${e.target.value}.bootstrap.min.css`);                                                                
                    break;
            }
            });


        //get colorScheme from local storage if one is set.
        let colorScheme = window.localStorage.getItem('ca10launcher::theme');
        if (!colorScheme) {
            colorScheme = 'zephyr';
        }
        //set the selector on the color scheme
        sb.value = colorScheme;

        //set the appropriate css file
        switch (colorScheme) {
            case 'auto':
                if (window.matchMedia) {
                    //is dark mode
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        appTheme.setAttribute("href", "./css/slate.bootstrap.min.css");
                    } else {
                        appTheme.setAttribute("href", "./css/zephyr.bootstrap.min.css");
                    }
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
            let nodeList = document.getElementsByClassName('beta');
            for (let i = 0 ; i < nodeList.length; i++ ) {
                nodeList[i].classList.remove('hidden');
            }
            
        } 

        //run the support module to allow for toggkling of beta mode
        betaModeSupport();
    }


//run app bootstrap
initINetSearchSelection();
getLinksList();
initColorScheme();
initLauncherSelection();
showBetaFeatures();

})();