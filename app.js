( () => {
    const download = document.querySelector('#download');
    
    if( 'serviceWorker' in navigator ) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => console.log('Service worker registered'))
                .catch(err => 'SW registration failed')
        });
    }

    download.addEventListener('click', getJson);

    if( queryUrl() != null ) {
        document.querySelector('#url').value = queryUrl();
    }

    async function getJson() {
        let url = getValue() ;
        return fetch(url).then(response => {
            console.log(response);
            return response;
        });
    }

    function getValue(){
        let urlValue = document.querySelector('#url').value;
        return urlValue; 
    }

    function queryUrl(){
        let urlParams = new URLSearchParams(window.location.search);

        if( urlParams.has('url') )
            return urlParams.get('url');
        else 
            return null;
    }
})();