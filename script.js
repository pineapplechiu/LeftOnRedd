const infoEl = document.getElementById('artworks');
const buttonEl = document.getElementById('redd');

const map = L.map('map').setView([7.5, 7.5], 3);

// const map = L.map('map', {
//   center: [7.5, 7.5],
//   zoom: 3,
//   layers: []
// });

map.attributionControl
.setPrefix('Made with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
const randomLayer = L.layerGroup([])
const controlLayers = L.control.layers( null, null, {
  position: 'topright',
  collapsed: false // false = open by default
}).addTo(map);
controlLayers.addOverlay(randomLayer, 'Redd');

/* BASELAYERS */

const lightStreets = new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
controlLayers.addBaseLayer(lightStreets, 'Streets | Light (Carto)');

const darkStreets = new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);
controlLayers.addBaseLayer(darkStreets, 'Streets | Dark (Carto)');

const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
controlLayers.addBaseLayer(Esri_WorldImagery, 'Satellite (Esri)');

const baseMaps  = {
  "Grayscale": darkStreets,
  "Streets": Esri_WorldImagery
}; 

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function makeArtworkHtml(artwork) {
  return "<hr>" + "<br>" + "<strong>" + artwork.location + "</strong>" +"<br>" + "<em>" + artwork.realArtworkTitle + "</em>" + "<br>" + "<br>" + artwork.museumDescription + "<br>" + "<br>" + "- " + artwork.artist + "<br>";
}


/* OVERLAYS */

$.getJSON('acnh-art-location.geojson', function (data){
  console.log(data.features)
  const artworks = data.features.map(feature => feature.properties);

  buttonEl.addEventListener('click', () => {
    const randoms = []
    let n = 0;
    
    while (n < 4) {
      const randomNum = getRandomInt(artworks.length)
      if (!randoms.includes(randomNum)) {
        randoms.push(randomNum)
        n++;
      }
    }
  
    const randomFeatures = randoms.map(i => data.features[i]);
    console.log(randomFeatures)
    const htmlString = randomFeatures.map(feature => makeArtworkHtml(feature.properties)).join("");
    infoEl.innerHTML = htmlString; 

    const randomMuseumsList = randomFeatures.map(feature => L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]));
    const layer = L.layerGroup(randomMuseumsList)
    randomLayer.clearLayers()
    randomLayer.addLayer(layer)
  })

  const geoJsonLayer = L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      const circle = L.circleMarker(latlng, {
        radius: 3,
        fillColor: '#99CCFF',
        color: '#99CCFF',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      });
      circle.bindPopup('<strong>' + feature.properties.location + '</strong>' + '<br>' + '<hr>' + feature.properties.city + ', ' + feature.properties.country + '</em>' + '<br>'); 

      circle.on("click", (e) => {
        const props = e.target.feature.properties
        const museumArtworks = artworks.filter(artwork => artwork.location === props.location);
        console.log(museumArtworks)
        // const htmlString = museumArtworks.map(makeArtworkHtml).join("");

        let htmlString = ""

        for (const artwork of museumArtworks) {
          htmlString += makeArtworkHtml(artwork)
        }

        infoEl.innerHTML = htmlString; 
        // console.log(htmlString)
      })
    
      return circle;
    }
  // })
  }).addTo(map);
  controlLayers.addOverlay(geoJsonLayer, 'Museums');
});
