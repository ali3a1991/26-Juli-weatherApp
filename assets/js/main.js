"use strict"

// # =============================================== IMPORT
import { apiKey } from "./api.js";

// # ========================================== DECLARATION
const button = document.getElementById('button');
const cityNameInput = document.getElementById('cityNameInput');
const cityInfoOutput = document.body.querySelector('.cityInfoOutput');
const weatherInfo = document.body.querySelector('.weatherInfo');

const hourHand = document.querySelector('.hour-hand');
const minHand = document.querySelector('.min-hand');
const secHand = document.querySelector('.sec-hand');
const date = document.querySelector('.date');

const dayList = document.querySelectorAll('.dayList');

// # ================================== ANALOG CLOCK & DATE
setInterval(() => {
    const myDate = new Date()
    const hourDeg = myDate.getHours()
    const minDeg = myDate.getMinutes()
    const secDeg = myDate.getSeconds()

    secHand.style.transform = `rotateZ(${secDeg * 6}deg)`
    minHand.style.transform  = `rotateZ(${minDeg * 6}deg)`
    hourHand.style.transform  = `rotateZ(${hourDeg * 30 + minDeg * 6 / 12}deg)`

    let minutes;
    let seconds;
    let hours;

    if (myDate.getSeconds() < 10) {
        seconds = `0${myDate.getSeconds()}`
    }else{
        seconds = `${myDate.getSeconds()}`
    }

    if (myDate.getMinutes() < 10) {
        minutes = `0${myDate.getMinutes()}`
    }else{
        minutes = `${myDate.getMinutes()}`
    }

    if (myDate.getHours() < 10) {
        hours = `0${myDate.getHours()}`
    }else{
        hours = `${myDate.getHours()}`
    }
    date.innerHTML = `
    <h1>${myDate.toDateString()}</h1>
    <h2>${hours} : ${minutes} : ${seconds}</h2>
    `
}, 1000)

// # ========================================== WEATHER APP

// =========================================== Default Data
dayList[0].classList = 'listSelected'
let cityName = 'Berlin';
let geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},de&appid=${apiKey}`
cityLoction()

// =========================================== Coming Days
for (let i = 1; i < 6; i++) {
    const nowDate = new Date()
    nowDate.setDate(nowDate.getDate() + i);
    dayList[i].textContent = `${nowDate.toDateString()}`
}

dayList.forEach(list => {
    list.addEventListener('click', (event) => {
        dayList.forEach(li => li.classList= 'dayList');
        event.target.classList = 'listSelected';
        let listValue = list.value;

        if (listValue == -1) {
            cityLoction();
        }else{
            cityLoction(listValue);
        }
    })
})

// =========================================== Event Listener
button.addEventListener('click', () => {
    dayList.forEach(li => li.classList= 'dayList');
    dayList[0].classList = 'listSelected';

    if (cityNameInput.value == '') {
        return
    }else{
        cityName = cityNameInput.value;
    }
    geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},de&appid=${apiKey}`
    cityLoction();
})

document.body.addEventListener('keypress', (event) => {
    if (event.key == 'Enter') {
        if (cityNameInput.value == '') {
            return
        }else{
            dayList.forEach(li => li.classList= 'dayList')
        }

        dayList[0].classList = 'listSelected'
        cityName = cityNameInput.value;
        geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},de&appid=${apiKey}`

        cityLoction(geoApiUrl)
    }
})

// =========================================== Functions
function cityLoction(listValue) {
    fetch(geoApiUrl)
        .then(response => {
            return response.json();
        })
        .then(location => {
            let weatherApiUrl;

            cityInfoOutput.innerHTML =`
            <h1>Weather in ${location[0].name}</h1>
            <h3>${location[0].state} / ${location[0].country}</h3>
            `;

            if (listValue == undefined) {
                weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location[0].lat}&lon=${location[0].lon}&appid=${apiKey}`;
                cityInfo(weatherApiUrl);
            }else{
                weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${location[0].lat}&lon=${location[0].lon}&cnt=5&appid=${apiKey}`;
                cityInfo(weatherApiUrl, listValue);
            }
        })
        .catch(error => console.log(error));
}

function cityInfo(weatherApiUrl, listValue){
    fetch(weatherApiUrl)
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (listValue == undefined) {
                appOutput(data)
            }else{
                appOutput(data,listValue)
            }
        })
        .catch(error => console.log(error));
}

function appOutput(data, listValue){
    let temp;
    let minTemp;
    let maxTemp;
    let description;
    let humidity;
    let wind;

    if (listValue == undefined) {
        temp = ((data.main.temp)-273.15).toFixed(1);
        minTemp = ((data.main.temp_min)-273.15).toFixed(1);
        maxTemp = ((data.main.temp_max)-273.15).toFixed(1);
        description = data.weather[0].description;
        humidity = data.main.humidity;
        wind = data.wind.speed;
    }else{
        temp = ((data.list[listValue].main.temp)-273.15).toFixed(1);
        minTemp = ((data.list[listValue].main.temp_min)-273.15).toFixed(1);
        maxTemp = ((data.list[listValue].main.temp_max)-273.15).toFixed(1);
        description = data.list[listValue].weather[0].description;
        humidity = data.list[listValue].main.humidity;
        wind = data.list[listValue].wind.speed;
    }

    changeBackgroundImage(description);

    cityInfoOutput.innerHTML +=`<h1>${temp} °C</h1><p>min: ${minTemp} °C - max: ${maxTemp} °C</p>`
    weatherInfo.innerHTML = `
    <h1>${description}</h1>
    <p>Humidity: <strong>${humidity}%</strong></p>
    <p>Wind: <strong>${wind} m/s</strong></p>
    `
}

function changeBackgroundImage(description) {
    if (description.indexOf('rain') != -1) {
        document.body.classList = 'rainy'
    }else if (description.indexOf('sky') != -1) {
        document.body.classList = 'sky'
    }else{
        document.body.classList = 'cloudy'
    }
}
