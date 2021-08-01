var url = "https://data.cityofnewyork.us/resource/vfnx-vebw.json"

d3.json(url).then(data => {

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

  
    var myMap = L.map("map", {
        center: [40.7831, -73.9712],
        zoom: 14,
        layers: streetmap,
        scrollWheelZoom: false,
        doubleClickZoom: false
    });

    var electionArr = [];

    var electionSquirrelData = [];
    var squirrelSightings = [];

    //set marker colors for the diffrerent squirrel fur colors.
    var graySquirrelMarker = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    var blackSquirrelMarker = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    var redSquirrelMarker = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    var unknownSquirrelMarker = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var graySquirrels = [];
    var blackSquirrels = [];
    var cinnamonSquirrels = [];

    data.forEach(squirrel => {
        var lon = squirrel.x;
        var lat = squirrel.y;
        
        var {year, month, day} = squirrel.date.match(/(?<month>\d{2})(?<day>\d{2})(?<year>\d{4})/, 'ig').groups;
        var date = new Date(`${year}.${month}.${day}`);
        squirrelSightings.push({"Date": date, "Color": squirrel.primary_fur_color});

        // var {year, month, day} = squirrel.date.match(/(?<month>\d{2})(?<day>\d{2})(?<year>\d{4})/, 'ig').groups;
        // var date = new Date(`${year}.${month}.${day}`);
        var marker = L.marker([lat,lon]).bindPopup(date);

        //set marker colors for squirrels. 
        if (day > 15){
            if (squirrel.primary_fur_color === "Gray") {
                var marker = L.marker([lat, lon], {icon: graySquirrelMarker}).bindPopup("I am a Gray Squirrel!");
                electionArr.push(marker);
                electionSquirrelData.push(squirrel);
                graySquirrels.push(squirrel);
            }
            else if (squirrel.primary_fur_color === "Black") {
                var marker = L.marker([lat, lon], {icon: blackSquirrelMarker}).bindPopup("My fru is black!");
                electionArr.push(marker);
                electionSquirrelData.push(squirrel);
                blackSquirrels.push(squirrel);
            }
            else if (squirrel.primary_fur_color === "Cinnamon") {
                var marker = L.marker([lat, lon], {icon: redSquirrelMarker}).bindPopup("My fur is red, but some may call it 'cinnamon'");
                electionArr.push(marker);
                electionSquirrelData.push(squirrel);
                cinnamonSquirrels.push(squirrel);
            }
            else {
                var marker = L.marker([lat, lon], {icon: unknownSquirrelMarker}).bindPopup("They didn't record what color MY fur is");
                electionArr.push(marker);
                electionSquirrelData.push(squirrel);
            }
        }
        
    });
   
    var novSquirrels = L.layerGroup(electionArr);
    var overlayMaps = {
        "Election Squirrels": novSquirrels
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: "topleft"});
    legend.onAdd = function() {

        var div = L.DomUtil.create("div", "info legend");
        //this sets up a bootstrap dropdown in a legend object of leaflet. This will be used to insert charts into the dropdown so they can be expanded and contracted. insert charts as li tags inside the dropdown-menu ul class. 
        div.innerHTML = "<div class=\"dropdown\"><button class=\"btn btn-secondary dropdown-toggle\" type=\"button\" id=\"dropdownMenuButton1\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">Charts</button>\"  <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton1\"><li><div id = \"chart1\"></div></li><li><div id = \"chart2\"></div></li><li><div id = \"chart3\"></div></li></ul></div>";

        return div;
    };

    legend.addTo(myMap);

    //  #####  PLOTLY BELOW  ######

    var squirrelPieData = [
        {
          labels: ["Grey", "Black", "Cinnamon"],
          values: [graySquirrels.length, blackSquirrels.length, cinnamonSquirrels.length],
          text: "Squirrel Number",
          type:"pie",
          opacity: 0.8,
          marker: {
            colors: ['rgb(160, 160, 160)', 'rgb(32, 32, 32)', '#D2691E'],
            line: {
              color: ['rgb(96, 96, 96)', 'rgb(0, 0, 0)', 'rgb(102, 51, 0)'],
              width: 3
            }
          }
        }
      ];
    
      var squirrelPieLayout = {
        title: "Squirrel Percentage by Fur Color",
        height: 500,
        width: 700
      };
    

    //sort to get into date order. 
    squirrelSightings.sort(function(a,b){
        return new Date(a.Date) - new Date(b.Date);
    });
    
    let blackArr=[];
    let redArr=[];
    let grayArr=[];
    
    let blackCount = 0;
    let redCount = 0;
    let grayCount =0;
    let currentDay = squirrelSightings[0].Date.getDate();
    
    let currentColor = "";
    let days =[];

    for (let i=0; i<squirrelSightings.length; i++){
        days.push(squirrelSightings[i].Date)
        
        if(squirrelSightings[i].Date.getDate() === currentDay){
            
            if(squirrelSightings[i].Color === "Black"){
                blackCount++;

            }else if(squirrelSightings[i].Color === "Gray"){
                grayCount++;

            }else if(squirrelSightings[i].Color === "Cinnamon"){
                redCount++;
            } else {
                null; //handles where color is undefined. 
            }
            
        
        } else{
            blackArr.push(blackCount);
            grayArr.push(grayCount);
            redArr.push(redCount);
            blackCount = 0;
            grayCount = 0;
            redCount = 0;
        }
        currentColor = squirrelSightings[i].Color;
        currentDay = squirrelSightings[i].Date.getDate();
    }

    //make list of all unique days
    function unique ( array ) {
        return array.filter(function(a){
            return !this[a] ? this[a] = true : false;
        }, {});
    }
    days = unique(days);

    // make line traces
    var trace1 = {
        x: days,
        y: grayArr,
        type: "scatter",
        name: "Gray Squirrels",
        mode: "lines",
        line: {
            color: 'blue'
        }
    };

    var trace2 = {
        x: days,
        y: blackArr,
        type: "scatter",
        name: "Black Squirrels",
        mode: 'lines',
        line: {
            color: 'green'
        }   
    };

    var trace3 = {
        x: days,
        y: redArr,
        type: "scatter",
        name: "Cinnamon Squirrels",
        mode: 'lines',
        line: {
            color: 'red'
        }
    };

    var squirrelElectionsLayout = {
        title: "Squirrel Demographic Trends Near Election Day"
    };    

    

	Plotly.newPlot("chart1", [trace1, trace2, trace3], squirrelElectionsLayout);
    Plotly.newPlot("chart2", squirrelPieData, squirrelPieLayout);

    //serves up graph from pew research 
    d3.select("#chart3").append("img").attr("src", "/static/images/PartyAffNY.png").attr("id", "party-breakdown");

    //adds default view
    novSquirrels.addTo(myMap);

});

