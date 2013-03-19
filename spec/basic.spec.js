describe("General Application Functionality", function() {
    var puton;
    beforeEach(function() {
        puton = new Puton(); 
    });

    it("should appear",function() {
        expect(puton._app.$el.css('display')).not.toBe("none");
    });

	it("should close when the #hide-button is clicked", function() {
        // click on hide button
        puton._app.$("#hide-button").click(); 
        expect(puton._app.$el.css('display')).toBe("none");
	});
});
