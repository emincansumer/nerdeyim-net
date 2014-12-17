/**
 * Application variables
 */
App.loadingText = 'Yükleniyor...';
App.shareLocationText = 'Konumumu Paylaş';
App.notSupportedLocation = 'Tarayıcınız konum bulma özelliğini desteklemiyor';
App.map = App.myMarker = App.yourMarker = {};
App.markerIcon = new google.maps.MarkerImage(
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyNCIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEwMjguNCkiPjxwYXRoIGQ9Im0xMiAwYy00LjQxODMgMi4zNjg1ZS0xNSAtOCAzLjU4MTctOCA4IDAgMS40MjEgMC4zODE2IDIuNzUgMS4wMzEyIDMuOTA2IDAuMTA3OSAwLjE5MiAwLjIyMSAwLjM4MSAwLjM0MzggMC41NjNsNi42MjUgMTEuNTMxIDYuNjI1LTExLjUzMWMwLjEwMi0wLjE1MSAwLjE5LTAuMzExIDAuMjgxLTAuNDY5bDAuMDYzLTAuMDk0YzAuNjQ5LTEuMTU2IDEuMDMxLTIuNDg1IDEuMDMxLTMuOTA2IDAtNC40MTgzLTMuNTgyLTgtOC04em0wIDRjMi4yMDkgMCA0IDEuNzkwOSA0IDQgMCAyLjIwOS0xLjc5MSA0LTQgNC0yLjIwOTEgMC00LTEuNzkxLTQtNCAwLTIuMjA5MSAxLjc5MDktNCA0LTR6IiBmaWxsPSIjZTc0YzNjIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEwMjguNCkiLz48cGF0aCBkPSJtMTIgM2MtMi43NjE0IDAtNSAyLjIzODYtNSA1IDAgMi43NjEgMi4yMzg2IDUgNSA1IDIuNzYxIDAgNS0yLjIzOSA1LTUgMC0yLjc2MTQtMi4yMzktNS01LTV6bTAgMmMxLjY1NyAwIDMgMS4zNDMxIDMgM3MtMS4zNDMgMy0zIDMtMy0xLjM0MzEtMy0zIDEuMzQzLTMgMy0zeiIgZmlsbD0iI2MwMzkyYiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxMDI4LjQpIi8+PC9nPjwvc3ZnPg==",
    new google.maps.Size(80, 80), //size
    new google.maps.Point(0,0), //origin
    new google.maps.Point(0,0) //anchor 
);
App.mapCentered = false;
App.directionsDisplay = {}

/**
 * Application methods
 */
App.init = function(){
    this.bindEvents();
    if($('#map-page').length){
        this.mapPage();
    }
}

// bind all events to objects
App.bindEvents = function() {
    // share location action
    $('.js-share-action').unbind('click').bind('click', function(e){
        e.preventDefault();
        $that = $(this);
        $that.attr('disabled', true).text(App.loadingText);
        $.ajax({
            type : "GET",
            url : App.siteURL + '/create',
            dataType : 'json',
            cache : false,
            success : function(data) {
                // catch errors in result
                if(data.error){
                    alert(data.error.message);
                } else {
                    App.redirect(data.code);
                }
            },
            error : function(xhr, textStatus, errorThrown){
                
            },
            complete : function(xhr, textStatus) {
                $that.removeAttr('disabled').text(App.shareLocationText);
            }
        });
    });
    // join location share form
    $('.main-form').unbind('submit').bind('submit', function(){
        return false;
    });
}

// Map page functions
App.mapPage = function() {
    this.initMap();
    this.initLocationShare();
}

// starts location sharing session
App.initLocationShare = function() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(this.handleGeolocation, this.handleGeolocationError, {
            maximumAge: 600000,
            enableHighAccuracy: true,
            timeout: 10000
        });
    } else {
        App.showError(App.notSupportedLocation);
    }
}

App.handleGeolocation = function(position) {
    var lat = position.coords.latitude + "";
    var lng = position.coords.longitude + "";
    if(!App.mapCentered) {
        App.mapCentered = true;
        App.map.setCenter(new google.maps.LatLng(lat, lng));
    }
    App.updateMyLocation(lat, lng);
    App.refreshStatus(lat, lng);
}

App.handleGeolocationError = function(error) {

}

// initializes google map
App.initMap = function() {
    // crate map
    var mapDiv = $('#map-page');
    //var latlng = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        zoom: 14,
    };
    App.map = new google.maps.Map(document.getElementById(mapDiv.attr('id')),
        mapOptions);
}

// refreshes location status of user
App.refreshStatus = function(lat, lng) {
    var $user_id = $('#user_id').val();
    $.ajax({
        type : "POST",
        url : App.siteURL + '/update-location',
        data: { lat : lat, lng : lng, user_id : $user_id },
        dataType : 'json',
        cache : false,
        success : function(data) {
            if(data !== null) {
                App.updateYourLocation(data.lat, data.lng);
            }
            App.updateMyLocation(lat, lng);
        },
        error : function(xhr, textStatus, errorThrown){
            
        },
        complete : function(xhr, textStatus) {
            setTimeout(function(){
                App.refreshStatus(lat, lng);
            }, 5000)
        }
    });
}

// updates location  of  user
App.updateMyLocation = function(lat, lng) {
    try{
        App.myMarker.setMap(null);
        App.myMarker = {};
    } catch(err) {
        
    }
    var latlng = new google.maps.LatLng(lat, lng);
    App.myMarker = new google.maps.Marker({
        position: latlng,
        icon: App.markerIcon,
    });
    App.myMarker.setMap(App.map);
}

// updates location  of other user
App.updateYourLocation = function(lat, lng) {
    try{
        App.yourMarker.setMap(null);
        App.yourMarker = {};
    } catch(err) {
        
    }
    var latlng = new google.maps.LatLng(lat, lng);
    App.yourMarker = new google.maps.Marker({
        position: latlng,
        icon: App.markerIcon,
    });
    App.yourMarker.setMap(App.map);
    App.showRoute();
}

// shows route between two marker
App.showRoute = function() {
    try{
        App.directionsDisplay.setMap(null);
        App.directionsDisplay = {};
    } catch(err) {
        
    }
    var directionsService = new google.maps.DirectionsService();
    App.directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
            strokeColor: "red"
        }
    });
    App.directionsDisplay.setMap(App.map);
    var request = {
        origin: App.myMarker.getPosition(),
        destination: App.yourMarker.getPosition(),
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            App.directionsDisplay.setDirections(response);
        }
    });
}

// redirect function
App.redirect = function(url) {
    window.location.href = url;
}

// show error alert function
App.showError = function(msg) {
    alert(msg);
}

// fire application on dom load
$(document).ready(function(e){
    window.App.init();
});