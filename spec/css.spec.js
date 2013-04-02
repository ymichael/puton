window.PUTON_TESTS = true;
describe("CSS/DOM Elements to have particular classes", function() {
	describe("Puton.app", function() {
		var app = new Puton.app();
		it("should have an id of puton", function() {
			expect(app.$el.attr('id')).toBe('puton');
		});
	});

	describe("Puton.app", function() {
		var app = new Puton.app();
		app.start();

		it("should be #puton", function() {
			expect(app.$el.attr('id')).toBe('puton');
		});

		it("should contain a div of #puton-main for views", function() {
			expect(app.$('#puton-main').length).toBe(1);
		});

		it("should have a hide button of #puton-hide-button", function() {
			expect(app.$('#puton-hide-button').length).toBe(1);
		});
	});

	describe("Main View", function() {
		var main = new Puton.views.Main();
		main.render();
		it("should contain input#puton-db-input", function() {
			expect(main.$('input#puton-db-input').length).toBe(1);
		});
	});

	// TODO.
	// describe("DB View", function() {
	// 	expect(db.$('#puton-toolbar').length).toBe(1);
	// 	expect(db.$('#puton-tabs').length).toBe(1);
	// 	expect(db.$('.puton-docs').length).toBe(1);
	// });
});