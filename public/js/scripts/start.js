/*jshint multistr:true*/
$(function() {
    // create divs
    var markup = [
        "<div id='puton-container'>",
            "<h1>Puton</h1>",
            "<div id='puton-main'>",
                "<b><label for='db'>db name: </label></b>",
                "<input type='text' id='db'/>",
            "</div>",
            "<a href='#' id='hide-button'>Close</a>",
            "<div id='log'></div>",
        "</div>"
    ].join("");

    $(markup).appendTo($("body"));

    //
    // Start Puton
    //
    var x = new Puton();

    if (typeof window.PUTON_LOADED && window.PUTON_LOADED === -1) {
        window.PUTON_LOADED = 1;
    }
});
