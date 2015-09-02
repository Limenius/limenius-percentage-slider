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

    it("Inputs readonly", function() {
        var thrower = function() {
            new LimperSlider(["#percentage1", "#percentage2", "#percentage3"]);
        };
        var element = document.querySelector("#percentage2");
        var readonly = element.getAttribute('readonly');
        expect(readonly).toEqual('readonly');
    });

    it("Initialization creates handles", function() {
        var elements = document.querySelectorAll('.limper-handle');
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
