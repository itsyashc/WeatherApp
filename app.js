// to implement express :
const express = require("express");
const app = express();

// To make HTTPS request in node : {It's a native node module "in-built"} 
const https = require("https");

const bodyParser = require("body-parser");
const { json } = require("express/lib/response");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

let weatherIcon = "";
let iconImageURL = "";
let wTemp = "";
let location = "";
let weatherDes = "";
let wHumidity = "";
let wFeels = "";

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
    let options = {hour: "numeric", minute:"numeric"};
    let optionDate = {year:"numeric", month:"long", day:"numeric", weekday:"long"};
    let today = new Date();

    let currentTime = today.toLocaleTimeString("en-us", options);
    let currentDate = today.toLocaleDateString("en-us",optionDate);
    
    res.render("index", {cTime: currentTime, cDate: currentDate, weaIcon: iconImageURL, weaTempreature: wTemp, weaLocation: location, weaDescription: weatherDes, weaHumidity: wHumidity, weaFeels: wFeels});
});

app.post("/", function(req,res){
    //res.send("Server is running...") //we can only use one res.send because we can only sen response once to client.

 const query = req.body.cityName;
 const apiKey = "197755b8817ca4ac8193851611a529c5"
 const units = "metric"
 const url = "https://api.openweathermap.org/data/2.5/weather?appid="+ apiKey +"&q="+ query +"&units="+ units 
 
 https.get(url, function(response){
     console.log(response.statusCode);

     response.on("data", function(data){
         const weatherData = JSON.parse(data); //with this we change data from hxe to Json in a const

         weatherIcon = weatherData.weather[0].icon;//to get icon code
         iconImageURL = "http://openweathermap.org/img/wn/"+weatherIcon+"@2x.png";
         wTemp = weatherData.main.temp;
         location = weatherData.name;
         weatherDes = weatherData.weather[0].description;
         wHumidity = weatherData.main.humidity;
         wFeels = weatherData.main.feels_like; //with this we get a specific data from all the weather data like temp from main section

         res.redirect("/");
     })
 })
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000")
});