/*global $, App*/
/*jshint multistr:true*/
$(function() {
	// create divs
var markup = "\
<div id='puton-container'>\
    <h1>Puton</h1>\
    <div id='puton-main'>\
        <b><label for='db'>db name: </label></b>\
        <input type='text' id='db'/>\
    </div>\
    <div id='log'></div>\
</div>";
	$(markup).appendTo($("body"));
	var x = new App();
	x.start();
    if (typeof window.PUTON_LOADED && window.PUTON_LOADED === -1) {
        window.PUTON_LOADED = 1;
    }
});
