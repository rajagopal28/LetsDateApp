function onMapsApiLoaded() {
  console.log('Map loaded');
}
function initMap(mapContainer, centre, myLocation, partnerLocation, partnerName) {
   // Specify location, radius and place types for your Places API search.
   var theCentre = new google.maps.LatLng(centre.latitude, centre.longitude);
   var placesRequest = {
     location: theCentre,
     radius: centre.radius,// TODO handle the metric conversion between meteres and kilometeres
     types: centre.interested_places.toLowerCase().split('|'),
     keyword : centre.places_meta.join('|').toLowerCase()
   };
   map = new google.maps.Map(mapContainer, {
    center: theCentre,
    zoom: centre.zoom
  });
  // Pass the directions request to the DistanceMatrixService.
  var distanceMatrixService = new google.maps.DistanceMatrixService();
  // create default view options
  var sources = [myLocation, partnerLocation];//[{lat:-33.86789, lng:151.204054}, {lat : -33.858268,lng : 151.194454}];//
  var directionMatricRequest = {
    origins: sources,
    destinations: [],
    travelMode: google.maps.TravelMode.DRIVING
  };
  // create a infoWindow to display details
  var infowindow = new google.maps.InfoWindow();
  // Create the PlaceService and send the request.
 // Handle the callback with an anonymous function.
 var placesService = new google.maps.places.PlacesService(map);
 placesService.nearbySearch(placesRequest, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var listHtmlString = '';
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        // add these places to the existing location-list dom
        listHtmlString += getDomForItem(place);
        console.log(place);
        $('#location-list').html(listHtmlString);
        $('#location-list').listview('refresh');
        // If the request succeeds, draw the place location on
        // the map as a marker, and register an event to handle a
        // click on the marker.
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        // add event listener to marker click to display details
        google.maps.event.addListener(marker, 'click', function(iWindow, cPlace) {
          // add event listener to marker click to display details
          return function() {
              var self = this;// to use this reference in iWindow
              var placeLocation = {lat : cPlace.geometry.location.lat(), lng: cPlace.geometry.location.lng()};
              directionMatricRequest.destinations = [placeLocation];
              console.log(placeLocation);
              // call distance matrix only if it is not already selected
              var preComputedDistanceText = getPreComputedDistanceText(cPlace);
              if(preComputedDistanceText) {
                  content = getDomForIWindow(cPlace, null, partnerName, preComputedDistanceText);
                  iWindow.setContent(content);
                  iWindow.open(map, self);
              } else {
                  callDistanceMatrixToGetDistances(google, distanceMatrixService, directionMatricRequest,
                                                    cPlace, infowindow, partnerName, self);
              }
          };
        }(infowindow, place)); // end of call back listener
      }// end for loop
    }// end status check
  });// end of place service call
}// end initMap
 function getPreComputedDistanceText(cPlace) {
   var placeChosenDom = $('.location-item #'+ cPlace.id + ' .distance-between-container');
   if(placeChosenDom.length) {
     // there is already a dom for this place id
     return placeChosenDom.html();
     // get the inner html and send it
   }
 }// end getPreComputedDistanceText
 function highlightAndSetTheEquivalentPlaceItem(cPlace, results, partnerName) {
   var selectedItemDom = $('.location-item #'+ cPlace.id);
   if(selectedItemDom.length == 1 &&
     results[0].elements[0].distance &&
         results[1].elements[0].distance) {
     if(!selectedItemDom.hasClass('selected')){
       // add class only if it is not added
      selectedItemDom.addClass('selected');
      var newDom = $('<div class="distance-between-container">'
      + '<br/>#'
      + results[0].elements[0].distance.text
      +  'Away from you'
      + '<br/>#'
      + results[1].elements[0].distance.text
      + 'Away from '
      + partnerName
      + '</div>');
      selectedItemDom.append(newDom);
     }
   }
 } // end highlightAndSetTheEquivalentPlaceItem
 function callDistanceMatrixToGetDistances(google,
                                             distanceMatrixService, directionMatricRequest,
                                             cPlace, iWindow, partnerName, referenceContext) {
   distanceMatrixService.getDistanceMatrix(directionMatricRequest,
     function(response, status) {
       if (status == google.maps.DistanceMatrixStatus.OK) {
         var origins = response.originAddresses;
         var destinations = response.destinationAddresses;
         var results = response.rows;
         console.log(results);
         // results[0].elements[0] will be the ditance between myLocation to the placeLocation
         // results[1].elements[0] will be the distance between partnerLocation to the placeLocation
         var content = getDomForIWindow(cPlace, results, partnerName, null);
         iWindow.setContent(content);
         iWindow.open(map, referenceContext);
         // highlight and add the list item
         highlightAndSetTheEquivalentPlaceItem(cPlace, results, partnerName);
       }// if check end
     }// function call back end
   );
 }// end callDistanceMatrixToGetDistances
 function getDomForIWindow(cPlace, results, partnerName, preCreatedResult) {
   var content = '<div><strong>'
   + cPlace.name
   + '</strong><br>'
   + 'Place ID: '
   + cPlace.place_id
   + '<br>'
   + cPlace.vicinity;

   if(results &&
      results[0].elements[0].distance &&
       results[1].elements[0].distance) {
       content += '<br/>#'
       + results[0].elements[0].distance.text
       +  'Away from you'
       + '<br/>#'
       + results[1].elements[0].distance.text
       + 'Away from '
       + partnerName;
   } else if(preCreatedResult) {
     content += preCreatedResult;
   }
   content += '</div>';
   return content;
 }// end getDomForIWindow
 function getDomForItem(cPlace) {
   return '<li class="location-item">'
   + '<div class="callout"'
   + 'id=' + cPlace.id
   + '>'
   + '<strong>'
   + cPlace.name
   + '</strong><br>'
   + 'Place ID: '
   + cPlace.place_id
   + '<br>'
   + cPlace.vicinity
   + '</div>'
   + '</li>';
 }// end getDomForItem
