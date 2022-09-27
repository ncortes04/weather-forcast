/* variable for search */
var city="";

var searchCity = $('#search-city');
var searchButton = $('#search-button');
var clearButton = $('#searchClear');
var currentCity = $('#cityCurrent');
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$('#windSpeed');
var cityStore=[];

var APIKey="5f7a30057399336fce09fdf115bb9746";
/* show future weather */
function displayWeather(e){
    e.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        getWeather(city);
    }
}
/* making an ajax call */
function getWeather(city){
/* api url  */


    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        /* call response to display array of temp humidity ect */
        console.log(response);
        /* grabs icon from api array */
        var weathericon = response.weather[0].icon;
        var iconurl ="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        /* used date format from mdn web docs insted of moment.js since this was simpler */
        var date=new Date(response.dt*1000).toLocaleDateString();
        //parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");
        /* temp displays in kelvin so i converted it into fahrenheit */
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        /* get the humidity and displays*/
        $(currentHumidty).html(response.main.humidity+"%");
      /* convert wind from meters per secoond to mph and display in HTML */
        var wind=response.wind.speed;
        var windsmph=( wind*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+"MPH");
 
        forecast(response.id);
        if(response.cod==200){
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
/* clears last searched */
function searchClear(e){
    e.preventDefault();
    cityStore=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}
/* adds city to the recently searched */
function addToList(city){
    var listEl= $("<li>"+city+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",city);
    $(".list-group").append(listEl);
}
/* render last searched items */
function getcitylast(){
    $("ul").empty();
    var cityStore = JSON.parse(localStorage.getItem("cityname"));
    if(cityStore!==null){
        cityStore=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<cityStore.length;i++){
            addToList(cityStore[i]);
        }
        city=cityStore[i-1];
        getWeather(city);
    }

}
/* give forecast for 5 days */
function forecast(cityid){
    var dayover= false;
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#datef"+i).html(date);
            $("#imgf"+i).html("<img src="+iconurl+">");
            $("#tempf"+i).html(tempF+"&#8457");
            $("#humidityf"+i).html(humidity+"%");
        }
        
    });
}




/* click ahndlers for buttons*/
$("#search-button").on("click",displayWeather);

$(window).on("load",getcitylast);
$("#searchClear").on("click",searchClear(e));

