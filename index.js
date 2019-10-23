NASA_apiKey = 'fVdyFifJQ5EW8GNgZfe6wZRIrGxIF23gePQIsltC'
Youtube_apiKey = 'AIzaSyAvVMyc7xMckEifggvX6O3GXzr7DLxTe-w'
youtubeSearchURL = 'https://www.googleapis.com/youtube/v3/search'
NASASearchURL = 'https://images-api.nasa.gov/search'
NASADateURL = 'https://api.nasa.gov/planetary/apod'

// first set of JS will be for the search bar 
// here is the 1st set
function searchSubmit() {
    $('#searchSubmit').on('click', function(s) {
        console.log('searchSubmit ran!')
        s.preventDefault();
        let search = $('#searchInput').val();
        console.log(search)
        getSpaceSearchNASAApi(search);
        getSpaceSearchYoutubeApi(search);
        $('#NASAResults').empty();
        $('#youtubeSearchVideos').empty();
        $('#dateNASA').empty();
        $('#dateYoutube').empty();
    })
}
 

function formatSearchQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
return queryItems.join('&');
}


function getSpaceSearchNASAApi(search) {
    const params = {
        q: search,
        media_type: "image",

    }
    const queryString = formatSearchQueryParams(params)
    const searchURL = NASASearchURL + '?' + queryString;

    fetch(searchURL) 
        .then(response =>{
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseSpaceSearchJson => displaySpaceSearchResult(responseSpaceSearchJson))
        .catch(err => $('.badResult').append(`Something went wrong: ${err.message}`))
}


function getSpaceSearchYoutubeApi(search) {
    const params = {
        key: Youtube_apiKey,
        q: search,
        part: 'snippet',
        };
      const queryString = formatSearchQueryParams(params)
      const url = youtubeSearchURL + '?' + queryString;
        
      
      fetch(url, {mode: 'cors'})
        .then(response => {
            if (response.ok) {
                return response.json();
            } 
            throw new Error(response.statusText);
        })
        .then(responseYoutubeJson => displayYoutubeSearchResults(responseYoutubeJson))
        .catch(err => $('.badResult').append(`Something went wrong: ${err.message}`));
      
}


function displaySpaceSearchResult(responseSpaceSearchJson) {
    $('.searchResults').removeClass('hidden');
    for (i=0; i < 10; i++) {
        let picture = responseSpaceSearchJson.collection.items[i].links[0].href
         $('#NASAResults').append(`
         <li><img src="${picture}" alt="space picture results" class="spaceImages"></li>
         `) 
    }
}


function displayYoutubeSearchResults(responseYoutubeJson) {
    for (let i=0; i < responseYoutubeJson.items.length; i++) {
        let youtubeSearch = responseYoutubeJson.items[i].id.videoId;
        $('#youtubeSearchVideos').append( 
            `<li>
                <p class="title">${responseYoutubeJson.items[i].snippet.title}</p>
                <iframe src="https://www.youtube.com/embed/${youtubeSearch}"/>
            </li>`
        )
    }
}


// here is the 2nd set
function dateSubmit() {
    $('#dateSubmit').on('click', function(d) {
        console.log('dateSubmit ran!')
        d.preventDefault();
        let date = $('#dateInput').val();
        getSpaceDate(date);
        $('#NASAResults').empty();
        $('#youtubeSearchVideos').empty();
        $('#dateNASA').empty();
        $('#dateYoutube').empty();
    })
}


function formatDateQueryParams(parameters) {
    const queryItems = Object.keys(parameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
    return queryItems.join('&');
}


function getSpaceDate(date) {
    const parameters = {
        api_key: NASA_apiKey,
        date: date     
    }

    const queryString = formatDateQueryParams(parameters)
    const url = NASADateURL + '?' + queryString;


    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        } 
        throw new Error(response.statusText);
    })
    .then(responseNASADateJson => {
        displayDateResults(responseNASADateJson)
        getYoutubeDateResults(responseNASADateJson)
    }
        )
    .catch(err => $('.badResult').append(`Something went wrong: ${err.message}`));

    
}


function getYoutubeDateResults(responseNASADateJson) {
    let dateYoutubeVideo = responseNASADateJson.title;
    const parameters = {
        key: Youtube_apiKey,
        q: dateYoutubeVideo,
        part: 'snippet',
    }


    const queryString = formatDateQueryParams(parameters)
    const youtubeURL = youtubeSearchURL + '?' + queryString;

    fetch(youtubeURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.StatusText)
        })
        .then(responseYoutubeDateResults => displayYoutubeDateResults(responseYoutubeDateResults))
        .catch(err => $('.badResult').append(`Something went wrong: ${err.message}`))
}

function displayDateResults(responseNASADateJson) {
    console.log(responseNASADateJson)
    let pictureDate = responseNASADateJson.url
    $('.dateResults').removeClass('hidden');
    if (pictureDate.includes('youtube')) {
        $('#dateNASA').append(`
        <iframe src='${pictureDate}' alt="Video from date entered" class="dateImage"/>
        <p class="dateDescription">${responseNASADateJson.explanation}</p>`)
    } else {
    $('#dateNASA').append(`
    <img src='${pictureDate}' alt="Image from date entered" class="dateImage">
    <p class="dateDescription">${responseNASADateJson.explanation}</p>
    `)
    }

}


function displayYoutubeDateResults(responseYoutubeDateResults) {
    $('#dateYoutube').html(`<ul class="youtubeVideos" id="youtubeDateVideos"></ul>`)
    for (let i=0; i < responseYoutubeDateResults.items.length; i++) {
        let youtubeDate = responseYoutubeDateResults.items[i].id.videoId
        $('#dateYoutube').append( 
            `<li>
            <p class="title">${responseYoutubeDateResults.items[i].snippet.title}</p>
            <iframe src="https://www.youtube.com/embed/${youtubeDate}"/>
            </li>`
        )
    }
}

// end of the sets


$(function() {
    console.log('Looks like you are ready to explore space!')
    searchSubmit();
    dateSubmit();
})

