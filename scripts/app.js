/*jshint strict:false */ 
/* globals google, ko, $ */

let map;
let marker;
let infowindow; 
let token;

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
        this.clientId = "EYM4ZVOPQUCPFYGT233NJ2DV3FRPI3UBC3CNDF331IA4V2WJ";
        this.clientSecret = "EEVZLIERJ4VXZPKTU2LFLMFESPWQWOW3BZUCWCJJVJ2KRCKG";
        this.token = "";
        this.prefix = "";
        this.size = "";
        this.suffix = "";
        this.width = "";
        this.height = "";
        this.imageUrl = "";
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
                
                console.log(data.results[0].geometry.location.lat);
                console.log(data.results[0].geometry.location.lng);
                console.log(location.description);


                //get the venue id
                this.getVenue(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng, location.description);

                setTimeout(()=>{
                    // build a Google Map marker
                    marker = new google.maps.Marker({
                        position: data.results[0].geometry.location,
                        map: map,
                        animation: google.maps.Animation.DROP,
                        title: location.title,
                        icon: location.icon,
                        description: location.description
                    });

                    this.addEventToMarkers(marker);

                    //fill array of markers with locations data, description and icon image
                    this.markers.push(marker);

                }, 3000);
                


            }).catch((error) => {
                $('#errorModal').modal('show');
                $('.errors').text(error);
            });
        });

    } // end of getMarkers


    /*
     * addEventToMarkers(marker)
     *
     * Gets an a marker, add a click event to it and return a marker with a click event attached
     * and information about the location in the infoWindow
     */
    addEventToMarkers(marker){
        
        google.maps.event.addListener(marker, 'click', (function(marker) {
            return ()=> {
                infowindow.setContent(`<h3>${marker.title}</h3>
                <img width='250px' height='250px' src='${classMap.imageUrl}' alt="${marker.description}">                
                <p>${marker.description}</p>`);
                infowindow.open(map, marker);
                toggleBounce(marker);
            };
        })(marker));
       
    }

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
    }// end 

    /*
     * getVenue(latidute, longitude, query)
     *
     * Takes latidute, longitude from markers locations and query from
     * a marker's description and retrieve the venue id
     */
    getVenue(latidute, longitude, query){
        fetch(`https://api.foursquare.com/v2/venues/search?ll=${latidute},${longitude}&client_id=${this.clientId}&client_secret=${this.clientSecret}&query=${query}&v=20170929`)
        .then((response)=>{
            return response.json();
        }).then((venue)=>{
            //get picture data
            this.getVenuePicture(venue.response.venues[0].id);
            
        }).catch((error)=>{
            $('#errorModal').modal('show');
            $('.errors').text(error);
        });
    }// end

    /*
     * getVenuePicture(venueId)
     *
     * Takes a venue id from a location and 
     */
    getVenuePicture(venueId){
        fetch(`https://api.foursquare.com/v2/venues/${venueId}/photos?client_id=${this.clientId}&client_secret=${this.clientSecret}&v=20170929`)
        .then((response)=>{
            return response.json();
        }).then((photo)=>{
            this.prefix = photo.response.photos.items[0].prefix;
            this.suffix = photo.response.photos.items[0].suffix;
            this.width = photo.response.photos.items[0].width;
            this.height = photo.response.photos.items[0].height;
            this.size = `${this.width}x${this.height}`;
            
            this.imageUrl = this.generatePictureUrl();

        }).catch((error)=>{
            $('#errorModal').modal('show');
            $('.errors').text(error);
        });
    }

    /*
     * getVenuePicture(venueId)
     *
     * Takes a venue id from a location and 
     */
    generatePictureUrl(){
        console.log(`${this.prefix}${this.size}${this.suffix}`);
        return `${this.prefix}${this.size}${this.suffix}`
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