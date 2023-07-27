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
let cityName = 'donzdorf';



// # ================ ANALOG CLOCK
setInterval(() => {
    const myDate = new Date()
    const hourDeg = myDate.getHours()* 30
    const minDeg = myDate.getMinutes()*6
    const secDeg = myDate.getSeconds()*6

    sec.style.transform = `rotateZ(${secDeg}deg)`
    min.style.transform  = `rotateZ(${minDeg}deg)`
    hour.style.transform  = `rotateZ(${hourDeg + minDeg/12}deg)`


    date.innerHTML = `
    <h1>${myDate.toDateString()}</h1>
    <h2>${myDate.getHours()} : ${myDate.getMinutes()} : ${myDate.getSeconds()}</h2>
    `

    
}, 1000)


for (let i = 1; i < 6; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i);
    dayList[i].textContent = `${d.toDateString()}`
}


// # ================ WEATHER APP




cityLoction(cityName)
button.addEventListener('click', () => {
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
        cityLoction2(cityName)
    })
})


// function cityLoction2(cityNamePara) {
//     fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityNamePara},de&appid=${apiKey}`)
//         .then(response => {
//             return response.json()
//         })
//         .then(location => {
//             cityInfoOutput.innerHTML =`
//             <h1>Weather in ${location[0].name}</h1>
//             <h3>${location[0].state} / ${location[0].country}</h3>
//             `;
//             const cityInfoPara = `https://pro.openweathermap.org/data/2.5/forecast/climate?lat=${location[0].lat}&lon=${location[0].lon}&cnt=5&appid=${apiKey}`
//             cityInfo(cityInfoPara)
//         })
//         .catch(error => console.log(error));
// }


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

function appOutput(data){
    const temp = ((data.main.temp)-273.15).toFixed(1);
    const minTemp = ((data.main.temp_min)-273.15).toFixed(1);
    const maxTemp = ((data.main.temp_max)-273.15).toFixed(1);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;

    if (description.indexOf('rain') != -1) {
        document.body.classList = 'rain'
    }else if (description.indexOf('sky') != -1) {
        document.body.classList = 'sky'
    }else{
        document.body.classList = 'cloudy'
    }

    cityInfoOutput.innerHTML +=`<h1>${temp} °C</h1><p>min: ${minTemp} °C - max: ${maxTemp} °C</p>`
    weatherInfo.innerHTML = `
    <p>${description}</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind: ${wind} m/s</p>
    `
}

// fetch(`http://api.openweathermap.org/geo/1.0/direct?q='donzdorf',de&appid=cb6290f61d4fa147d11cadfa50f8d548`)
//         .then(response => {
//             return response.json()
//         })
//         .then(location => {
//             console.log(location[0].lat);
//             console.log(location[0].lon);
//         })
//         .catch(error => console.log(error));

//         fetch('https://api.openweathermap.org/data/2.5/forecast/daily?lat=48.6856725&lon=9.8107595&cnt=5&appid=cb6290f61d4fa147d11cadfa50f8d548')
//         .then(response => {
//             return response.json()
//         })
//         .then(data => {
//             console.log(data);
//         })
//         .catch(error => console.log(error));