( () => {
    const download = document.querySelector('#download');
    const hasil = document.querySelector('#hasil');

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
        hasil.style.display = 'none';
        return await getJson().then(data => {
            if ( data != null ) {
                hasil.innerHTML = "";
                hasil.style.display = 'block';
                if (data.graphql.shortcode_media.is_video) {
                    let html = createButton(data.graphql.shortcode_media.video_url);
                    hasil.innerHTML = html;
                } else {
                    let html = createButton(data.graphql.shortcode_media.display_url);
                    hasil.innerHTML = html;
                }
            }
        });
    }

    async function getJson() {
        if ( checkUrl() != null ) {
            let link = checkUrl() + '/?__a=1';
            return await fetch(link).then(response => {
                return response.json();
            });
        } else {
            alert('URL is not valid');
            return null;
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

    function createButton(hasil) {
        let html = `<a href="${hasil}" target="_blank" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"><svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg><span>Download</span></a>`;
        return html
    }
})();