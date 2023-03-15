const mainContent = document.querySelector('.main-container');
const content = document.querySelector('.container');
const loader = document.querySelector('.loading');
const url = new URL(window.location);

//To restore page 
const restorePage = () => {
    url.searchParams.set('city' , 'bangalore');
    window.history.replaceState({} , "" , url);
    window.location.reload();
}

// To get icon 
const getIcon = (id) => {
    if(id === '01d' || id === '01n') return 'sun-fill';
    if(id === '02d' || id === '02n') return 'cloud-sun-fill';
    if(id === '03d' || id === '03n') return 'cloudy-fill';
    if(id === '04d' || id === '04n') return 'clouds-fill';
    if(id === '09d' || id === '09n') return 'cloud-drizzle-fill';
    if(id === '10d' || id === '10n') return 'cloud-rain-heavy-fill';
    if(id === '11d' || id === '11n') return 'cloud-lightning-rain-fill';
    if(id === '13d' || id === '13n') return 'cloud-snow-fill';
    if(id === '50d' || id === '50n') return 'cloud-haze-fill';
}

// To get current location 
const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        url.searchParams.delete('city');
        url.searchParams.set('lat' , position.coords.latitude);
        url.searchParams.set('lon' , position.coords.longitude);
        window.history.pushState({} , "" , url);
        window.location.reload();
    })
}

// To get required data 
const getData = () => {
    loader.style.display = "block";
    const city = url.searchParams.get('city');
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    if(city) {
        fetchData(`q=${city}`);
    }
    else if(lat&&lon) {
        fetchData(`lat=${lat}&lon=${lon}`);
    }
    else {
        url.searchParams.set('city' , 'bangalore');
        fetchData(`q=bangalore`);
    }
}

// To make GET request 
const fetchData = async (para) => {
    const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?${para}&APPID=${API_KEY}`);
    const data = await res.json();
    layoutData(data);
}

// Convert kelvin to celcius 
const ktoc = (val) => {
    return Math.ceil(val - 273.15);
}

// To layout data on page 
const layoutData = async (data) => {

    // To check server response 
    if(data.cod !== 200) {
        loader.insertAdjacentHTML('afterbegin' , `<div class="close-btn" onclick={restorePage()}><span><i class="bi bi-x"></i></span></div>`);
        loader.childNodes[2].innerHTML = `<span>${data.message}</span>`;
        return;
    }

    // layout 
    mainContent.insertAdjacentHTML('beforeend' , `<div class="sub-container text-white">
    <div class="content-block display-inline">
        <div class="block">
            <span>${ktoc(data.main.temp)}</span>
            <span> <sup>o</sup>C</span>
        </div>
        <div class="block">
            <span><i class="bi bi-${getIcon(data.weather[0].icon)}"></i></span>
        </div>
    </div>
    <div class="content-block">
        <div>
            <span>${data.name}</span>
        </div>
        <div>
            <span>${data.weather[0].description}</span>
        </div>
        <div>
            <span>Feels like </span>
            <span>${ktoc(data.main.feels_like)} <sup>o</sup>C</span>
        </div>
    </div>
</div>`)

    content.insertAdjacentHTML('beforeend', `<div class="content-block">
<div>
    <span>${data.main.humidity}</span>
    <span> %</span>
</div>
<div>
    <span>${data.main.pressure}</span>
    <span> mBar</span>
</div>
<div>
    <span>${ktoc(data.main.temp_max)}</span>
    <span> <sup>o</sup>C</span>
</div>
<div>
    <span>${ktoc(data.main.temp_min)}</span>
    <span> <sup>o</sup>C</span>
</div>
<div>
    <span>${data.wind.speed}</span>
    <span> Km/h</span>
</div>
</div>`);

// Delay of .5s 
setTimeout(() => loader.style.display = "none" , 500);

}

// Function call to initiate
getData();