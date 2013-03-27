window.PUTON_TESTS = true;
describe("General Application Functionality", function() {
    var puton;
    beforeEach(function() {
        Puton();
    });

    it("should appear",function() {
        expect(Puton._app.$el.css('display')).not.toBe("none");
    });

	it("should close when the #puton-hide-button is clicked", function() {
        // click on hide button
        Puton._app.$("#puton-hide-button").click();
        expect(Puton._app.$el.css('display')).toBe("none");
	});

    it("should reappear when the application is re-launched", function() {
        Puton._app.$("#puton-hide-button").click();
        Puton();
        expect(Puton._app.$el.css('display')).not.toBe("none");
    });
});

describe("Main Application View", function() {
    var mainView;
    var done;
    var randomPouches = [
        "test1",
        "test2",
        "test3"
    ];
    beforeEach(function() {
        runs(function() {
            mainView = new Puton.views.Main();
            helpers.deleteAllPouches(function(err) {
                if (err) {
                    console.log(err);
                    return;
                }

                // Create a bunch of pouches;
                helpers.createPouches(randomPouches, function(err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    mainView.render();
                });
            });
        });
        waitsFor(function() {
            return mainView.allDbs.length;
        }, "Timed out", 1000);
    });

    it("should display a list of existing databases", function() {
        var output = mainView.$el.html();
        var re;
        randomPouches.forEach(function(pouch) {
            re = new RegExp(pouch, 'ig');
            expect(re.test(output)).toBe(true);
        });
    });

    it("should trigger a selectDB event when a database is selected", function() {
    });

    it("should trigger a selectDB event when a database is clicked", function() {
        var eventTriggered;
        $("body").on('selectDB', function() {
            eventTriggered = true;
        });
        mainView.$el.hide();
        $("body").append(mainView.el);
        $li = mainView.$('.puton-dbname')[0];
        $li.click();

        expect(eventTriggered).toBe(true);
        mainView.$el.remove();
    });
});
