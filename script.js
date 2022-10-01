/* variable for search */
var city="";

var classes = ['0', '1', '2', '3', '4']

var inputEl = document.getElementById("city-name");
var citiesArr = []
var searchButton = document.getElementById('search-button');
var clearButton = document.getElementById('searchClear');
var currentCity = document.getElementById('cityCurrent');
var currentTemperature = document.getElementById("temperature");
var currentHumidty= document.getElementById("humidity");
var currentWSpeed= document.getElementById('windSpeed');
var searchHistoryEl = document.querySelector('#history-list');
var today = moment();

var cityStore=[];
const options = {
    method: 'GET',
  };
var APIKey="5f7a30057399336fce09fdf115bb9746";
/* show future weather */
function displayWeather(e){
    e.preventDefault();
    var city = inputEl.value
    createPastSearchBtn(city)
    getWeather(city)
    setItems()
}


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
       if(data.status == 200){
          cityStore=JSON.parse(localStorage.getItem("cityname"));
          console.log(cityStore);
          if (cityStore==null){
              cityStore=[];
              cityStore.push(city.toUpperCase()
              );
              localStorage.setItem("cityname",JSON.stringify(cityStore));
              addToList(city);
          }
          else {
              if(find(city)>0){
                  cityStore.push(city.toUpperCase());
                  localStorage.setItem("cityname",JSON.stringify(cityStore));
                  addToList(city);
              }
          }
       }

    });
}


/* give forecast for 5 days */
function forecast(cityid) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+ APIKey)
      .then(response => response.json())
      .then(function (data) {
            console.log(data)
            for(i=0; i < 5; i++){
            var tempId = document.getElementById('tempf'+ classes[i])
            var humidId = document.getElementById('humidityf'+ classes[i])
            var dateId = document.getElementById('datef'+ classes[i])
            var test =  document.getElementById('imgbox' + classes[i])
            var datalist = data.list[i*8]
            var date = datalist.dt_txt
            var img = document.getElementById("icon" + classes[i])
            var tempround = ((datalist.main.temp - 273.15)*9/5 + 32 ) 
            img.classList.add('image');
            img.src = ("src","https://openweathermap.org/img/wn/" + datalist.weather[0].icon + "@2x.png");
            test.appendChild(img);

            tempId.innerHTML =  "Temp: " + (Math.round(tempround))+ "&#176F";
            dateId.innerHTML = date
            humidId.innerHTML = "Humidity:" + datalist.main.humidity + "%"
            }
  });
}
function createPastSearchBtn(city) {
    var pastSearchBtn = document.createElement('button');
    // Update 'title' variable once this is officially created here based on the search input
    pastSearchBtn.textContent = city;
    pastSearchBtn.setAttribute('type', 'button');
    pastSearchBtn.classList.add('btn', 'button', 'btn-primary', 'mt-2', 'search-button');
    searchHistoryEl.append(pastSearchBtn);
    pastSearchBtn.addEventListener('click', searchHandlerPast);
    citiesArr.push(city)
    console.log(citiesArr)
  }
  function searchHandlerPast(event) {
    city = event.target.textContent;
    getWeather(city);
  }
  function setItems(event){
    localStorage.setItem('Cities', JSON.stringify(citiesArr));
};
var stored = JSON.parse(localStorage.getItem("Cities"));
    
function  renderLastRegistered(){
    for(let i=0; i <stored.length;  i++){
        city = stored[i]
        createPastSearchBtn(city)
    }
 
}

renderLastRegistered()

searchButton.addEventListener("click", displayWeather);

//$(window).on("load",getcitylast);
//$("#searchClear").on("click",searchClear(e));

