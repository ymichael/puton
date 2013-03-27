/*jshint multistr:true*/
$(function() {
    //
    // Start Puton
    //
    new Puton();
    $('body').append(window.Puton._app.$el);

    if (typeof window.PUTON_LOADED && window.PUTON_LOADED === -1) {
        window.PUTON_LOADED = 1;
    }
});
