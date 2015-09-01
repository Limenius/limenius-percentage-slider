'use strict';

function LimperSlider(selectors, options) {

    function F() {};
    F.prototype = (function() {
        var el = null;
        var inputs = [];
        var hideInputs = function(selectors) {
            for (var i = 0; i < selectors.length; i++) {
                var selector = selectors[i];
                var inpelement = document.querySelector(selector);
                inpelement.setAttribute('type', 'hidden');
            }
        };

        var createElements = function() {
            var track = document.createElement('div');
        };

        return {
            init: function (selectors, options) {
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
                    inputs.push(element);
                    lastelement = element;
                }

                idlimper += "-limper";
                el = document.createElement('div');
                lastelement.insertAdjacentElement('afterend', el);
                el.setAttribute('id', idlimper);

                hideInputs(selectors);
                createElements();
            },

            getElement: function () {
                return el;
            }
        }
    })();

    var f = new F();

    f.init(selectors, options);
    return f;
 
}

//F.prototype = (function () {  
//  
//    // Private attributes  
//    var somePrivateAttribute = 'Hello world';  
//  
//    // Private methods  
//    function somePrivateMethod(val) {  
//        alert(val);  
//    }  
//  
//    // Public attributes and methods  
//    return {  
//        somePublicMethod: function () {  
//            somePrivateMethod(somePrivateAttribute);  
//        }  
//    };  
//})();
