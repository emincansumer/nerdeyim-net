/**
 * Application variables
 */
App.loadingText = 'Yükleniyor...';
App.shareLocationText = 'Konumumu Paylaş';
App.notSupportedLocation = 'Tarayıcınız konum bulma özelliğini desteklemiyor';

/**
 * Application methods
 */
App.init = function(){
    this.bindEvents();
    if($('#map-page')){
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
}

// Map page functions
App.mapPage = function() {
    this.initLocationShare();
}

// starts location sharing session
App.initLocationShare = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.handleGeolocation, this.handleGeolocationError, {
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
    App.initMap(lat, lng);
    App.refreshStatus(lat, lng);
}

App.handleGeolocationError = function(error) {

}

// initializes google map
App.initMap = function(lat, lng) {
    // crate map
    var mapDiv = $('#map-page');
    var latlng = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        zoom: 14,
        center: latlng
    };
    var map = new google.maps.Map(document.getElementById(mapDiv.attr('id')),
        mapOptions);

    // add marker to map
    var marker = new google.maps.Marker({
        position: latlng
    });
    marker.setMap(map);
}

// refreshes location status of user
App.refreshStatus = function(lat, lng) {
    $.ajax({
        type : "POST",
        url : App.siteURL + '/update-location',
        data: { lat : lat, lng : lng, user_id : $('#user_id').val() },
        dataType : 'json',
        cache : false,
        success : function(data) {
            
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