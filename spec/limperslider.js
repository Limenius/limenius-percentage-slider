'use strict';

describe("LimperSlider", function() {
    var limperslider = new LimperSlider(["#percentage1", "#percentage2", "#percentage3"]);

    var hasClass = function(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    };

    it("Initialization creates .limperslider", function() {
        var element = document.querySelector('#percentage1-percentage2-percentage3-limper');
        expect(element).toBeTruthy();
        expect(hasClass(element, 'limperslider')).toBeTruthy();
    });

    it("Bad initialization throws exception", function() {
        var thrower = function() {
            new LimperSlider(["#yolo", "#percentage2", "#percentage3"]);
        };
        expect(thrower).toThrow();
    });

    it("Hides inputs", function() {
        var thrower = function() {
            new LimperSlider(["#percentage1", "#percentage2", "#percentage3"]);
        };
        var element = document.querySelector("#percentage2");
        var type = element.getAttribute('type');
        expect(type).toEqual('hidden');
    });

    it("Initialization creates ticks", function() {
        var elements = document.querySelectorAll('.limper-tick');
        expect(elements.length).toEqual(2);
    });

    it("Initialization creates zones", function() {
        var elements = document.querySelectorAll('.limper-zone');
        expect(elements.length).toEqual(3);
    });

    it("Initialization creates tooltips", function() {
        var elements = document.querySelectorAll('.limper-tooltip');
        expect(elements.length).toEqual(3);
    });
});
