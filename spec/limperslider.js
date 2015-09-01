'use strict';

describe("LimperSlider", function() {
  var limperslider;

  it("Initialization creates div", function() {
    limperslider = new LimperSlider(["#percentage1", "#percentage2", "#percentage3"]);
    var element = document.querySelector('#percentage1-percentage2-percentage3-limper');
    expect(element).toBeTruthy();
  });

});
