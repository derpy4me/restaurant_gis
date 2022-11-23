var currentPosition = JSON.parse(sessionStorage.getItem("currentLocation"));

if (!currentPosition) {
  currentPosition = {
    latitude: 40.7608,
    longitude: -111.891,
  };
}

require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/rest/locator",
  "esri/Graphic",
  "esri/widgets/Locate",
  "esri/layers/GraphicsLayer",
], function (esriConfig, Map, MapView, locator, Graphic, Locate, GraphicsLayer) {
  esriConfig.apiKey = "REPLACE_GOOGLE_API_KEY";

  const map = new Map({
    basemap: "arcgis-navigation",
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [currentPosition.longitude, currentPosition.latitude], //Longitude, latitude
    zoom: 11,
  });

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
  // const places = ["Choose a place type...", "Parks and Outdoors", "Coffee shop", "Gas station", "Food", "Hotel"];

  const select = document.createElement("select", "");
  select.setAttribute("class", "esri-widget esri-select");
  select.setAttribute("style", "width: 175px; font-family: 'Avenir Next W00'; font-size: 1em");

  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  // places.forEach(function (place) {
  //   const option = document.createElement("option");
  //   option.value = place;
  //   option.innerHTML = place;
  //   select.appendChild(option);
  // });

  view.ui.add(locateWidget, "top-left");
  // view.ui.add(select, "top-right");

  const restaurantResults = JSON.parse(sessionStorage.getItem("restaurants"));

  const simpleMarker = {
    type: "simple-marker",
    color: "orange",
    outline: {
      color: "white",
      width: 2,
    },
  };

  if (restaurantResults) {
    view.popup.close();
    view.graphics.removeAll();
    restaurantResults.forEach(function (result) {
      graphicsLayer.add(
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

  // const locatorUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

  // Find places and add them to the map
  // function findPlaces(category, pt) {
  //   locator
  //     .addressToLocations(locatorUrl, {
  //       location: pt,
  //       categories: [category],
  //       maxLocations: 50,
  //       outFields: ["Place_addr", "PlaceName"],
  //     })

  //     .then(function (results) {
  //       view.popup.close();
  //       view.graphics.removeAll();

  //       results.forEach(function (result) {
  //         console.log(result.location);
  //         console.log(result.attributes);
  //         view.graphics.add(
  //           new Graphic({
  //             attributes: result.attributes, // Data attributes returned
  //             geometry: result.location, // Point returned
  //             symbol: {
  //               type: "simple-marker",
  //               color: "dodgerblue",
  //               size: "20px",
  //               outline: {
  //                 color: "#ffffff",
  //                 width: "2px",
  //               },
  //             },

  //             popupTemplate: {
  //               title: "{PlaceName}", // Data attribute names
  //               content: "{Place_addr}",
  //             },
  //           })
  //         );
  //       });
  //     });
  // }

  // Search for places in center of map
  // view.watch("stationary", function (val) {
  //   if (val) {
  //     findPlaces(select.value, view.center);
  //   }
  // });

  // Listen for category changes and find places
  // select.addEventListener("change", function (event) {
  //   findPlaces(event.target.value, view.center);
  // });
});
