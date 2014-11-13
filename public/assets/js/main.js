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
    var markerIcon = new google.maps.MarkerImage(
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyNCIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEwMjguNCkiPjxwYXRoIGQ9Im0xMiAwYy00LjQxODMgMi4zNjg1ZS0xNSAtOCAzLjU4MTctOCA4IDAgMS40MjEgMC4zODE2IDIuNzUgMS4wMzEyIDMuOTA2IDAuMTA3OSAwLjE5MiAwLjIyMSAwLjM4MSAwLjM0MzggMC41NjNsNi42MjUgMTEuNTMxIDYuNjI1LTExLjUzMWMwLjEwMi0wLjE1MSAwLjE5LTAuMzExIDAuMjgxLTAuNDY5bDAuMDYzLTAuMDk0YzAuNjQ5LTEuMTU2IDEuMDMxLTIuNDg1IDEuMDMxLTMuOTA2IDAtNC40MTgzLTMuNTgyLTgtOC04em0wIDRjMi4yMDkgMCA0IDEuNzkwOSA0IDQgMCAyLjIwOS0xLjc5MSA0LTQgNC0yLjIwOTEgMC00LTEuNzkxLTQtNCAwLTIuMjA5MSAxLjc5MDktNCA0LTR6IiBmaWxsPSIjZTc0YzNjIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEwMjguNCkiLz48cGF0aCBkPSJtMTIgM2MtMi43NjE0IDAtNSAyLjIzODYtNSA1IDAgMi43NjEgMi4yMzg2IDUgNSA1IDIuNzYxIDAgNS0yLjIzOSA1LTUgMC0yLjc2MTQtMi4yMzktNS01LTV6bTAgMmMxLjY1NyAwIDMgMS4zNDMxIDMgM3MtMS4zNDMgMy0zIDMtMy0xLjM0MzEtMy0zIDEuMzQzLTMgMy0zeiIgZmlsbD0iI2MwMzkyYiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxMDI4LjQpIi8+PC9nPjwvc3ZnPg==",
        new google.maps.Size(80, 80), //size
        new google.maps.Point(0,0), //origin
        new google.maps.Point(0,0) //anchor 
    )
    var marker = new google.maps.Marker({
        position: latlng,
        icon: markerIcon,
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