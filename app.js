( () => {
    const download = document.querySelector('#download');
    
    if( 'serviceWorker' in navigator ) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => console.log('Service worker registered'))
                .catch(err => 'SW registration failed')
        });
    }

    download.addEventListener('click', getDownload);

    if( queryUrl() != null ) {
        document.querySelector('#url').value = queryUrl();
    }

    function checkUrl() {
        let url = getValue();
        const expression = /(https:\/\/www\.instagram\.com\/p\/[a-zA-Z0-9_]*)/gm;
        let result = url.match(expression);
        if ( result )
            return result[0]
        else
            return null;
    }

    async function getDownload(){
        let data = await getJson();
        if ( data.graphql.shortcode_media.is_video ) {
            console.log(data.graphql.shortcode_media.video_url);
        } else {
            console.log(data.graphql.shortcode_media.display_url);
        }
    }

    async function getJson() {
        if ( checkUrl() != null ) {
            let link = checkUrl() + '/?__a=1';
            return await fetch(link).then(response => {
                return response.json();
            });
        } else {
            alert('URL is not valid');
        }
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