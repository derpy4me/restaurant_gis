currentPosition = JSON.parse(sessionStorage.getItem("currentLocation"));

var currentLat = currentPosition.latitude;
var currentLong = currentPosition.longitude;

// const displayResults = () => {
//   results
//     .filter((result) => result.rating)
//     .sort((a, b) => (a.rating > b.rating ? -1 : 1))
//     .forEach((result) => {
//       // console.log(result.geometry.location.lat());
//       // console.log(result.geometry.location.lng());
//       places.innerHTML += `<li>${result.rating} - ${result.name} - ${result.vicinity}</li>`;
//     });
// };

const setResults = () => {
  var full_results = [];
  results
    .filter((result) => result.rating)
    .sort((a, b) => (a.rating > b.rating ? -1 : 1))
    .slice(20)
    .forEach((result) => {
      full_results.push({
        name: result.name,
        rating: result.rating,
        address: result.vicinity,
        lat: result.geometry.location.lat(),
        long: result.geometry.location.lng(),
      });
    });
  sessionStorage.setItem("restaurants", JSON.stringify(full_results));
};

const callback = (response, status, pagination) => {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    results.push(...response);
  }

  if (pagination.hasNextPage) {
    setTimeout(() => pagination.nextPage(), 2000);
  } else {
    // displayResults();
    setResults();
  }
};

const request = {
  location: new google.maps.LatLng(currentLat, currentLong),
  radius: 5280,
  type: ["restaurant"],
};

const results = [];
const places = document.getElementById("places");
const service = new google.maps.places.PlacesService(places);

service.nearbySearch(request, callback);
