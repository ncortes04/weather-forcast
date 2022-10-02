/* variable for search */
var classes = ['0', '1', '2', '3', '4']

/* gets elements by ID */
var inputEl = document.getElementById("city-name");
var citiesArr = []
var searchButton = document.getElementById('search-button');
var clearButton = document.getElementById('searchClear');
var currentCity = document.getElementById('cityCurrent');
var currentTemperature = document.getElementById("temperature");
var currentHumidty= document.getElementById("humidity");
var currentWSpeed= document.getElementById('windSpeed');
var searchHistoryEl = document.getElementById('history-list');
var clearHistory = document.getElementById('clearHistory')
var today = moment();

var cityStore=[];
const options = {
    method: 'GET',
  };
var APIKey="5f7a30057399336fce09fdf115bb9746";

/* runs mutiple functions with the city parameter which starts all the functions */
function displayWeather(e){
    e.preventDefault();
    var city = inputEl.value
    createPastSearchBtn(city)
    getWeather(city)
    setItems()
}

/* gets the weather displayed in the box with a fetch call*/
function getWeather(city){
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&APPID=" + APIKey, options) 
        .then(data => data.json())
        .then(function(data){
  
        /* call response to display array of temp humidity ect */
        console.log(data);
        var tempround = ((data.main.temp - 273.15)*9/5 + 32 )
        currentTemperature.innerHTML = (Math.round(tempround)) + "&#176F"
        /* get the humidity and displays*/
       currentHumidty.innerHTML = (data.main.humidity + "%");
      /* convert wind from meters per secoond to mph and display in HTML */
       currentWSpeed.innerHTML = (data.wind.speed * 2.237 + "mph")
       currentCity.innerHTML = data.name + (today.format(" (MM/DD/YYYY)"))
       forecast(data.id);
    });
}


/* give forecast for 5 days */
function forecast(cityid) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+ APIKey)
      .then(response => response.json())
     //grabs rtesponse as data and used as a parameter in function
      .then(function (data) {
            console.log(data)
            for(i=0; i < 5; i++){
            /* variables that grav each id i created on the html and uses a for loop to loop though each day */
            var tempId = document.getElementById('tempf'+ classes[i])
            var humidId = document.getElementById('humidityf'+ classes[i])
            var dateId = document.getElementById('datef'+ classes[i])
            var test =  document.getElementById('imgbox' + classes[i])
            /* each day for weather is stored in an object called list and every 8 index's a new day is documented */
            var datalist = data.list[i*8]
            /* shows the date for the weather */
            var date = datalist.dt_txt
            /* grabs image from the data list */
            var img = document.getElementById("icon" + classes[i])
            var tempround = ((datalist.main.temp - 273.15)*9/5 + 32 ) 
            /* adds class to the image */
            img.classList.add('image');
            img.src = ("src","https://openweathermap.org/img/wn/" + datalist.weather[0].icon + "@2x.png");
            test.appendChild(img);
            /* shows temp and humidity */
            tempId.innerHTML =  "Temp: " + (Math.round(tempround))+ "&#176F";
            dateId.innerHTML = date
            humidId.innerHTML = "Humidity:" + datalist.main.humidity + "%"
            }
  });
}
/* creates button with city parameter which is later used by mutiple functions*/
function createPastSearchBtn(city) {
    var pastSearchBtn = document.createElement('button');
    pastSearchBtn.textContent = city;
    pastSearchBtn.setAttribute('type', 'button');
    pastSearchBtn.classList.add('btn', 'button', 'btn-primary', 'mt-2', 'search-button');
    searchHistoryEl.append(pastSearchBtn);
    pastSearchBtn.addEventListener('click', searchHandlerPast);
    /* if the used does not input nothing then run the push. Otherwise use can push empty space
    into the array which created an empty button */
   if(inputEl.value !== ''){
    citiesArr.push(city)
   }
  }
  /* created button which grabs the texct content of that set button and runs as a parameter for get weather */
  function searchHandlerPast(event) {
    city = event.target.textContent;
    getWeather(city);
  }
  /* function to set items which is called with the search button */
  function setItems(){
    /* setting items as in json and converts to a string so it can be accessed as an array */
    localStorage.setItem('Cities', JSON.stringify(citiesArr));
};
/* returns a string for the values associated with the key Cities*/
var stored = JSON.parse(localStorage.getItem("Cities"));

/* grabs the stored cities and creats buttons wiht thema nd pushes them into the citiesArr array.
this is so when the used refreshes they cannot reset the value of the cities localstorage */
function  renderLastRegistered(){
    for(let i=0; i <stored.length;  i++){
        city = stored[i]
        citiesArr.push(city)
        createPastSearchBtn(city)
    }
 
}
/* this is necessary because if the local storage is empty it throws an erorr when running the command.
i made ths if statement from preventing this to happen */
if(stored !== null){
    renderLastRegistered()
}
/* clears local storage */
function removoveCities(){
localStorage.removeItem("Cities")
}
clearHistory.addEventListener("click", removoveCities)
searchButton.addEventListener("click", displayWeather);

