/*jshint strict:false */ 
/* globals google, ko, $ */

let map;
let marker;
let infowindow;

/*
 * The array of locations in a client-server application would be the
 * value that our API is expeting to receive when the user wants to
 * consume our application.
 *
 */
let locations = [{
    title: 'Calle Molina Lario, 10, 29015 Málaga',
    description: 'Museum',
    icon: 'images/placeholder.png'
}, {
    title: 'Calle Duque de la Victoria, 2, 29015 Málaga',
    description: 'Heritage Museum',
    icon: 'images/placeholder.png'
}, {
    title: 'Paseo España, 2, 29015 Málaga',
    description: 'Park',
    icon: 'images/placeholder.png'
}, {
    title: 'Alameda Principal, 3, 29001 Málaga',
    description: 'Monument',
    icon: 'images/placeholder.png'
}, {
    title: 'Calle Strachan, 7, 29015 Málaga',
    description: 'Tavern',
    icon: 'images/placeholder.png'
}, {
    title: 'Av. de Andalucía, 15, 29002 Málaga',
    description: 'Park',
    icon: 'images/placeholder.png'
}];

/*
 * Class Map
 *
 */
class Map {

    constructor(arrayOfLocations) {
        this.markers = [];
        this.API_KEY = 'AIzaSyDNUuAV_u1BPgmWZEd4QqgpKXhluxYl3bw';
    }

    /*
     * createMarkers(clientLocations)
     *
     * arg: takes a user location info array and initialize an array of markers
     */
    createMarkers(clientLocations) {
            clientLocations.forEach((location) => {
                fetch(`https://maps.google.com/maps/api/geocode/json?address=${location.title}&key=${this.API_KEY}`, {
                    method: 'post'
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    // build a Google Map marker
                    marker = new google.maps.Marker({
                        position: data.results[0].geometry.location,
                        map: map,
                        animation: google.maps.Animation.DROP,
                        title: location.title,
                        icon: location.icon,
                        description: location.description
                    });

                    //fill array of markers with locations data, description and icon image
                    this.markers.push(marker);

                    // add an event handler to the markers
                    google.maps.event.addListener(marker, 'click', (function(marker) {
                        return function() {
                            infowindow.setContent(`<h3>${location.title}</h3>
                      <p>${location.description}</p>
                      `);
                            infowindow.open(map, marker);
                            toggleBounce(marker);
                        };
                    })(marker));


                }).catch((error) => {
                    $('#errorModal').modal('show');
                    $('.errors').text(error);
                });
            });
        } // end of getMarkers

    /*
     * listLocation(arrayOfMarker)
     *
     * Gets an array of markers and return an array with title location strings
     */
    listLocation(arrayOfMarker){
        let listLocations = [];

        arrayOfMarker.forEach((marker)=>{
            if(marker.visible){
                listLocations.push({title: marker.title});
            }
        });

        return listLocations;
    }

} // end of Map class

/*
 * initMap()
 *
 * Callback of Google API to Initialize the map
 */
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 36.7197016,
            lng: -4.4204332
        },
        zoom: 16,
        mapTypeId: 'terrain'
    });

    infowindow = new google.maps.InfoWindow();
}

/*
 * toggleBounce(marker)
 *
 * Gets a marker as argument and start the bounce animation
 */
function toggleBounce(marker) {

        marker.getAnimation() ? marker.setAnimation(null) : marker.setAnimation(google.maps.Animation.BOUNCE);

        setTimeout(() => {
            marker.setAnimation(null);
        }, 2000);

    } //end toggleBounce

/*
 * ViewModel
 *
 * Application ViewModel - KnockoutJs Framework
 */
let ViewModel = function() {
    this.usersearch = ko.observable("");
    this.userLocation = ko.observableArray(locations);
    this.openMenu = ko.observable(false);

    // binding the img of the hamburger menu on click event
    this.openCloseMenu = function() {
            this.openMenu() === false ? this.openMenu(true) : this.openMenu(false);
    }; // end

    //handle the click event in the list of locations
    this.listClick = function() {
            classMap.markers.forEach((marker) => {
                if (this.title === marker.title) {
                    infowindow.open(map, marker);
                    infowindow.setContent(`<h3>${marker.title}</h3>
                <p>${marker.description}</p>
                `);
                    toggleBounce(marker);
                }
            });
    }; // end of listClick

    //filter user input text change
    this.filterUserText = function() {

        if (this.usersearch() === "") {

            classMap.markers.forEach((marker)=>{
                marker.setVisible(true);
            });
            
            this.userLocation(classMap.listLocation(classMap.markers));
        }

        if (this.usersearch() !== "") {

            classMap.markers.forEach((marker) => {
                this.usersearch() === marker.title || this.usersearch() === marker.description ? marker.setVisible(true) : marker.setVisible(false);
            });

            this.userLocation(classMap.listLocation(classMap.markers));
        }

    }; // end of filterUserText

    //position markers into the map when the page is loaded
    this.initMarkers = function() {
        classMap.createMarkers(locations);
    };

};


//instance of the Map class
const classMap = new Map(locations);

//Knockoutjs binding
ko.applyBindings(new ViewModel());