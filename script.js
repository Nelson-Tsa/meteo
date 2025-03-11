const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-button');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');

const forecastItemsContainer = document.querySelector('.forecast-items-container');

const apiKey = 'c718abf5c74fba6ef3b3c507ccf4af9b';


searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = '';
        cityInput.blur();

    }
})

cityInput.addEventListener('keyup', (e) => {
    if(e.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = '';
        cityInput.blur();
    }
})

async function getFetchData (endpoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
    const response = await fetch(apiUrl);
    return response.json();
}

function getWeaatherIcon(id) {
    if(id <= 232) return 'thunderstorm.svg';
    if(id <= 321) return 'drizzle.svg';
    if(id <= 531) return 'rain.svg';
    if(id <= 622) return 'snow.svg';
    if(id <= 781) return 'atmosphere.svg';
    if(id == 800) return 'clear.svg';
    else return 'clouds.svg';
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
    }
    return currentDate.toLocaleDateString('fr-FR', options);
    }

async function updateWeatherInfo(city) {
const wheatherData = await getFetchData('weather', city);

if(wheatherData.cod != 200){
    showDisplaySection(notFoundSection);
    return
}
showDisplaySection(weatherInfoSection);
// console.log(wheatherData);
const {
    name : country, 
    main : {temp, humidity},
    weather : [{id, description}],
    wind : { speed },
} = wheatherData;

countryTxt.textContent = country;
tempTxt.textContent = Math.round(temp) + '°C';
conditionTxt.textContent = description;
humidityValueTxt.textContent = humidity + '%';
windValueTxt.textContent = speed + 'km/h'; 

currentDateTxt.textContent = new Date().toLocaleDateString('fr');
currentDateTxt.textContent = getCurrentDate();
weatherSummaryImg.src = `./assets/weather/${getWeaatherIcon(id)}`;

await updateForecastInfo(city);
}

async function updateForecastInfo(city) {
    const forecastData = await getFetchData('forecast', city);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = '';
    forecastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItem(forecastWeather);
        }
        // console.log(forecastData); 
    })
    
}

function updateForecastItem(weatherData) {
const {
    dt_txt : date,
    weather : [{id}],
    main : {temp},
}= weatherData;

const dateTaken = new Date(date);
const dateOptions = {
    day: '2-digit',
    month: 'short',

}
const dateResult = dateTaken.toLocaleDateString('fr-FR', dateOptions);

const forecastItem = `
            <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeaatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
            </div>
        `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);


}

function showDisplaySection(section) {
[weatherInfoSection, searchCitySection, notFoundSection].forEach(section =>section.style.display = 'none')

section.style.display = 'flex';
}