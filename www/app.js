( () => {
    const download = document.querySelector('#download');
    const hasil = document.querySelector('#hasil');

    if( 'serviceWorker' in navigator ) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => console.log('Service worker registered'))
                .catch(err => 'SW registration failed');
        });
    }

    download.addEventListener('click', getDownload);

    if( queryUrl() != null ) {
        document.querySelector('#url').value = queryUrl();
    }

    function checkUrl() {
        let url = getValue();
        const expression = /(https:\/\/www\.instagram\.com\/p\/[a-zA-Z0-9\_\-]*)/gm;
        let result = url.match(expression);
        if ( result )
            return result[0];
        else
            return null;
    }

    async function getDownload(){
        hasil.style.display = 'none';
        return await getJson().then(data => {
            if ( data != null ) {
                hasil.innerHTML = "";
                hasil.style.display = 'block';
                if ( data.graphql.shortcode_media.owner.is_private ) {
                    alert('Account is private. We can not download the media');
                    return null;
                }

                if ( data.graphql.shortcode_media.__typename == 'GraphImage' ) { // Image
                    let html = createButton(data.graphql.shortcode_media.display_url);
                    hasil.innerHTML = html;
                } else if ( data.graphql.shortcode_media.__typename == 'GraphSidecar' ) { // Slide
                    let sidecar = data.graphql.shortcode_media.edge_sidecar_to_children;
                    let html = '';
                    Object.keys(sidecar).forEach( element => {
                        let tmp = sidecar[element];
                        Object.keys(tmp).forEach( (key) => {
                            let temp = tmp[key];
                            if( temp.node.__typename == 'GraphImage' ) {
                                html += createButton(temp.node.display_url);
                            } else if( temp.node.__typename == 'GraphVideo' ) {
                                html += createButton(temp.node.video_url, temp.node.display_url);
                            }
                        });
                    });
                    hasil.innerHTML = html;
                } else if ( data.graphql.shortcode_media.__typename == 'GraphVideo' ) { //Video
                    let html = createButton(data.graphql.shortcode_media.video_url, data.graphql.shortcode_media.display_url );
                    hasil.innerHTML = html;
                } else {
                    alert('Please contact admin. This application needs to be fixed.');
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

    function createButton(hasil, thumb = null ) {
        let html = '';
        let filename = getFilename(hasil);
        if ( thumb == null ) {
            html = `<div class="py-3"> <div class="bg-gray-400"><img src="${hasil}" class="object-contain h-48 w-full"></div><div class="py-2"><a href="${hasil}" target="_blank" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" download="${filename}"><svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg><span>Download</span></a></div></div>`;
        } else {
            html = `<div class="py-3"> <div class="bg-gray-400"><img src="${thumb}" class="object-contain h-48 w-full"></div><div class="py-2"><a href="${hasil}" target="_blank" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" download="${filename}"><svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg><span>Download</span></a></div></div>`;
        }
        return html;
    }

    function getFilename(uri) {
        let url = uri.split("?")
        url = url[0];
        url = url.split("/");
        let filename = url[url.length - 1];
        return filename;
    }
})();