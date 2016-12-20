/**
 * Created by Harry on 12/5/16.
 */

$(document).ready(function () {
    "use strict";

    // $.get("http://api.openweathermap.org/data/2.5/weather", {
    //     APPID: "b4197e496c4b73186de7934cf48d40d6",
    //     id:     4726206,
    //     units: "imperial"
    // }).done(function(data) {
    //     console.log(data);
    // });
    //
    // var getCurrTemp = function (data) {
    //     return (Math.round(data.main.temp));
    // };

    var setCityNameFromResponse = function (data) {
        $("#current-city").html(data.city.name);
    };

    var weatherArray = [];
    var setForecast = document.getElementsByClassName("forecast");

    var getMaxTemp = function (data) {
        return (Math.round(data.temp.max));
    };
    var getMinTemp = function (data) {
        return (Math.round(data.temp.min));
    };
    var getHumidity = function (data) {
        return data.humidity;
    };
    var getWind = function (data) {
        return data.speed;
    };
    var getPressure = function (data) {
        return data.pressure;
    };
    var getIcon = function (data) {
        return data.weather[0].icon;
    };
    var getDescription = function (data) {
        return data.weather[0].description;
    };
    var getLat = function (data) {
        return data.city.coord.lat;
    };
    var getLong = function (data) {
        return data.city.coord.lon;
    };


    var buildHTML = function(object) {
        return '<tr><td><strong>' + object.day.format("dddd") + ', ' + object.day.format("LL") + '</strong></td><td>' +
            object.maxTemp + '</td><td>' + object.minTemp + '</td><td>' +
            '<img src="http://openweathermap.org/img/w/' + object.icon + '.png"' +
            '</td><td>' + object.description + '</td><td>' + object.humidity + '%</td><td>' +
            object.wind + ' mph</td><td>' + object.pressure + ' hPa</td></tr>'
    };

    var renderWeather = function (data) {
        setCityNameFromResponse(data);
        // console.log("Got weather data");
        weatherArray = [];
        var mainTable = '';
        data.list.forEach(function (object) {
            var weatherData = {
                // currTemp: getCurrTemp(object),
                maxTemp: getMaxTemp(object),
                minTemp: getMinTemp(object),
                humidity: getHumidity(object),
                wind: getWind(object),
                pressure: getPressure(object),
                icon: getIcon(object),
                description: getDescription(object),
                // get Momentjs.com date data
                day: moment.unix(object.dt)
            };
            weatherArray.push(weatherData);

        });

        weatherArray.forEach(function (object) {
            mainTable += buildHTML(object);
        });

        $('#weather-report').html(mainTable);

        // change map coordinates
        var coordinates = {
            lat: getLat(data),
            long: getLong(data)
        };

    };
    var getWeatherRequest = function (lat, lon) {
        $.get("http://api.openweathermap.org/data/2.5/forecast/daily", {
            APPID: "b4197e496c4b73186de7934cf48d40d6",
            // id: 4726206,
            lat: lat,
            lon: lon,
            units: "imperial",
            cnt: 7
        }).done(function (data) {
            renderWeather(data);
        });
    };
    getWeatherRequest(29.42412, -98.493629);

    $("#new-coordinates").click(function () {
        var newLat = document.getElementById("latitude").value;
        var newLong = document.getElementById("longitude").value;
        getWeatherRequest(newLat, newLong);
    });

    // Generate the Google Map, centered on San Antonio
    var myLatlng = new google.maps.LatLng(29.42412,-98.493629);
    var mapOptions = {
        zoom: 10,
        center: myLatlng
    };

    // Render the map
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    // Place a draggable marker on the map
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable:true,
        title:"Drag me!"
    });

    //Add listener
    google.maps.event.addListener(marker, "dragend", function (event) {
        var googleLatitude = this.position.lat();
        var googleLongitude = this.position.lng();
        getWeatherRequest(googleLatitude, googleLongitude);
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var marker = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        marker.forEach(function(marker) {
            marker.setMap(null);
        });
        marker = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            marker.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
                // draggable: true
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
            var googleLatitude = marker[0].position.lat();
            var googleLongitude = marker[0].position.lng();
            getWeatherRequest(googleLatitude, googleLongitude);

        });
        map.fitBounds(bounds);
        // getWeatherRequest(googleLatitude, googleLongitude);
    });
})