// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
    
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    //console.log(layer)
    
    //layer.marker([geodata.coordinates],markerIcon)
    //layer.setIcon(myIconReplc)
    layer.bindPopup(`<h3>${feature.properties.place}</h3><h3>Magnitude: ${feature.properties.mag}</h3><h3>Depth: ${feature.geometry.coordinates[2]}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var bigdeep = {radius: 20, weight: 2, color: 'red'}
  var bigmed = {radius: 20, weight: 2, color: 'orange'}
  var bigshallow = {radius: 20, weight: 2, color: 'green'}
  var meddeep = {radius: 10, weight: 2, color: 'red'}
  var medmed = {radius: 10, weight: 2, color: 'orange'}
  var medshallow = {radius: 10, weight: 2, color: 'green'}
  var smalldeep = {radius: 5, weight: 2, color: 'red'}
  var smallmed = {radius: 5, weight: 2, color: 'orange'}
  var smallshallow = {radius: 5, weight: 2, color: 'green'}
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        console.log(feature)
        if (feature.properties.mag < 1){
            if (feature.geometry.coordinates[2]< 50) {return L.circleMarker(latlng,bigshallow)}
            if (feature.geometry.coordinates[2]< 100) {return L.circleMarker(latlng,bigmed)}
            else {return L.circleMarker(latlng,bigdeep)}
        }
        if (feature.properties.mag < 5){
            if (feature.geometry.coordinates[2]< 50) {return L.circleMarker(latlng,medshallow)}
            if (feature.geometry.coordinates[2]< 100) {return L.circleMarker(latlng,medmed)}
            else {return L.circleMarker(latlng,meddeep)} 
        } 
        else {
            if (feature.geometry.coordinates[2]< 50) {return L.circleMarker(latlng,smallshallow)}
            if (feature.geometry.coordinates[2]< 100) {return L.circleMarker(latlng,smallmed)}
            else {return L.circleMarker(latlng,smalldeep)} 
        }
        
    },
    onEachFeature: onEachFeature,
  });
  console.log(earthquakes)
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {
    
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = ['shallow','medium','deep'],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval

         div.innerHTML += '<i style="background:' + '#008000' + '">'+ 'shallow' +'</i>' + '<br>' ;
         div.innerHTML += '<i style="background:' + '#FFA500' + '">'+ 'medium' +'</i>' + '<br>' ;
         div.innerHTML += '<i style="background:' + '#ff0000' + '">'+ 'deep' +'</i>' + '<br>' ;

        return div;
    };

    legend.addTo(myMap);
  }