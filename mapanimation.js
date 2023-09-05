
var map;
var markers = [];

function mapInitial() {
  let myOptions = {
    zoom: 15,
    center: { lat: 42.35335, lng: -71.091525 },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  let element = document.getElementById("map");
  map = new google.maps.Map(element, myOptions);
  addMarkers();
}


async function addMarkers() {
 
  let locations = await getBusLocations();

  locations.forEach(function (bus) {
    let marker = getMarker(bus.id);
    if (marker) {
      moveMarker(marker, bus);
    } else {
      addMarker(bus);
    }
  });

  console.log(new Date());
  setTimeout(addMarkers, 20000);
}


async function getBusLocations() {
  let url =
    "https://api-v3.mbta.com/vehicles?api_key=9339e5e4cf1547858d5715aff07bddc2&filter[route]=1&include=trip";
  let response = await fetch(url);
  let json = await response.json();
  return json.data;
  }


function addMarker(bus) {
  let icon = getIcon(bus);
  let marker = new google.maps.Marker({
    position: {
      lat: bus.attributes.latitude,
      lng: bus.attributes.longitude,
    },
    map: map,
    icon: icon,
    id: bus.id,
  });
  markers.push(marker);
}

function getIcon(bus) {
  
  if (bus.attributes.direction_id === 0) {
    return "./images/red.png";
  }
  return "./images/blue.png";
}

function moveMarker(marker, bus) {
  
  let icon = getIcon(bus);
  marker.setIcon(icon);

  
  marker.setPosition({
    lat: bus.attributes.latitude,
    lng: bus.attributes.longitude,
  });
}

function getMarker(id) {
  let marker = markers.find(function (item) {
    return item.id === id;
  });
  return marker;
}

window.onload = mapInitial;