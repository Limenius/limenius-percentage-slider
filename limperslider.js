'use strict';

var limperPrototype = {
    element: null,

    hideInputs: function(selectors) {
        for (var i = 0; i < selectors.length; i++) {
            var selector = selectors[i];
            var element = document.querySelector(selector);
            element.setAttribute('type', 'hidden');
        }
    },

    init: function (selectors, options) {
        var elements = [];
        var idlimper = '';
        var lastelement = null;
        for (var i = 0; i < selectors.length; i++) {
            var selector = selectors[i];
            var element = document.querySelector(selector);
            if (!selector) {
                throw "element" + selector + "does not exist"
            }
            var id = element.getAttribute('id');
            if (i > 0) {
                idlimper += "-";
            }
            idlimper += id;
            elements.push(element);
            lastelement = element;
        }

        idlimper += "-limper";
        this.element = document.createElement('div');
        lastelement.insertAdjacentElement('afterend', this.element);
        this.element.setAttribute('id', idlimper);

        this.hideInputs(selectors);
    },
};

function LimperSlider(selectors, options) {

    function F() {};
    F.prototype = limperPrototype;

    var f = new F();

    f.init(selectors, options);
    return f;
 
}
