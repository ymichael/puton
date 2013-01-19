// Persists state for backbone using cookie
// because obviously we're not going to mess with the querystring
// requires jquery.cookie


// todo: persist not just on a domain level but page level

function State() {
    var self = this;

    self.adapater = false;
    self.document = false;

    return self;
}


State.prototype.save = function() {
    $.cookie('_zipper_adapater', self.adapter);
    $.cookie('_zipper_document', self.document);
};

State.prototype.load = function() {
    self.adapter = $.cookie('_zipper_adapater');
    self.document = $.cookie('_zipper_document');
};