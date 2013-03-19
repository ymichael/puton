/*jshint multistr:true*/
$(function() {
    //
    // Start Puton
    //
    var puton = new Puton();
    $('body').append(puton._app.$el);

    if (typeof window.PUTON_LOADED && window.PUTON_LOADED === -1) {
        window.PUTON_LOADED = 1;
    }
});
