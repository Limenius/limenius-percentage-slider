'use strict';

describe("LimperSlider", function() {
    var limperslider;

    it("Initialization creates div", function() {
        limperslider = new LimperSlider(["#percentage1", "#percentage2", "#percentage3"]);
        var element = document.querySelector('#percentage1-percentage2-percentage3-limper');
        expect(element).toBeTruthy();
    })  ;

    it("Bad initialization throws exception", function() {
        var thrower = function() {
            new LimperSlider(["#yolo", "#percentage2", "#percentage3"]);
        }
        expect(thrower).toThrow();
    });

    it("Hides inputs", function() {
        var thrower = function() {
            new LimperSlider(["#percentage1", "#percentage2", "#percentage3"]);
        }
        var element = document.querySelector("#percentage2");
        var type = element.getAttribute('type');
        expect(type).toEqual('hidden');
    });
});
