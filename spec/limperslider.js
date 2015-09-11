'use strict';

describe("limperslider", function() {
    var slider;
    var hasClass = function(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    };

    beforeEach(function() {
        slider = new limperslider(["#percentage1", "#percentage2", "#percentage3"]);
    });

    afterEach(function() {
        slider.destroy();
    });

    it("Initialization creates .limperslider", function() {
        var element = document.querySelector('#percentage1-percentage2-percentage3-limper');
        expect(element).toBeTruthy();
        expect(hasClass(element, 'limperslider')).toBeTruthy();
    });

    it("Bad initialization throws exception", function() {
        var thrower = function() {
            new limperslider(["#yolo", "#percentage2", "#percentage3"]);
        };
        expect(thrower).toThrow();
    });

    it("Inputs readonly", function() {
        var element = document.querySelector("#percentage2");
        var readonly = element.getAttribute('readonly');
        expect(readonly).toEqual('readonly');
    });

    it("Destruction destroys", function() {
        var elements = document.querySelectorAll('.limper-track');
        expect(elements.length).toEqual(1);
    });

    it("Initialization creates handles", function() {
        var elements = document.querySelectorAll('.limper-handle');
        expect(elements.length).toEqual(2);
    });

    it("Initialization creates zones", function() {
        var elements = document.querySelectorAll('.limper-zone');
        expect(elements.length).toEqual(3);
    });

});
