// Check for the current current position in the session storage.
currentPosition = JSON.parse(sessionStorage.getItem("currentLocation"));

var currentLat = currentPosition.latitude;
var currentLong = currentPosition.longitude;

/*
 * Summary.
 * This function is used to get the top 20 restaurants and sort them into a list, then store the items in session storage
 */
const setResults = () => {
  var full_results = [];
  results
    .filter((result) => result.rating) // Get results with a rating
    .sort((a, b) => (a.rating > b.rating ? -1 : 1)) // Highest ratings at the top of the list
    .slice(20) // Only get 20 of the results
    .forEach((result) => {
      full_results.push({
        name: result.name,
        rating: result.rating,
        address: result.vicinity,
        lat: result.geometry.location.lat(),
        long: result.geometry.location.lng(),
      });
    });
  // Add addresses with details into session Storage
  sessionStorage.setItem("restaurants", JSON.stringify(full_results));
};

const callback = (response, status, pagination) => {
  // From google cloud documentation, to get the address results.
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    results.push(...response);
  }

  if (pagination.hasNextPage) {
    // check for pages to get all locations
    setTimeout(() => pagination.nextPage(), 2000);
  } else {
    setResults();
  }
};

// The request to send to Google
const request = {
  location: new google.maps.LatLng(currentLat, currentLong),
  radius: 5280,
  type: ["restaurant"],
};

const results = [];

service.nearbySearch(request, callback);
