/**
 * Application variables
 */
App.loadingText = 'Yükleniyor...';
App.shareLocationText = 'Konumumu Paylaş';

/**
 * Application methods
 */
App.init = function(){
    this.bindEvents();
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

// redirect function
App.redirect = function(url) {
    window.location.href = url;
}

// fire application on dom load
$(document).ready(function(e){
    window.App.init();
});