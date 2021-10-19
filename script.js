var map = L.map('map').setView([7.5, 7.5], 3);

map.attributionControl
.setPrefix('Made with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

var controlLayers = L.control.layers( null, null, {
  position: 'topright',
  collapsed: false // false = open by default
}).addTo(map);

/* BASELAYERS */

var lightStreets = new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(lightStreets, 'Streets | Light (Carto)');

var darkStreets = new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);
controlLayers.addBaseLayer(darkStreets, 'Streets | Dark (Carto)');

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
controlLayers.addBaseLayer(Esri_WorldImagery, 'Satellite (Esri)');

/* OVERLAYS */

$.getJSON('acnh-art-location.geojson', function (data){
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      var circle = L.circleMarker(latlng, {
        radius: 3,
        fillColor: '#99CCFF',
        color: '#99CCFF',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      });
      circle.bindPopup('<strong>' + feature.properties.location + '</strong>' + '<br>' + '<br>' + '<em>' + feature.properties.realArtworkTitle + '</em>' + '<br>' + feature.properties.museumDescription + '<hr>' + feature.properties.itemName); 
      return circle;
    }
  }).addTo(map);
  controlLayers.addOverlay(geoJsonLayer, 'Museums');
});
