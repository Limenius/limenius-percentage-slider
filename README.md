# limenius-percentage-slider
Slider for percentages. Or segments that add up to a certain value.

Suppose you have a number of input fields in a form and they represent segments of a total (for instance, **percentages** that add up to 100).

    <input id="percentage1" type="text"/>
    <input id="percentage2" type="text"/>
    <input id="percentage3" type="text"/>

Include somewhere `limperslider.js` and run it:

    new LimperSlider(["#percentage1", "#percentage2", "#percentage3"]);


This code does not need jQuery nor any other library to run. It just uses raw JavaScript (>=IE8) and thus is compatible with AngularJS or whatever environment.
