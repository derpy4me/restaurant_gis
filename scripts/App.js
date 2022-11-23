// Check if there is an object in session storage
var currentPosition = JSON.parse(sessionStorage.getItem("currentLocation"));

// If no object found in session storage, set default location
if (!currentPosition) {
  currentPosition = {
    latitude: 40.7608,
    longitude: -111.891,
  };
  sessionStorage.setItem("currentLocation", JSON.stringify(currentPosition));
}

// ARC GIS requirements
require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/rest/locator",
  "esri/Graphic",
  "esri/widgets/Locate",
  "esri/layers/GraphicsLayer",
], function (esriConfig, Map, MapView, locator, Graphic, Locate, GraphicsLayer) {
  // Replace the below text with ARC GIS api key
  esriConfig.apiKey = "REPLACE_ARC_GIS_KEY";

  // Create base map layer
  const map = new Map({
    basemap: "arcgis-navigation",
  });

  // Show map layer and center based on location from session storage
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [currentPosition.longitude, currentPosition.latitude], //Longitude, latitude
    zoom: 11,
  });

  /*
   * Create location widget, which when clicked will add user location to session storage
   * Will also center on user location
   */
  const locateWidget = new Locate({
    view: view,
    useHeadingEnabled: false,
    goToOverride: function (view, options) {
      options.target.scale = 1500;
      currentPosition.latitude = options.target.target.latitude;
      currentPosition.longitude = options.target.target.longitude;
      sessionStorage.setItem("currentLocation", JSON.stringify(currentPosition));
      return view.goTo(options.target);
    },
  });

  // Create graphics layer for markers
  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  // Add location widget to top-left corner of map
  view.ui.add(locateWidget, "top-left");

  // Get restaurant results from session storage
  const restaurantResults = JSON.parse(sessionStorage.getItem("restaurants"));

  // Simple orange marker with white outline
  const simpleMarker = {
    type: "simple-marker",
    color: "orange",
    outline: {
      color: "white",
      width: 2,
    },
  };

  // Check if restaurants are available in session storage
  if (restaurantResults) {
    view.popup.close();
    view.graphics.removeAll();
    restaurantResults.forEach(function (result) {
      graphicsLayer.add(
        // Add new marker with popup
        new Graphic({
          geometry: {
            type: "point",
            x: result.long,
            y: result.lat,
          },
          symbol: simpleMarker,
          attributes: {
            Name: result.name,
            Description: `${result.rating} - ${result.address}`,
          },
          popupTemplate: {
            title: "{Name}",
            content: "{Description}",
          },
        })
      );
    });
  }
});
