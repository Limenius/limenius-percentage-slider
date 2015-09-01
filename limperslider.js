'use strict';

function LimperSlider(selectors, options) {

    function F() {};
    F.prototype = (function() {
        var el = null;
        var inputs = [];
        var ticks = [];
        var zones = [];
        var tooltips = [];
        var hideInputs = function(selectors) {
            for (var i = 0; i < selectors.length; i++) {
                var selector = selectors[i];
                var inpelement = document.querySelector(selector);
                inpelement.setAttribute('type', 'hidden');
            }
        };

        var addClass = function (element, className) {
            if (element.classList) {
                element.classList.add(className);
            } else {
                element.className += ' ' + className;
            }
        };

        var createTicks = function (track) {
            for (var i = 0; i < inputs.length - 1; i++) {
                var tick = document.createElement('div');
                addClass(tick, 'limper-tick');
                track.appendChild(tick);
                zones.push(tick);
            }
        };

        var createZones = function (track) {
            for (var i = 0; i < inputs.length; i++) {
                var zone = document.createElement('div');
                addClass(zone, 'limper-zone');
                track.appendChild(zone);
                zones.push(zone);
            }
        };

        var createTooltips = function (track) {
            for (var i = 0; i < inputs.length; i++) {
                var tooltip = document.createElement('div');
                addClass(tooltip, 'limper-tooltip');
                track.appendChild(tooltip);
                zones.push(tooltip);
            }
        };

        var createElements = function() {
            var track = document.createElement('div');
            addClass(track, 'limper-track');
            el.appendChild(track);
            createTicks(track);
            createZones(track);
            createTooltips(track);
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
                addClass(el, 'limperslider');
                lastelement.insertAdjacentElement('afterend', el);
                el.setAttribute('id', idlimper);

                hideInputs(selectors);
                createElements();
            },

        }
    })();

    var f = new F();

    f.init(selectors, options);
    return f;
 
};
