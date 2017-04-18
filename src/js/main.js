$(document).ready(function(){
    // Dismiss alert after 2 seconds
    window.setTimeout(function() { $(".alert").alert('close'); }, 2000);
});

// Named Funtions
function createNewAlert(type, text){
    $('#pageContent').prepend('<div class="alert alert-' + type + ' alert-dismissable fade in show" role="alert">' + text + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><i class="fa fa-times"></i></button></div>');
}
