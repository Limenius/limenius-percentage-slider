'use strict';

function LimperSlider(selectors, options) {

    function F() {};
    F.prototype = (function() {
        var el = null;
        var inputs = [];
        var handlers = [];
        var zones = [];
        var tooltips = [];
        var values = [];
        var total = 100;
        var beingMoved = null;
        var hideInputs = function(selectors) {
            for (var i = 0; i < selectors.length; i++) {
                var selector = selectors[i];
                var inpelement = document.querySelector(selector);
                inpelement.setAttribute('readonly', 'readonly');
            }
        };

        var addClass = function (element, className) {
            if (element.classList) {
                element.classList.add(className);
            } else {
                element.className += ' ' + className;
            }
        };

        var onMouseUp = function(e) {
            document.removeEventListener("mousemove", onMouseMove, false);
            document.removeEventListener("mouseup", onMouseUp, false);
        };

        var onMouseMove = function(e) {
            var handleIdx = beingMoved.getAttribute('limperidx');
            var percentage = getPercentage(e);
            setNewPosition(handleIdx, percentage);
        };

        var onMouseDown = function(e) {
            document.removeEventListener("mousemove", onMouseMove, false);
            document.removeEventListener("mouseup", onMouseUp, false);
            document.addEventListener("mousemove", onMouseMove, false);
            document.addEventListener("mouseup", onMouseUp, false);
            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault();
            e.cancelBubble=true;
            e.returnValue=false;
            beingMoved = e.target;
            return false;
        };

        var setNewPosition = function(handleIdx, percentage) {
            values[handleIdx] = percentage;
            positionElements();
            setInputsFromPosition();
        };

        var setInputsFromPosition = function() {
            var prevVal = 0;
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].setAttribute('value', (values[i] - prevVal).toFixed(2));
                prevVal = values[i];
            }
        };

        var getPercentage = function(e) {
            var eventPosition = e.pageX;
            var rect = el.getBoundingClientRect();
            var offset = rect.left;
            var size = rect.right - rect.left;
            var distanceToSlide = eventPosition - offset;
            var percentage = (distanceToSlide / size) * 100;
            var handleIdx = parseInt(beingMoved.getAttribute('limperidx'), 10);
            var maxPercentage = 100;
            if (handleIdx < handlers.length - 1) {
                maxPercentage = values[handleIdx + 1];
            }
            var minPercentage = 0;
            if (handleIdx > 0) {
                minPercentage = values[handleIdx - 1];
            }
            return Math.max(Math.max(minPercentage, percentage), Math.min(maxPercentage, percentage));
        };

        var createHandlers = function (track) {
            for (var i = 0; i < inputs.length - 1; i++) {
                var handle = document.createElement('div');
                addClass(handle, 'limper-handle');
                handle.setAttribute('limperidx', i);
                track.appendChild(handle);
                handlers.push(handle);
                handle.addEventListener('mousedown', onMouseDown);
            }
        };

        var createZones = function (track) {
            var colors = ['red', 'yellow', 'green'];
            for (var i = 0; i < inputs.length; i++) {
                var zone = document.createElement('div');
                addClass(zone, 'limper-zone');
                zones.push(track.appendChild(zone));
                zones[i].style['background-color'] = colors[i];
            }
        };

        var createTooltips = function (track) {
            for (var i = 0; i < inputs.length; i++) {
                var tooltip = document.createElement('div');
                addClass(tooltip, 'limper-tooltip');
                track.appendChild(tooltip);
                tooltips.push(tooltip);
            }
        };

        var createElements = function() {
            var track = document.createElement('div');
            addClass(track, 'limper-track');
            el.appendChild(track);
            createZones(track);
            createTooltips(track);
            createHandlers(track);
        };

        var isNumeric = function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };

        var computeInitialValues = function() {
            var aggregated = 0;
            var allValidValues = true;
            for (var i = 0; i < inputs.length; i++) {
                var value = inputs[i].getAttribute('value');
                if (!isNumeric(value)) {
                    allValidValues = false;
                } else {
                    aggregated += value;
                    values.push(value);
                }
            }
            if (aggregated != total || !allValidValues) {
                var acc = 0;
                for (var i = 0; i < inputs.length - 1; i++) {
                    acc += total / inputs.length;
                    inputs[i].setAttribute('value', (total / inputs.length).toFixed(2));
                    values.push(acc);
                }
                inputs[inputs.length - 1].setAttribute('value', (total / inputs.length).toFixed(2));
                values.push(total);
            }
        };

        var positionZones = function() {
            var prevVal = 0;
            for (var i = 0; i < zones.length; i++) {
                zones[i].style.left = prevVal + '%';
                zones[i].style.width = (values[i] - prevVal) + '%';
                prevVal = values[i];
            }
        };

        var positionHandlers = function() {
            for (var i = 0; i < values.length - 1; i++) {
                handlers[i].style.left = values[i] + '%';
            }
        };

        var positionElements = function() {
                positionZones();
                positionHandlers();
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
                computeInitialValues();
                createElements();
                positionElements();
            },

        }
    })();

    var f = new F();

    f.init(selectors, options);
    return f;
 
};
