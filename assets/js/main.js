"use strict"

import { apiKey } from "./api.js";

const button = document.getElementById('button');
const cityNameInput = document.getElementById('cityNameInput');
const cityInfoOutput = document.body.querySelector('.cityInfoOutput');
const weatherInfo = document.body.querySelector('.weatherInfo');

const hour = document.querySelector('.hour');
const min = document.querySelector('.min');
const sec = document.querySelector('.sec');
const date = document.querySelector('.date');

const dayList = document.querySelectorAll('.dayList');


// # ================ General
dayList[0].classList = 'listSelected'
let cityName = 'Berlin';
cityLoction(cityName)



// # ================ ANALOG CLOCK
setInterval(() => {
    const myDate = new Date()
    const hourDeg = myDate.getHours()
    const minDeg = myDate.getMinutes()
    const secDeg = myDate.getSeconds()

    sec.style.transform = `rotateZ(${secDeg * 6}deg)`
    min.style.transform  = `rotateZ(${minDeg * 6}deg)`
    hour.style.transform  = `rotateZ(${hourDeg * 30 + minDeg * 6 / 12}deg)`

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


for (let i = 1; i < 6; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i);
    dayList[i].textContent = `${d.toDateString()}`
}


// # ================ WEATHER APP
button.addEventListener('click', () => {
    dayList.forEach(li => li.classList= 'dayList')
    dayList[0].classList = 'listSelected'
    if (cityNameInput.value == '') {
        return
    }else{
        cityName = cityNameInput.value;
    }
    cityLoction(cityName)
})

document.body.addEventListener('keypress', (event) => {
    if (event.key == 'Enter') {
        if (cityNameInput.value == '') {
            return
        }else{
            cityName = cityNameInput.value;
        }
        cityLoction(cityName)
    }
})

dayList.forEach(list => {
    list.addEventListener('click', (event) => {
        dayList.forEach(li => li.classList= 'dayList')
        event.target.classList = 'listSelected'
        let listValue = list.value
        if (listValue == -1) {
            cityLoction(cityName)
        }else{
            cityLoction2(cityName, listValue)
        }
    })
})


function cityLoction2(cityNamePara, listValue) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityNamePara},de&appid=${apiKey}`)
        .then(response => {
            return response.json()
        })
        .then(location => {
            cityInfoOutput.innerHTML =`
            <h1>Weather in ${location[0].name}</h1>
            <h3>${location[0].state} / ${location[0].country}</h3>
            `;
            const cityInfoPara = `http://api.openweathermap.org/data/2.5/forecast?lat=${location[0].lat}&lon=${location[0].lon}&cnt=5&appid=${apiKey}`
            cityInfo2(cityInfoPara, listValue)
        })
        .catch(error => console.log(error));
}


function cityLoction(cityNamePara) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityNamePara},de&appid=${apiKey}`)
        .then(response => {
            return response.json()
        })
        .then(location => {
            cityInfoOutput.innerHTML =`
            <h1>Weather in ${location[0].name}</h1>
            <h3>${location[0].state} / ${location[0].country}</h3>
            `;
            
            const cityInfoPara = `https://api.openweathermap.org/data/2.5/weather?lat=${location[0].lat}&lon=${location[0].lon}&appid=${apiKey}`
            cityInfo(cityInfoPara)
        })
        .catch(error => console.log(error));
}

function cityInfo(url){
    fetch(url)
            .then(response => {
                return response.json()
            })
            .then(data => {
                appOutput(data)
            })
            .catch(error => console.log(error));

}

function cityInfo2(url, listValue){
    fetch(url)
            .then(response => {
                return response.json()
            })
            .then(data => {
                appOutput2(data,listValue)
            })
            .catch(error => console.log(error));

}

function appOutput2(data, listValue){
    const temp = ((data.list[listValue].main.temp)-273.15).toFixed(1);
    const minTemp = ((data.list[listValue].main.temp_min)-273.15).toFixed(1);
    const maxTemp = ((data.list[listValue].main.temp_max)-273.15).toFixed(1);
    const description = data.list[listValue].weather[0].description;
    const humidity = data.list[listValue].main.humidity;
    const wind = data.list[listValue].wind.speed;
    if (description.indexOf('rain') != -1) {
        document.body.classList = 'rainy'
    }else if (description.indexOf('sky') != -1) {
        document.body.classList = 'sky'
    }else{
        document.body.classList = 'cloudy'
    }

    cityInfoOutput.innerHTML +=`<h1>${temp} °C</h1><p>min: ${minTemp} °C - max: ${maxTemp} °C</p>`
    weatherInfo.innerHTML = `
    <h1>${description}</h1>
    <p>Humidity: <strong>${humidity}%</strong></p>
    <p>Wind: <strong>${wind} m/s</strong></p>
    `
}

function appOutput(data){
    const temp = ((data.main.temp)-273.15).toFixed(1);
    const minTemp = ((data.main.temp_min)-273.15).toFixed(1);
    const maxTemp = ((data.main.temp_max)-273.15).toFixed(1);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    if (description.indexOf('rain') != -1) {
        document.body.classList = 'rainy'
    }else if (description.indexOf('sky') != -1) {
        document.body.classList = 'sky'
    }else{
        document.body.classList = 'cloudy'
    }

    cityInfoOutput.innerHTML +=`<h1>${temp} °C</h1><p>min: ${minTemp} °C - max: ${maxTemp} °C</p>`
    weatherInfo.innerHTML = `
    <h1>${description}</h1>
    <p>Humidity: <strong>${humidity}%</strong></p>
    <p>Wind: <strong>${wind} m/s</strong></p>
    `
}