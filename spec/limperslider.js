describe("limperslider", function() {
    'use strict';
    var slider;
    var hasClass = function(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    };

    var resetInputs = function() {
        var elements = document.querySelectorAll('.inputtest');
        for (var i = 0; i < elements.length; i++) {
            elements[i].setAttribute('value', '');
        }
    };

    beforeEach(function() {
        slider = new limperslider(["#percentage1", "#percentage2", "#percentage3"]);
    });

    afterEach(function() {
        slider.destroy();
        resetInputs();
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

    it("By default has no decimals", function() {
        var element = document.querySelector('#percentage1');
        expect(element.getAttribute('value')).toEqual('33');
        element = document.querySelector('#percentage3');
        expect(element.getAttribute('value')).toEqual('34');
    });

    it("Decimals are configurable", function() {
        var element = document.querySelector('#percentage1');
        element.setAttribute('value', 0);
        slider.destroy();
        slider = new limperslider(["#percentage1", "#percentage2", "#percentage3"], {decimals: 3});
        expect(element.getAttribute('value')).toEqual('33.333');
        var element2 = document.querySelector('#percentage3');
        expect(element2.getAttribute('value')).toEqual('33.334');
    });

    it("Colors are configurable", function() {
        var element = document.querySelector('.limper-zone');
        expect(element.style['background-color']).toEqual('rgb(238, 238, 238)');
        slider.destroy();
        slider = new limperslider(["#percentage1", "#percentage2", "#percentage3"], {defaultColor: "green"});
        element = document.querySelector('.limper-zone');
        expect(element.style['background-color']).toEqual('green');
        slider.destroy();
        slider = new limperslider(["#percentage1", "#percentage2", "#percentage3"], {colors: ["green", "red"]});
        element = document.querySelectorAll('.limper-zone')[1];
        expect(element.style['background-color']).toEqual('red');
        element = document.querySelectorAll('.limper-zone')[2];
        expect(element.style['background-color']).toEqual('rgb(238, 238, 238)');
    });

});
