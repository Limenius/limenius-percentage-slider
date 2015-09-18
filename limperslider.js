'use strict';

//     Limperslider.js

//     (c) 2010-2015 Nacho Martín & Limenius
//     Limperslider may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/limenius/limenius-percentage-slider

(function(factory) {
    // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
    // We use `self` instead of `window` for `WebWorker` support.
    var root = (typeof self == 'object' && self.self == self && self) || (typeof global == 'object' && global.global == global && global);

    // AMD Compatibility
    if (typeof define === "function" && define.amd) {
        define("limperslider", [], function() {
            return factory(root);
        });
    // As a browser global
    } else {
        root.Limperslider = factory(root);
    }
}(function() {

    // Helpers
    // -------

    // Add a class to an element
    var addClass = function (element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else {
            element.className += ' ' + className;
        }
    };

    // Determine if a value is numeric
    var isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    //Returns true if o is a DOM element
    var isElement = function(o){
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
        );
    };

    // Calls the constructor, so it is properly initialized
    var Limperslider = function(selectors, options) {
        this.init(selectors, options);
    };

    // Prototype methods
    // -----------------
    //
    // These methods go into the prototype to make use of the *this* variable
    // and internal state
    Limperslider.prototype = {

        // On mouse down the world stops for us. We capture every move event until
        // mouseup.
        _onMouseDown: function(e) {
            document.removeEventListener("mousemove", this.onMouseMove, false);
            document.removeEventListener("mouseup", this.onMouseUp, false);
            document.addEventListener("mousemove", this.onMouseMove, false);
            document.addEventListener("mouseup", this.onMouseUp, false);
            document.removeEventListener("touchmove", this.onMouseMove, false);
            document.removeEventListener("touchend", this.onMouseUp, false);
            document.addEventListener("touchmove", this.onMouseMove, false);
            document.addEventListener("touchend", this.onMouseUp, false);
            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault();
            e.cancelBubble=true;
            e.returnValue=false;
            this.state.beingMoved = e.target;
            return false;
        },

        // On mouse move we move handlers and update inputs.
        _onMouseMove: function(e) {
            var handleIdx = this.state.beingMoved.getAttribute('limperidx');
            var percentage = this._getPercentage(e);
            this._setNewPosition(handleIdx, percentage);
            this._emitChange();
        },

        // On mouse up we release all listeners.
        _onMouseUp: function(e) {
            document.removeEventListener("touchmove", this.onMouseMove, false);
            document.removeEventListener("touchend", this.onMouseUp, false);
            document.removeEventListener("mousemove", this.onMouseMove, false);
            document.removeEventListener("mouseup", this.onMouseUp, false);
        },

        // Disable inputs so they cannot be modified directly by the user
        // otherwise we would have to check if the value is valid (all inputs 
        // combined add up to *total* and update the handlers.
        _hideInputs: function(selectors) {
            for (var i = 0; i < this.state.inputs.length; i++) {
                var input = this.state.inputs[i];
                input.setAttribute('readonly', 'readonly');
            }
        },

        // Move handlers, update inputs.
        _setNewPosition: function(handleIdx, percentage) {
            this.state.values[handleIdx] = (percentage / 100) * this.state.options.total;
            this._positionElements();
            this._setInputsFromPosition();
        },

        // Update inputs from position of the handlers.
        _setInputsFromPosition: function() {
            var prevVal = 0;
            for (var i = 0; i < this.state.inputs.length; i++) {
                this.state.inputs[i].setAttribute('value', (this.state.values[i] - prevVal).toFixed(this.state.options.decimals));
                prevVal = this.state.values[i];
            }
        },

        // Obtain the percentage that corresponds to the position of the mouse in
        // the screen.
        _getPercentage: function(e) {
            var eventPosition = e.pageX;
            var rect = this.state.el.getBoundingClientRect();
            var offset = rect.left;
            var size = rect.right - rect.left;
            var distanceToSlide = eventPosition - offset;
            var percentage = (distanceToSlide / size) * 100;
            var handleIdx = parseInt(this.state.beingMoved.getAttribute('limperidx'), 10);
            var maxPercentage = 100;
            if (handleIdx < this.state.handlers.length - 1) {
                maxPercentage = 100 * this.state.values[handleIdx + 1] / this.state.options.total;
            }
            var minPercentage = 0;
            if (handleIdx > 0) {
                minPercentage = 100 * this.state.values[handleIdx - 1] / this.state.options.total;
            }
            if (percentage < minPercentage) {
                return minPercentage;
            } else if (percentage > maxPercentage) {
                return maxPercentage;
            }
            return percentage;
        },

        // Create the handlers in their position
        _createHandlers: function (track) {
            for (var i = 0; i < this.state.inputs.length - 1; i++) {
                var handle = document.createElement('div');
                addClass(handle, 'limper-handle');
                handle.setAttribute('limperidx', i);
                track.appendChild(handle);
                this.state.handlers.push(handle);
                // Start listeing for mouse down events on these handlers.
                handle.addEventListener('mousedown', this.onMouseDown);
                handle.addEventListener('touchstart', this.onMouseDown);
            }
        },

        // Create the visual zones of each segment.
        _createZones: function (track) {
            for (var i = 0; i < this.state.inputs.length; i++) {
                var zone = document.createElement('div');
                addClass(zone, 'limper-zone');
                this.state.zones.push(track.appendChild(zone));
                var color = this.state.options.defaultColor;
                if (this.state.options.colors[i]) {
                    color = this.state.options.colors[i];
                }
                this.state.zones[i].style['background-color'] = color;
            }
        },

        // Create all the elements of the slider.
        _createElements: function() {
            var track = document.createElement('div');
            addClass(track, 'limper-track');
            this.state.el.appendChild(track);
            this._createZones(track);
            this._createHandlers(track);
        },

        // Obtain the initial values for the inputs.
        _computeInitialValues: function() {
            var aggregated = 0;
            // If the initial values are valid (they add up to the total), then
            // keep them.
            var allValidValues = true;
            for (var i = 0; i < this.state.inputs.length; i++) {
                var value = this.state.inputs[i].getAttribute('value');
                if (!isNumeric(value)) {
                    allValidValues = false;
                } else {
                    aggregated += parseFloat(value);
                    this.state.values.push(aggregated);
                }
            }
            // Otherwise distribute evenly the values.
            if (aggregated != this.state.options.total || !allValidValues) {
                this.state.values = [];
                var acc = 0;
                for (var i = 0; i < this.state.inputs.length - 1; i++) {
                    var increment = (this.state.options.total / this.state.inputs.length).toFixed(this.state.options.decimals);
                    acc += parseFloat(increment);
                    this.state.inputs[i].setAttribute('value', increment);
                    this.state.values.push(acc);
                }
                this.state.inputs[this.state.inputs.length - 1].setAttribute('value', (this.state.options.total - acc).toFixed(this.state.options.decimals));
                this.state.values.push(this.state.options.total);
            }
        },

        // Position the zones in the space according to the values
        _positionZones: function() {
            var prevVal = 0;
            for (var i = 0; i < this.state.zones.length; i++) {
                this.state.zones[i].style.left = ((prevVal / this.state.options.total) * 100) + '%';
                this.state.zones[i].style.width = ((this.state.values[i] - prevVal) * 100 / this.state.options.total) + '%';
                prevVal = this.state.values[i];
            }
        },

        // Position the handlers in the space according to the values
        _positionHandlers: function() {
            for (var i = 0; i < this.state.values.length - 1; i++) {
                this.state.handlers[i].style.left = (this.state.values[i] * 100 / this.state.options.total) + '%';
            }
        },

        // Position all elements
        _positionElements: function() {
            this._positionZones();
            this._positionHandlers();
        },

        // Dispatch an event when values change so user can capture it and do
        // something.
        _emitChange: function() {
            if (document.createEvent) {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('change', true, false);
                this.state.el.dispatchEvent(event);
            } else {
                this.state.el.fireEvent('onchange');
            }
        },

        // Creates options from options passed by the user and default values
        _setOptions: function(defaults, options) {
            var obj = {};
            var getOption = function(opt) {
                switch (opt) {
                    case 'total':
                        return options.total;
                        break;
                    default:
                        return options[opt];
                }
            };
            for (var opt in defaults) {
                obj[opt] = options && (opt in options) ? getOption(opt) : defaults[opt];
            }
            return obj;
        },

        // Constructor
        init: function (selectors, options) {
            var idlimper = '';
            var lastElement = null;

            this.state = {
                anchor : null,
                el: null,
                inputs: [],
                handlers: [],
                zones: [],
                values: [],
                beingMoved: null,
                options: {
                    selector: null,
                    element: null,
                    total: 100,
                    decimals: 0,
                    colors: [],
                    defaultColor: '#eee'
                }
            };

            // Bind the context (*this*) to the listeners of mouse events.
            // Otherwise they won't have access to the proper *this* variable.
            this.onMouseDown = this._onMouseDown.bind(this);
            this.onMouseUp = this._onMouseUp.bind(this);
            this.onMouseMove = this._onMouseMove.bind(this);

            this.state.options = this._setOptions(this.state.options, options);

            for (var i = 0; i < selectors.length; i++) {
                var selector = selectors[i];
                var selement = null;
                if (isElement(selector)) {
                    selement = selector;
                } else {
                    selement = document.querySelector(selector);
                }
                if (!selement) {
                    throw "element " + selector + " does not exist"
                }
                var id = selement.getAttribute('id');
                if (i > 0) {
                    idlimper += "-";
                }
                idlimper += id;
                this.state.inputs.push(selement);
                lastElement = selement;
            }

            idlimper += "-limper";

            this.state.el = document.createElement('div');
            addClass(this.state.el, 'limperslider');


            if (options && options.element) {
                options.element.appendChild(this.state.el);
                this.state.anchor = options.element;
            } else if (options && options.selector) {
                this.state.anchor = document.querySelector(options.selector);
                this.state.anchor.appendChild(this.state.el);
            } else {
                lastElement.insertAdjacentElement('afterend', this.state.el);
                this.state.anchor = lastElement;
            }

            this.state.el.setAttribute('id', idlimper);

            this._hideInputs(selectors);
            this._computeInitialValues();
            this._createElements();
            this._positionElements();
        },

        // Destructor
        destroy: function() {
            if (this.state.el && this.state.el.parentNode) {
                this.state.el.parentNode.removeChild(this.state.el);
            }
        }
    };

    return Limperslider;
}));
