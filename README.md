# limenius-percentage-slider

** Unmantained ** (we have a React component now doing this :/).

Slider for percentages. Or segments that add up to a certain value.

[![Build Status](https://travis-ci.org/Limenius/limenius-percentage-slider.svg?branch=master)](https://travis-ci.org/Limenius/limenius-percentage-slider)

![Screenshot](https://raw.githubusercontent.com/Limenius/limenius-percentage-slider/master/doc/example.png)

## Usage

Let's suppose you have a number of input fields in a form and they represent segments of a total (for instance, **percentages** that add up to 100).

    <input id="percentage1" type="text"/>
    <input id="percentage2" type="text"/>
    <input id="percentage3" type="text"/>

Include somewhere `limperslider.js` and `css/limperslider.css`, and create the limperslider object. You can pass it a list of selectors:

    new Limperslider(["#percentage1", "#percentage2", "#percentage3"]);

... or a list of HTMLElements, which is useful for instance it the elements are not inserted in the document:

    new Limperslider([$("#percentage1")[0], $("#percentage2")[0], $("#percentage3")[0]]);

This code does not need jQuery nor any other library to run. It just uses raw JavaScript (>=IE8) and thus is compatible with AngularJS or whatever environment.

## Options

`new Limperslider(selectors, options)` accepts a second argument `options`.

* **options.selector**: Selector where the slider will be inserted.
* **options.element**: HTMLElement where the slider will be inserted.
* **options.total**: Total value to add up. Default is 100 (percentages).
* **options.defaultColor**: Color of the segments.
* **options.colors**: Array of the colors for each segment.
* **options.decimals**: Decimal digits of the values. Default is 0 (integers).

## RequireJs & AMD compatible

This library is AMD (requirejs) compatible. To use it:

    requirejs.config({
        paths: {
            limperslider: '../somepath/limenius-percentage-slider/limperslider',
            }
       }
    );

## CommonJs & Node.js compatible

This library is also compatible with CommonJs and Node.js modules. To use it:

    var Limperslider = require('limenius-percentage-slider');
