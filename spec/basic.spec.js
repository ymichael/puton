describe("General Application Functionality", function() {
    var puton;
    beforeEach(function() {
        new Puton(); 
    });

    it("should appear",function() {
        expect(Puton._app.$el.css('display')).not.toBe("none");
    });

	it("should close when the #puton-hide-button is clicked", function() {
        // click on hide button
        Puton._app.$("#puton-hide-button").click(); 
        expect(Puton._app.$el.css('display')).toBe("none");
	});
});

describe("Main Application View", function() {
    var mainView;
    beforeEach(function() {
        mainView = new Puton.views.Main();
    });

    it("should display a list of existing databases", function() {

    });

    it("should trigger a selectDB event when a database is selected", function() {

    });

    it("should trigger a selectDB event when a database is clicked", function() {

    });
});
